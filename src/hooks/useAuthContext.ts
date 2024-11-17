import { useState, useEffect } from 'react';
import { BrowserProvider, Eip1193Provider } from 'ethers';

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      on: (eventName: string, listener: (...args: never[]) => void) => void;
      removeListener: (eventName: string, listener: (...args: never[]) => void) => void;
    };
  }
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setProvider(new BrowserProvider(window.ethereum));
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', () => {});
        }
      };
    }
  }, []);

  return { provider, account, connectWallet, disconnectWallet };
}