import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';
import PersonaList from '../components/PersonaList';
import SwapForm from '../components/SwapForm';
import TradeHistory from '../components/TradeHistory';
import { getProvider, getShapeshifter, getERC20 } from '../lib/contract';

export default function Home() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [personas, setPersonas] = useState([]);
  const [activePersonaId, setActivePersonaId] = useState(null);
  const [activePersona, setActivePersona] = useState(null);
  const [trades, setTrades] = useState([]);
  const [status, setStatus] = useState('');

  // Demo token address map (replace with real Sapphire addresses)
  const tokenMap = useMemo(() => ({
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // placeholder for native
    DAI: process.env.NEXT_PUBLIC_DAI || '',
    USDC: process.env.NEXT_PUBLIC_USDC || '',
    WBTC: process.env.NEXT_PUBLIC_WBTC || '',
    UNI: process.env.NEXT_PUBLIC_UNI || '',
  }), []);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = getProvider();
      const signerAddr = await provider.getSigner().getAddress();
      setAccount(signerAddr);
      // Optionally set deployed address from env
      const addr = process.env.NEXT_PUBLIC_SHAPESHIFTER_ADDR || '';
      setContractAddress(addr);
      if (addr) {
        const c = await getShapeshifter(addr);
        setContract(c);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchPersonas = async () => {
      if (!contract) return;
      const ids = await contract.getIdentityIds();
      const active = await contract.getActiveIdentity();
      setActivePersonaId(active);
      // Map to client objects: fetch names via getIdentity
      const items = await Promise.all(ids.map(async (id) => {
        const [name] = await contract.getIdentity(id);
        return { id, name };
      }));
      setPersonas(items);
      const ap = items.find(p => p.id === active);
      setActivePersona(ap || null);
      if (ap) await refreshTrades(ap.id);
    };
    fetchPersonas();
  }, [contract]);

  const refreshTrades = async (identityId) => {
    if (!contract || !identityId) return;
    const history = await contract.getSwapHistory(identityId);
    // Convert to UI trades; token symbols unknown, so leave addresses for now
    const uiTrades = history.map(h => ({
      inputToken: h.inputToken,
      outputToken: h.outputToken,
      amountIn: h.amountIn.toString(),
      amountOut: h.amountOut.toString(),
      timestamp: h.timestamp.toNumber(),
    }));
    setTrades(uiTrades);
  };

  const onCreatePersona = async (name) => {
    if (!contract) return;
    setStatus('Creating persona...');
    const meta = new TextEncoder().encode('opaque');
    const tx = await contract.createIdentity(name, meta);
    await tx.wait();
    setStatus('');
    const ids = await contract.getIdentityIds();
    const active = await contract.getActiveIdentity();
    setActivePersonaId(active);
    const items = await Promise.all(ids.map(async (id) => {
      const [n] = await contract.getIdentity(id);
      return { id, name: n };
    }));
    setPersonas(items);
    const ap = items.find(p => p.id === active);
    setActivePersona(ap || null);
  };

  const onSwitchPersona = async (id) => {
    if (!contract) return;
    setStatus('Switching persona...');
    await (await contract.switchIdentity(id)).wait();
    setActivePersonaId(id);
    const p = personas.find(x => x.id === id);
    setActivePersona(p || null);
    await refreshTrades(id);
    setStatus('');
  };

  const onSwap = async ({ inputToken, outputToken, amount }) => {
    if (!contract || !activePersonaId) return;
    const inAddr = tokenMap[inputToken];
    const outAddr = tokenMap[outputToken];
    if (!inAddr || !outAddr) {
      alert('Token addresses not configured');
      return;
    }
    setStatus('Approving...');
    const ercIn = await getERC20(inAddr);
    const decimals = await ercIn.decimals();
    const amt = BigInt(Math.floor(amount * 10 ** decimals));
    // Approve contract to pull tokens if using real router
    try {
      const tx1 = await ercIn.approve(contractAddress, amt.toString());
      await tx1.wait();
    } catch (e) {
      console.error(e);
    }
    setStatus('Swapping...');
    const minOut = (amt * 98n) / 100n; // naive 2% slippage
    const tx2 = await contract.swapTokens(inAddr, outAddr, amt.toString(), minOut.toString());
    const rc = await tx2.wait();
    setStatus('');
    await refreshTrades(activePersonaId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Identity Shapeshifter DEX</title>
        <meta name="description" content="Privacy-first trading platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Identity Shapeshifter DEX</h1>
          <div>
            {account ? (
              <span className="px-3 py-1 bg-gray-100 rounded text-sm">{account.slice(0,6)}...{account.slice(-4)}</span>
            ) : (
              <button className="px-4 py-2 bg-primary-500 text-white rounded" onClick={async ()=>{
                await window.ethereum?.request({ method: 'eth_requestAccounts' });
                location.reload();
              }}>Connect</button>
            )}
          </div>
        </div>

        <p className="text-xl mb-4">Trade with privacy using multiple personas on Oasis Sapphire</p>

        {!contractAddress && (
          <div className="p-3 mb-4 rounded bg-yellow-50 text-yellow-700 text-sm">
            Set NEXT_PUBLIC_SHAPESHIFTER_ADDR in .env.local to enable on-chain actions.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Persona Management</h2>
            <PersonaList personas={personas} activePersona={activePersonaId} onSwitchPersona={onSwitchPersona} onCreatePersona={onCreatePersona} />
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Token Swap</h2>
              <SwapForm activePersona={activePersona} onSwap={onSwap} />
              {status && <div className="mt-3 text-sm text-gray-600">{status}</div>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <TradeHistory activePersona={activePersona} trades={trades} />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center">
        <p>Built on Oasis Sapphire & Uniswap</p>
      </footer>
    </div>
  );
}
