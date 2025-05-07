import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader, Check, MessageSquare, Signature } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useWallet } from '@solana/wallet-adapter-react';
import { ed25519 } from "@noble/curves/ed25519";

const SignMessageCard: React.FC = () => {
  const wallet = useWallet();
  
  const [message, setMessage] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [isSignSuccess, setIsSignSuccess] = useState(false);
  const [signature, setSignature] = useState('');

  const handleSignMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.connected) {
      toast.error("Please connect your wallet");
      return;
    }
    
    if (!message.trim()) {
      toast.error('Please enter a message to sign');
      return;
    }
    
    try {
      setIsSigning(true);
      setIsSignSuccess(false);
      
      // Convert message to encoded bytes
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature from wallet
      const signatureBytes = await wallet.signMessage?.(encodedMessage);
      
      if (!signatureBytes) {
        throw new Error('Signature could not be generated');
      }
      
      // Log the Uint8Array signature
      console.log('Signature Uint8Array:', signatureBytes);
      
      // Verify the signature cryptographically
      const isValid = ed25519.verify(
        signatureBytes, 
        encodedMessage, 
        wallet.publicKey?.toBytes() || new Uint8Array()
      );
      
      if (!isValid) {
        throw new Error('Signature verification failed');
      }
      
      // Set success states
      setIsSignSuccess(true);
      setIsSigning(false);
      
      toast.success('Message signed successfully');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSignSuccess(false);
        setMessage('');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error signing message:', error);
      
      // Handle specific error cases
      if (error.message?.includes('429')) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else if (error.message === 'Signature could not be generated') {
        toast.error('Failed to generate signature. Please try again.');
      } else if (error.message === 'Signature verification failed') {
        toast.error('Signature verification failed. Please try again.');
      } else {
        toast.error('Failed to sign message. Please try again.');
      }
      
      // Reset states on error
      setIsSigning(false);
      setIsSignSuccess(false);
    }
  };

  return (
    <Card className="glass-card flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-green-200/90 to-white bg-clip-text text-transparent flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Sign Message
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        <form onSubmit={handleSignMessage} className="space-y-4 flex flex-col h-full">
          <div>
            <Label htmlFor="message" className="text-sm text-sol-muted mb-2 block">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter message to sign"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`bg-sol-dark border-sol-dark-border text-sol-light min-h-[80px] ${isSignSuccess ? 'border-sol-green' : ''}`}
              disabled={isSignSuccess}
            />
          </div>

          <div className="pt-24">
            <CardFooter className="px-0 pb-0 pt-2">
              <Button
                type="submit"
                disabled={isSigning || isSignSuccess || !message}
                className="w-full py-6 text-lg bg-gradient-to-r from-sol-green to-sol-green/80 hover:from-sol-green-hover hover:to-sol-green border-0 shadow-[0_4px_20px_-4px_rgba(22,163,74,0.5)]"
              >
                {isSigning ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" />
                    Signing...
                  </>
                ) : isSignSuccess ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Signed
                  </>
                ) : (
                  <>
                    <Signature className="mr-2 h-5 w-5" />
                    Sign Message
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

export default SignMessageCard; 