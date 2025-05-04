
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wallet, Send, Loader, Check } from 'lucide-react';
import { toast } from 'sonner';

const Hero = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('testnet');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const starsContainerRef = useRef<HTMLDivElement>(null);

  const connectWallet = () => {
    setIsLoading(true);
    
    // Simulating wallet connection
    setTimeout(() => {
      setIsWalletConnected(true);
      setIsLoading(false);
      toast.success('Wallet connected successfully');
    }, 1500);
  };

  const handleSendSOL = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    // Simulating transaction
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`${amount} SOL sent successfully on ${network}`);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setAmount('');
      }, 3000);
    }, 2000);
  };

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
      
      <div className="hero-content">
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

        <p className="text-sol-muted text-center max-w-2xl mb-10 bg-gradient-to-r from-white/80 to-white/60 bg-clip-text">
          Connect your wallet and securely drop SOL tokens using Testnet or Devnet.
        </p>

        <div className="w-full max-w-md relative z-10">
          {!isWalletConnected ? (
            <Button 
              onClick={connectWallet} 
              disabled={isLoading}
              className="w-full py-6 text-lg bg-gradient-to-r from-sol-green to-sol-green/80 hover:from-sol-green-hover hover:to-sol-green border-0 shadow-[0_4px_20px_-4px_rgba(22,163,74,0.5)]"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <form onSubmit={handleSendSOL} className="glass-card rounded-lg p-6">
              <div className="mb-6">
                <Label htmlFor="amount" className="text-sm text-sol-muted mb-2 block">Amount to Send</Label>
                <div className="relative">
                  <Input 
                    id="amount"
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`bg-sol-dark border-sol-dark-border text-sol-light py-6 px-4 text-xl ${isSuccess ? 'border-sol-green' : ''}`}
                    disabled={isSuccess}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sol-muted">
                    SOL
                  </div>
                  {isSuccess && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-sol-green text-white rounded-full p-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                {isSuccess && (
                  <p className="text-sol-green text-sm mt-2 flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Your SOL has been sent successfully!
                  </p>
                )}
              </div>

              <div className="mb-6">
                <Label className="text-sm text-sol-muted mb-2 block">Network</Label>
                <RadioGroup 
                  defaultValue="testnet" 
                  value={network}
                  onValueChange={setNetwork}
                  className="flex justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="testnet" id="testnet" className="border-sol-dark-border" disabled={isSuccess} />
                    <Label htmlFor="testnet" className="cursor-pointer">Testnet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="devnet" id="devnet" className="border-sol-dark-border" disabled={isSuccess} />
                    <Label htmlFor="devnet" className="cursor-pointer">Devnet</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading || isSuccess} 
                className={`w-full py-6 text-lg border-0 shadow-[0_4px_20px_-4px_rgba(22,163,74,0.5)] ${
                  isSuccess 
                    ? 'bg-gradient-to-r from-sol-green to-sol-green/80 hover:from-sol-green hover:to-sol-green'
                    : 'bg-gradient-to-r from-sol-green to-sol-green/80 hover:from-sol-green-hover hover:to-sol-green'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Send
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
