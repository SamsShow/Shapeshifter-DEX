import { useState, useEffect } from 'react';

export default function TradeHistory({ activePersona, trades = [] }) {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-base font-semibold mb-4 text-gray-200">Trade History</h3>
        
        {activePersona ? (
          <>
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-6 h-6 rounded-full bg-white text-neutral-900 flex items-center justify-center font-semibold">
                  {activePersona.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{activePersona.name}</span>
              </div>
            </div>
            
            {trades.length > 0 ? (
              <div className="space-y-2">
                {trades.map((trade, index) => (
                  <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-100">
                          {trade.inputToken} → {trade.outputToken}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(trade.timestamp * 1000).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {trade.amountIn} {trade.inputToken}
                      </span>
                      <span className="text-gray-100">
                        {trade.amountOut} {trade.outputToken}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border border-dashed border-neutral-800 rounded-lg">
                No trade history for this persona
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 border border-dashed border-neutral-800 rounded-lg">
            Select a persona to view trade history
          </div>
        )}
      </div>
    </div>
  );
}
