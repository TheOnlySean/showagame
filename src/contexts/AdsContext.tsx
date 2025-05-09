import React, { createContext, useContext, useEffect, useState } from 'react';
import AdSenseService from '../services/AdMobService';

interface AdsContextType {
  showRewardedAd: (adUnitId: string) => Promise<void>;
  isAdReady: boolean;
}

const AdsContext = createContext<AdsContextType | null>(null);

export const useAds = () => {
  const context = useContext(AdsContext);
  if (!context) {
    throw new Error('useAds must be used within an AdsProvider');
  }
  return context;
};

interface AdsProviderProps {
  children: React.ReactNode;
  clientId: string;
  testMode?: boolean;
}

export const AdsProvider: React.FC<AdsProviderProps> = ({
  children,
  clientId,
  testMode = true,
}) => {
  const [isAdReady, setIsAdReady] = useState(false);
  const adsService = AdSenseService.getInstance();

  useEffect(() => {
    const initializeAds = async () => {
      try {
        await adsService.initialize({ clientId, testMode });
        setIsAdReady(true);
      } catch (error) {
        console.error('Failed to initialize AdSense:', error);
      }
    };

    initializeAds();
  }, [clientId, testMode]);

  const showRewardedAd = async (adUnitId: string) => {
    try {
      await adsService.showRewardedAd(adUnitId);
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      throw error;
    }
  };

  return (
    <AdsContext.Provider
      value={{
        showRewardedAd,
        isAdReady,
      }}
    >
      {children}
    </AdsContext.Provider>
  );
}; 