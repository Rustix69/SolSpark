import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader, Check, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface AirdropCardProps {
  solBalance: string;
  setSolBalance: (balance: string) => void;
  network: string;
  setNetwork: (network: string) => void;
}

const AirdropCard: React.FC<AirdropCardProps> = ({
  solBalance,
  setSolBalance,
  network,
  setNetwork
}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  const [airdropAmt, setAirdropAmt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [airdropError, setAirdropError] = useState('');

  const requestAirdrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;
    
    try {
      setIsLoading(true);
      setAirdropError('');
      const amountToAirdrop = parseFloat(airdropAmt) * LAMPORTS_PER_SOL;
      const signature = await connection.requestAirdrop(publicKey, amountToAirdrop);

      // Wait for confirmation
      await connection.confirmTransaction(signature);

      // Update balance
      const balance = await connection.getBalance(publicKey);
      setSolBalance(String(balance / LAMPORTS_PER_SOL));

      setIsSuccess(true);
      toast.success(`${airdropAmt} SOL airdropped successfully`);
      setTimeout(() => {
        setIsSuccess(false);
        setAirdropAmt('');
      }, 3000);
    } catch (error: any) {
      console.error('Error requesting airdrop:', error);
      if (error.message?.includes('429')) {
        setAirdropError('Rate limit exceeded. Please try again later.');
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        setAirdropError('Failed to request airdrop. Please try again.');
        toast.error('Failed to request airdrop. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="glass-card flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-2 bg-gradient-to-r from-green-200/90 to-white bg-clip-text text-transparent">
          SOL Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div>
          <div className="text-3xl font-bold text-white mb-2">{solBalance} <span className="text-lg text-sol-muted">SOL</span></div>
          <div className="text-xs text-sol-muted">Network: {network}</div>
        </div>

        <form onSubmit={requestAirdrop} className="space-y-4 flex flex-col h-full">
          <div>
            <Label htmlFor="amount" className="text-sm text-sol-muted mb-2 block">Amount to Airdrop</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={airdropAmt}
                onChange={(e) => setAirdropAmt(e.target.value)}
                className={`bg-sol-dark border-sol-dark-border text-sol-light py-6 px-4 text-xl ${isSuccess ? 'border-sol-green' : ''} ${airdropError ? 'border-red-500' : ''}`}
                disabled={isLoading || isSuccess}
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
            {airdropError && (
              <p className="text-red-500 text-sm mt-2">{airdropError}</p>
            )}
            {isSuccess && (
              <p className="text-sol-green text-sm mt-2 flex items-center">
                <Check className="h-3 w-3 mr-1" /> Your SOL has been sent successfully!
              </p>
            )}
          </div>

          <div>
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

          <div className="mt-auto">
            <CardFooter className="px-0 pb-0 pt-2">
              <Button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full py-6 text-lg bg-gradient-to-r from-sol-green to-sol-green/80 hover:from-sol-green-hover hover:to-sol-green border-0 shadow-[0_4px_20px_-4px_rgba(22,163,74,0.5)]"
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
            </CardFooter>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AirdropCard; 