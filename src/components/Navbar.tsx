
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 bg-gradient-to-b from-sol-dark to-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-sol-light">
          SolSpark
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#resources" className="nav-link">Resources</a>
          <a href="#community" className="nav-link">Community</a>
          <a href="#download" className="nav-link">Download</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="#signin" className="nav-link hidden md:inline-block">Sign In</a>
          <Button 
            onClick={() => setIsConnected(!isConnected)}
            className={`gap-2 px-5 transition-all ${isConnected ? 'bg-sol-dark-card border border-sol-green/30 hover:bg-sol-dark-card/80' : 'bg-sol-green hover:bg-sol-green-hover'}`}
          >
            <Wallet className="w-4 h-4" />
            {isConnected ? 'Connected' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
