import { useState, useEffect } from 'react';

export default function TradeHistory({ activePersona, trades = [] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Trade History</h3>
      
      {activePersona ? (
        <>
          <div className="mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center">
                {activePersona.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{activePersona.name}</span>
            </div>
          </div>
          
          {trades.length > 0 ? (
            <div className="space-y-2">
              {trades.map((trade, index) => (
                <div key={index} className="border rounded p-3 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {trade.inputToken} → {trade.outputToken}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(trade.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      {trade.amountIn} {trade.inputToken}
                    </span>
                    <span className="text-primary-600">
                      {trade.amountOut} {trade.outputToken}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No trade history for this persona
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Select a persona to view trade history
        </div>
      )}
    </div>
  );
}
