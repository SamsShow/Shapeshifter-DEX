import { useState } from 'react';

export default function SwapForm({ activePersona, onSwap, personas = [], onMidTradeSwitch }) {
  const [inputToken, setInputToken] = useState('ETH');
  const [outputToken, setOutputToken] = useState('DAI');
  const [amount, setAmount] = useState('');
  const [midSwitchId, setMidSwitchId] = useState('');
  
  // Demo tokens for the prototype
  const tokens = ['ETH', 'DAI', 'USDC', 'WBTC', 'UNI'];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount && inputToken && outputToken) {
      // Optional mid-trade switch before executing swap
      if (midSwitchId && onMidTradeSwitch) {
        await onMidTradeSwitch(midSwitchId);
      }
      onSwap({
        inputToken,
        outputToken,
        amount: parseFloat(amount)
      });
    }
  };
  
  const handleTokenSwitch = () => {
    const temp = inputToken;
    setInputToken(outputToken);
    setOutputToken(temp);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-4">
          <h3 className="text-base font-semibold mb-2 text-gray-200">Trade</h3>
          
          {activePersona ? (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-6 h-6 rounded-full bg-white text-neutral-900 flex items-center justify-center font-semibold" aria-hidden>
                {activePersona.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{activePersona.name}</span>
              <span className="chip">Active persona</span>
            </div>
          ) : (
            <div className="text-amber-400 text-sm">
              No active persona selected
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Swap form">
          {/* Input token */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="amount">
              From
            </label>
            <div className="flex gap-2">
              <input
                id="amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="input"
                disabled={!activePersona}
                required
                aria-describedby="amount-help"
              />
              <select
                aria-label="Input token"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="input w-32"
                disabled={!activePersona}
              >
                {tokens.filter(t => t !== outputToken).map(token => (
                  <option key={token} value={token}>{token}</option>
                ))}
              </select>
            </div>
            <p id="amount-help" className="text-xs text-gray-500 mt-1">Estimated 2% slippage in simulation.</p>
          </div>
          
          {/* Switch tokens button */}
          <div className="flex justify-center">
            <button 
              type="button" 
              onClick={handleTokenSwitch}
              className="btn btn-ghost w-8 h-8 rounded-full p-0"
              disabled={!activePersona}
              aria-label="Switch input and output tokens"
              title="Switch tokens"
            >
              ⇅
            </button>
          </div>
          
          {/* Output token */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="output">
              To (estimated)
            </label>
            <div className="flex gap-2">
              <div id="output" className="input bg-neutral-900/70 border-dashed text-gray-300">
                {amount ? parseFloat(amount * 0.98).toFixed(6) : '0.0'}
              </div>
              <select
                aria-label="Output token"
                value={outputToken}
                onChange={(e) => setOutputToken(e.target.value)}
                className="input w-32"
                disabled={!activePersona}
              >
                {tokens.filter(t => t !== inputToken).map(token => (
                  <option key={token} value={token}>{token}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mid-trade switch (demo) */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1" htmlFor="mid-switch">
              Mid-trade switch (optional)
            </label>
            <div className="flex gap-2">
              <select
                id="mid-switch"
                value={midSwitchId}
                onChange={(e) => setMidSwitchId(e.target.value)}
                className="input"
                disabled={!activePersona}
              >
                <option value="">Keep current persona</option>
                {personas.filter(p => p.id !== activePersona?.id).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!activePersona || !amount}
            aria-label="Execute swap"
          >
            Swap
          </button>
        </form>
      </div>
    </div>
  );
}
