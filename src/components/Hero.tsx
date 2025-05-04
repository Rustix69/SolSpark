
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wallet, Send, Loader } from 'lucide-react';
import { toast } from 'sonner';

const Hero = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('testnet');
  const [isLoading, setIsLoading] = useState(false);

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

    // Simulating transaction
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${amount} SOL sent successfully on ${network}`);
      setAmount('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
      <div className="highlight-badge mb-6 animate-pulse-subtle">
        <span className="mr-2">✨</span>
        NEW: Now available on Devnet and Testnet
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
        Send SOL Instantly <span className="text-sol-muted">—</span> Solana DAPP
      </h1>

      <p className="text-sol-muted text-center max-w-2xl mb-10">
        Connect your wallet and securely drop SOL tokens using Testnet or Devnet.
      </p>

      <div className="w-full max-w-md">
        {!isWalletConnected ? (
          <Button 
            onClick={connectWallet} 
            disabled={isLoading}
            className="w-full py-6 text-lg bg-sol-green hover:bg-sol-green-hover"
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
          <form onSubmit={handleSendSOL} className="bg-sol-dark-card border border-sol-dark-border rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <Label htmlFor="amount" className="text-sm text-sol-muted mb-2 block">Amount to Send</Label>
              <div className="relative">
                <Input 
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-sol-dark border-sol-dark-border text-sol-light py-6 px-4 text-xl"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sol-muted">
                  SOL
                </div>
              </div>
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
                  <RadioGroupItem value="testnet" id="testnet" className="border-sol-dark-border" />
                  <Label htmlFor="testnet" className="cursor-pointer">Testnet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="devnet" id="devnet" className="border-sol-dark-border" />
                  <Label htmlFor="devnet" className="cursor-pointer">Devnet</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-6 text-lg bg-sol-green hover:bg-sol-green-hover"
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
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
  );
};

export default Hero;
