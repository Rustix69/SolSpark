import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader, Wallet } from 'lucide-react';

const Navbar = () => {
  const { connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 bg-gradient-to-b from-sol-dark to-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-sol-light">
          SolSpark
        </a>

        <div className="flex items-center gap-3">
          <div className="wallet-adapter-button-trigger">
            <WalletMultiButton className="w-full py-6 text-lg bg-gradient-to-r from-sol-green to-sol-green/80 hover:from-sol-green-hover hover:to-sol-green border-0 shadow-[0_4px_20px_-4px_rgba(22,163,74,0.5)]">
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  {connected ? 'Connected' : 'Connect Wallet'}
                </>
              )}
            </WalletMultiButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
