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
  const [isSimMode, setIsSimMode] = useState(false);

  // Demo token address map (replace with real Sapphire addresses)
  const tokenMap = useMemo(() => ({
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // placeholder for native
    DAI: process.env.NEXT_PUBLIC_DAI || '0x0000000000000000000000000000000000000001',
    USDC: process.env.NEXT_PUBLIC_USDC || '0x0000000000000000000000000000000000000002',
    WBTC: process.env.NEXT_PUBLIC_WBTC || '0x0000000000000000000000000000000000000003',
    UNI: process.env.NEXT_PUBLIC_UNI || '0x0000000000000000000000000000000000000004',
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
        try {
          const router = await c.swapRouter();
          setIsSimMode(router === '0x0000000000000000000000000000000000000000');
        } catch {}
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
    setStatus('Creating persona…');
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
    setStatus('Switching persona…');
    await (await contract.switchIdentity(id)).wait();
    setActivePersonaId(id);
    const p = personas.find(x => x.id === id);
    setActivePersona(p || null);
    await refreshTrades(id);
    setStatus('');
  };

  const onMidTradeSwitch = async (id) => {
    if (!contract) return;
    await (await contract.midTradeSwitch(id, true)).wait();
    setActivePersonaId(id);
    const p = personas.find(x => x.id === id);
    setActivePersona(p || null);
  };

  const onSwap = async ({ inputToken, outputToken, amount }) => {
    if (!contract || !activePersonaId) return;
    const inAddr = tokenMap[inputToken];
    const outAddr = tokenMap[outputToken];

    if (isSimMode) {
      // No approvals needed and we can assume 18 decimals for demo math
      setStatus('Swapping…');
      const amt = BigInt(Math.floor(amount * 1e18));
      const minOut = (amt * 98n) / 100n; // naive 2% slippage
      const tx = await contract.swapTokens(inAddr, outAddr, amt.toString(), minOut.toString());
      await tx.wait();
      setStatus('');
      await refreshTrades(activePersonaId);
      return;
    }

    // Real mode: require configured addresses and approvals
    if (!inAddr || !outAddr) {
      alert('Token addresses not configured');
      return;
    }

    setStatus('Approving…');
    const ercIn = await getERC20(inAddr);
    const decimals = await ercIn.decimals();
    const amt = BigInt(Math.floor(amount * 10 ** decimals));
    try {
      const tx1 = await ercIn.approve(contractAddress, amt.toString());
      await tx1.wait();
    } catch (e) {
      console.error(e);
    }
    setStatus('Swapping…');
    const minOut = (amt * 98n) / 100n; // naive 2% slippage
    const tx2 = await contract.swapTokens(inAddr, outAddr, amt.toString(), minOut.toString());
    await tx2.wait();
    setStatus('');
    await refreshTrades(activePersonaId);
  };

  return (
    <div>
      <Head>
        <title>Identity Shapeshifter DEX</title>
        <meta name="description" content="Privacy-first trading platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 bg-neutral-950 border-b border-neutral-900">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-white text-neutral-900 flex items-center justify-center font-black">IS</div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Identity Shapeshifter DEX</h1>
            </div>
            <div className="flex items-center gap-3">
              {personas?.length > 0 && (
                <select
                  value={activePersonaId || ''}
                  onChange={(e) => onSwitchPersona(e.target.value)}
                  className="input w-44"
                >
                  {personas.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
              {account ? (
                <span className="chip">{account.slice(0,6)}…{account.slice(-4)}</span>
              ) : (
                <button className="btn btn-primary" onClick={async ()=>{
                  await window.ethereum?.request({ method: 'eth_requestAccounts' });
                  location.reload();
                }}>Connect</button>
              )}
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 py-8">
          {!contractAddress && (
            <div className="mb-6 text-sm text-amber-300/90 bg-amber-500/10 border border-amber-400/30 rounded-lg p-3">
              Set NEXT_PUBLIC_SHAPESHIFTER_ADDR in .env.local to enable on-chain actions.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <aside className="md:col-span-1 card">
              <div className="card-body">
                <PersonaList personas={personas} activePersona={activePersonaId} onSwitchPersona={onSwitchPersona} onCreatePersona={onCreatePersona} />
              </div>
            </aside>

            <div className="md:col-span-2 space-y-6">
              <SwapForm activePersona={activePersona} onSwap={onSwap} personas={personas} onMidTradeSwitch={onMidTradeSwitch} />
              <TradeHistory activePersona={activePersona} trades={trades} />
              {status && (
                <div className="text-sm text-gray-400">{status}</div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-8 py-8 border-t border-neutral-900 text-center text-sm text-gray-500">
        Built on Oasis Sapphire & Uniswap
      </footer>
    </div>
  );
}
