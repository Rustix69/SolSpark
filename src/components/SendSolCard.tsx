import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, Check, FileInput, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

interface SendSolCardProps {
  setSolBalance: (balance: string) => void;
}

const SendSolCard: React.FC<SendSolCardProps> = ({ setSolBalance }) => {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  const [recipientAddress, setRecipientAddress] = useState('');
  const [txnAmount, setTxnAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSendSuccess, setIsSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleSendToAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected || !wallet.publicKey) return;
    
    try {
      setIsSending(true);
      setSendError('');
      
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: parseFloat(txnAmount) * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      
      // Update balance after successful transfer
      const balance = await connection.getBalance(wallet.publicKey);
      setSolBalance(String(balance / LAMPORTS_PER_SOL));
      
      setIsSendSuccess(true);
      toast.success(`${txnAmount} SOL sent to ${recipientAddress.slice(0, 8)}...${recipientAddress.slice(-4)}`);
      
      setTimeout(() => {
        setIsSendSuccess(false);
        setRecipientAddress('');
        setTxnAmount('');
      }, 3000);
    } catch (error: any) {
      console.error('Error sending transaction:', error);
      if (error.message?.includes('429')) {
        setSendError('Rate limit exceeded. Please try again later.');
        toast.error('Rate limit exceeded. Please try again later.');
      } else {
        setSendError('Failed to send transaction. Please try again.');
        toast.error('Failed to send transaction. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="glass-card flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-green-200/90 to-white bg-clip-text text-transparent flex items-center">
          <Send className="mr-2 h-5 w-5" />
          Send to Address
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        <form onSubmit={handleSendToAddress} className="space-y-4 flex flex-col h-full">
          <div>
            <Label htmlFor="recipient" className="text-sm text-sol-muted mb-2 block">Recipient Address</Label>
            <div className="relative">
              <Input
                id="recipient"
                placeholder="Enter wallet address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className={`bg-sol-dark border-sol-dark-border text-sol-light py-3 px-4 ${isSendSuccess ? 'border-sol-green' : ''}`}
                disabled={isSendSuccess}
              />
              {isSendSuccess && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-sol-green text-white rounded-full p-0.5">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="send-amount" className="text-sm text-sol-muted mb-2 block">Amount</Label>
            <div className="relative">
              <Input
                id="send-amount"
                type="number"
                placeholder="0.0"
                value={txnAmount}
                onChange={(e) => setTxnAmount(e.target.value)}
                className="bg-sol-dark border-sol-dark-border text-sol-light py-3 px-4"
                disabled={isSendSuccess}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sol-muted">
                SOL
              </div>
            </div>
          </div>

          {isSendSuccess && (
            <p className="text-sol-green text-sm mt-2 flex items-center">
              <Check className="h-3 w-3 mr-1" /> Transaction sent successfully!
            </p>
          )}
          
          {sendError && (
            <p className="text-red-500 text-sm mt-2">{sendError}</p>
          )}

          <div className={`${isSendSuccess ? 'pt-9' : 'pt-16'}`}>
            <CardFooter className="px-0 pb-0 pt-2">
              <Button
                type="submit"
                disabled={isSending || isSendSuccess || !recipientAddress}
                className="w-full py-6 text-lg bg-gradient-to-r from-sol-green to-sol-green/80 hover:from-sol-green-hover hover:to-sol-green border-0 shadow-[0_4px_20px_-4px_rgba(22,163,74,0.5)]"
              >
                {isSending ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : isSendSuccess ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Sent Successfully
                  </>
                ) : (
                  <>
                    <FileInput className="mr-2 h-5 w-5" />
                    Send Transaction
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

export default SendSolCard; 