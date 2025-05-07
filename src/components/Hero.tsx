import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wallet, Send, Loader, Check, FileInput, MessageSquare, Square, Signature } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// Import the card components
import AirdropCard from './AirdropCard';
import SendSolCard from './SendSolCard';
import SignMessageCard from './SignMessageCard';

const Hero = () => {
  // Wallet connection state
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();

  // State for SOL balance and network
  const [solBalance, setSolBalance] = useState('0.00');
  const [network, setNetwork] = useState('testnet');
  const starsContainerRef = useRef<HTMLDivElement>(null);

  const handleSolBalance = async () => {
    if (!connected || !publicKey) return;
    const balance = await connection.getBalance(publicKey);
    setSolBalance(String(balance / LAMPORTS_PER_SOL));
  }

  useEffect(() => {
    handleSolBalance();
  }, [connected, publicKey, connection]);

  // Stars background animation
  useEffect(() => {
    // Create stars
    if (starsContainerRef.current) {
      const container = starsContainerRef.current;
      container.innerHTML = '';

      const containerRect = container.getBoundingClientRect();
      const starCount = Math.floor((containerRect.width * containerRect.height) / 4000);

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Random size
        const size = Math.random() * 2 + 1;

        // Random animation delay and duration
        const delay = Math.random() * 10;
        const duration = Math.random() * 3 + 3;
        const opacity = Math.random() * 0.6 + 0.2;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--delay', `${delay}s`);
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--opacity', `${opacity}`);

        container.appendChild(star);
      }
    }
  }, []);

  return (
    <div className="hero-gradient min-h-screen flex flex-col items-center justify-center py-20 px-4">
      {/* Stars background */}
      <div ref={starsContainerRef} className="stars-container"></div>

      <div className="hero-content text-center w-full max-w-6xl">
        <div className="highlight-badge mb-6 animate-pulse-subtle">
          <span className="mr-2">✨</span>
          NEW: Now available on Devnet and Testnet
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 relative">
          <span className="bg-gradient-to-r from-white via-green-100/80 to-white/70 bg-clip-text text-transparent">
            Send SOL Instantly
          </span>
          <span className="text-sol-muted"> — </span>
          <span className="bg-gradient-to-r from-green-200/90 via-green-400/70 to-green-200/80 bg-clip-text text-transparent">
            Solana DAPP
          </span>
        </h1>

        <p className="text-sol-muted text-center max-w-2xl mx-auto mb-10 bg-gradient-to-r from-white/80 to-white/60 bg-clip-text">
          Connect your wallet and securely drop SOL tokens using Testnet or Devnet.
        </p>

        {!connected ? (
          <div className="w-full max-w-md mx-auto relative z-10">
            <WalletMultiButton />
          </div>
        ) : (
          <div className="w-full relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
            {/* SOL Balance and Airdrop Feature */}
            <AirdropCard
              solBalance={solBalance}
              setSolBalance={setSolBalance}
              network={network}
              setNetwork={setNetwork}
            />

            {/* Send to Address Feature */}
            <SendSolCard setSolBalance={setSolBalance} />

            {/* Sign Message Feature */}
            <SignMessageCard />
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
