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
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
const Hero = () => {

  // Wallet connection state
  const { connection } = useConnection();
  const { connected } = useWallet();
  const wallet = useWallet();

  // State for the amount to send
  const [airdropAmt, setAirdropAmt] = useState('');
  const [network, setNetwork] = useState('testnet');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [airdropError, setAirdropError] = useState('');
  const starsContainerRef = useRef<HTMLDivElement>(null);

  // New states for additional functionality
  const [solBalance, setSolBalance] = useState('0.00');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSendSuccess, setIsSendSuccess] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSignSuccess, setIsSignSuccess] = useState(false);
  const [signature, setSignature] = useState('');
  const [txnAmount, setTxnAmount] = useState('');
  const [sendError, setSendError] = useState('');
  const handleSolBalance = async () => {
    if (!connected) return;
    const balance = await connection.getBalance(wallet.publicKey);
    setSolBalance(String(balance / LAMPORTS_PER_SOL));
  }

  useEffect(() => {
    handleSolBalance();
  }, [connected, wallet.publicKey, solBalance, airdropAmt, txnAmount]);

  const requestAirdrop = async () => {
    if (!connected) return;
    try {
      setIsLoading(true);
      setAirdropError('');
      const amountToAirdrop = parseFloat(airdropAmt) * LAMPORTS_PER_SOL;
      const signature = await connection.requestAirdrop(wallet.publicKey, amountToAirdrop);

      // Wait for confirmation
      await connection.confirmTransaction(signature);

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


  const handleSendToAddress = async () => {
    const transaction = new Transaction();
    if (!connected) return;
    try {
      setIsSending(true);
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: parseFloat(txnAmount) * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
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

  const handleSignMessage = async () => {
    if (!connected) return;
  };

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
            {/* SOL Balance and Send Feature */}
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

            {/* Send to Address Feature */}
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
                  {/* <p className="text-sol-green text-sm mt-2 flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Transaction sent successfully!
                  </p> */}

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

            {/* Sign Message Feature */}
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

                  <div className="mt-auto">
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

                  {isSignSuccess && signature && (
                    <div className="mt-4">
                      <Label className="text-sm text-sol-muted mb-2 block">Signature</Label>
                      <div className="bg-sol-dark border border-sol-green/30 rounded-md p-3 text-xs text-sol-muted overflow-x-auto">
                        <code>{signature}</code>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
