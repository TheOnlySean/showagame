interface AdSenseConfig {
  clientId: string;
  testMode: boolean;
}

class AdSenseService {
  private static instance: AdSenseService;
  private isInitialized: boolean = false;
  private clientId: string = '';
  private testMode: boolean = true;

  private constructor() {}

  public static getInstance(): AdSenseService {
    if (!AdSenseService.instance) {
      AdSenseService.instance = new AdSenseService();
    }
    return AdSenseService.instance;
  }

  public initialize(config: AdSenseConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      this.clientId = config.clientId;
      this.testMode = config.testMode;

      // 加载 AdSense SDK
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.onload = () => {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: this.clientId,
            enable_page_level_ads: true
          });
          this.isInitialized = true;
          resolve();
        } else {
          reject(new Error('AdSense SDK failed to load'));
        }
      };
      script.onerror = () => {
        reject(new Error('Failed to load AdSense SDK'));
      };
      document.head.appendChild(script);
    });
  }

  public showRewardedAd(adUnitId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('AdSense not initialized'));
        return;
      }

      if (window.adsbygoogle) {
        // 创建广告容器
        const adContainer = document.createElement('div');
        adContainer.id = 'rewarded-ad-container';
        document.body.appendChild(adContainer);

        // 加载广告
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: this.clientId,
          enable_page_level_ads: true,
          overlays: {bottom: true},
          onRewarded: () => {
            resolve();
            document.body.removeChild(adContainer);
          },
          onError: (error: any) => {
            reject(error);
            document.body.removeChild(adContainer);
          }
        });
      } else {
        reject(new Error('AdSense SDK not available'));
      }
    });
  }
}

// 添加全局类型声明
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdSenseService; 