import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Identity Shapeshifter DEX</title>
        <meta name="description" content="Privacy-first trading platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <h1 className="text-4xl font-bold mb-6">
          Identity Shapeshifter DEX
        </h1>
        
        <p className="text-xl mb-8">
          Trade with privacy using multiple personas on Oasis Sapphire
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Persona Management</h2>
            <p className="mb-4">Create and switch between trading personas</p>
            {/* Persona components will go here */}
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              Persona selection components coming soon
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Token Swap</h2>
            <p className="mb-4">Swap tokens anonymously with your active persona</p>
            {/* Swap components will go here */}
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              Swap interface components coming soon
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
