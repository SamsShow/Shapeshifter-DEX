import { useState } from 'react';

export default function SwapForm({ activePersona, onSwap }) {
  const [inputToken, setInputToken] = useState('ETH');
  const [outputToken, setOutputToken] = useState('DAI');
  const [amount, setAmount] = useState('');
  
  // Demo tokens for the prototype
  const tokens = ['ETH', 'DAI', 'USDC', 'WBTC', 'UNI'];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount && inputToken && outputToken) {
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
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Trade with Persona</h3>
        
        {activePersona ? (
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center">
              {activePersona.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{activePersona.name}</span>
          </div>
        ) : (
          <div className="text-yellow-600 text-sm">
            No active persona selected
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Input token */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={!activePersona}
              required
            />
            <select
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={!activePersona}
            >
              {tokens.filter(t => t !== outputToken).map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Switch tokens button */}
        <div className="flex justify-center my-2">
          <button 
            type="button" 
            onClick={handleTokenSwitch}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
            disabled={!activePersona}
          >
            ↓
          </button>
        </div>
        
        {/* Output token */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To (estimated)
          </label>
          <div className="flex space-x-2">
            <div className="flex-1 px-3 py-2 border rounded-lg bg-gray-100">
              {amount ? parseFloat(amount * 0.98).toFixed(6) : '0.0'}
            </div>
            <select
              value={outputToken}
              onChange={(e) => setOutputToken(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={!activePersona}
            >
              {tokens.filter(t => t !== inputToken).map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!activePersona || !amount}
        >
          Swap
        </button>
      </form>
    </div>
  );
}
