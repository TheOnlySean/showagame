import React, { useEffect, useRef } from 'react';

// 声明全局类型
declare global {
  interface Window {
    adsbyimobile?: any[];
  }
}

interface IMobileAdProps {
  onComplete?: () => void;
  onClose?: () => void;
}

const IMobileAd: React.FC<IMobileAdProps> = ({ onComplete, onClose }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let retryCount = 0;
    const maxRetries = 3;

    const initializeAd = () => {
      console.log('Initializing i-mobile ad with config:', {
        pid: 83654,
        mid: 583903,
        asid: 1898156,
        type: "banner",
        display: "inline",
        elementid: "im-324fdc83799a4edebb93cbcb7dbe1aea"
      });
      
      if (window.adsbyimobile) {
        window.adsbyimobile.push({
          pid: 83654,
          mid: 583903,
          asid: 1898156,
          type: "banner",
          display: "inline",
          elementid: "im-324fdc83799a4edebb93cbcb7dbe1aea"
        });
      } else {
        console.error('adsbyimobile not found in window object');
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying initialization (${retryCount}/${maxRetries})...`);
          setTimeout(initializeAd, 1000); // 1秒后重试
        }
      }
    };

    const loadScript = () => {
      // 移除可能存在的旧脚本
      const oldScript = document.querySelector('script[src*="imp-adedge.i-mobile.co.jp"]');
      if (oldScript) {
        document.body.removeChild(oldScript);
      }

      // 创建新脚本
      script = document.createElement('script');
      script.src = 'https://imp-adedge.i-mobile.co.jp/script/v1/spot.js?20220104';
      script.async = true;
      
      script.onload = () => {
        console.log('i-mobile script loaded');
        // 给脚本一点时间来初始化window.adsbyimobile
        setTimeout(initializeAd, 500);
      };

      script.onerror = (error) => {
        console.error('Failed to load i-mobile script:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying script load (${retryCount}/${maxRetries})...`);
          setTimeout(loadScript, 1000); // 1秒后重试
        }
      };

      document.body.appendChild(script);
    };

    // 开始加载脚本
    loadScript();

    // 监听广告加载完成事件
    const handleAdComplete = () => {
      console.log('i-mobile ad completed');
      if (onComplete) {
        onComplete();
      }
    };

    // 监听广告关闭事件
    const handleAdClose = () => {
      console.log('i-mobile ad closed');
      if (onClose) {
        onClose();
      }
    };

    // 添加事件监听器
    window.addEventListener('imobileAdComplete', handleAdComplete);
    window.addEventListener('imobileAdClose', handleAdClose);

    return () => {
      // 清理事件监听器
      window.removeEventListener('imobileAdComplete', handleAdComplete);
      window.removeEventListener('imobileAdClose', handleAdClose);
      // 移除脚本
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onComplete, onClose]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '250px' }}>
      <div 
        ref={adContainerRef} 
        id="im-324fdc83799a4edebb93cbcb7dbe1aea" 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '250px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} 
      >
        <div style={{ color: '#666', fontSize: '14px' }}>広告を読み込み中...</div>
      </div>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 2
        }}
      >
        ×
      </button>
    </div>
  );
};

export default IMobileAd; 