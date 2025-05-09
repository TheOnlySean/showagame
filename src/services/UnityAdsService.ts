interface UnityAdsConfig {
  gameId: string;
  testMode: boolean;
}

class UnityAdsService {
  private static instance: UnityAdsService;
  private isInitialized: boolean = false;
  private gameId: string = '';
  private testMode: boolean = true;

  private constructor() {}

  public static getInstance(): UnityAdsService {
    if (!UnityAdsService.instance) {
      UnityAdsService.instance = new UnityAdsService();
    }
    return UnityAdsService.instance;
  }

  public initialize(config: UnityAdsConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      this.gameId = config.gameId;
      this.testMode = config.testMode;

      // 加载 Unity Ads SDK
      const script = document.createElement('script');
      script.src = 'https://static.unityads.unity3d.com/sdk/unity-ads.js';
      script.async = true;
      script.onload = () => {
        if (window.unityAds) {
          window.unityAds.initialize(this.gameId, this.testMode);
          this.isInitialized = true;
          resolve();
        } else {
          reject(new Error('Unity Ads SDK failed to load'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load Unity Ads SDK'));
      };
      document.head.appendChild(script);
    });
  }

  public showRewardedAd(placementId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('Unity Ads not initialized'));
        return;
      }

      if (window.unityAds) {
        window.unityAds.showRewardedAd(placementId, {
          onComplete: () => {
            resolve();
          },
          onSkip: () => {
            reject(new Error('Ad was skipped'));
          },
          onError: (error: any) => {
            reject(error);
          }
        });
      } else {
        reject(new Error('Unity Ads SDK not available'));
      }
    });
  }

  public showInterstitialAd(placementId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('Unity Ads not initialized'));
        return;
      }

      if (window.unityAds) {
        window.unityAds.showInterstitialAd(placementId, {
          onComplete: () => {
            resolve();
          },
          onSkip: () => {
            reject(new Error('Ad was skipped'));
          },
          onError: (error: any) => {
            reject(error);
          }
        });
      } else {
        reject(new Error('Unity Ads SDK not available'));
      }
    });
  }
}

// 添加全局类型声明
declare global {
  interface Window {
    unityAds: any;
  }
}

export default UnityAdsService; 