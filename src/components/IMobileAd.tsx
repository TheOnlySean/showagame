import React, { useEffect, useRef } from 'react';

// 声明全局类型
declare global {
  interface Window {
    adsbyimobile?: any[];
    _imobile_ads?: any;
  }
}

interface IMobileAdProps {
  onComplete?: () => void;
  onClose?: () => void;
}

const IMobileAd: React.FC<IMobileAdProps> = ({ onComplete, onClose }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 清空广告容器
    if (adRef.current) {
      adRef.current.innerHTML = '';
    }

    // 创建广告位div
    const adDiv = document.createElement('div');
    adDiv.id = 'im-3eba128ee24a4908a8fdb23c6bf2321c';
    adDiv.style.width = '100%';
    adDiv.style.height = '100%';
    if (adRef.current) {
      adRef.current.appendChild(adDiv);
    }

    // 插入广告脚本
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://imp-adedge.i-mobile.co.jp/script/v1/spot.js?20220104';
    if (adRef.current) {
      adRef.current.appendChild(script1);
    }

    // 插入广告初始化脚本
    const script2 = document.createElement('script');
    script2.innerHTML = '(window.adsbyimobile=window.adsbyimobile||[]).push({pid:83654,mid:583903,asid:1898156,type:"banner",display:"inline",elementid:"im-3eba128ee24a4908a8fdb23c6bf2321c"})';
    if (adRef.current) {
      adRef.current.appendChild(script2);
    }

    // 清理
    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '250px' }}>
      <div
        ref={adRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '250px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
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