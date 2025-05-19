import React, { useEffect } from 'react';

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
  useEffect(() => {
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
    };
  }, [onComplete, onClose]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '250px' }}>
      <div style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '250px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div id="im-3eba128ee24a4908a8fdb23c6bf2321c">
          <script async src="https://imp-adedge.i-mobile.co.jp/script/v1/spot.js?20220104"></script>
          <script dangerouslySetInnerHTML={{
            __html: `(window.adsbyimobile=window.adsbyimobile||[]).push({pid:83654,mid:583903,asid:1898156,type:"banner",display:"inline",elementid:"im-3eba128ee24a4908a8fdb23c6bf2321c"})`
          }} />
        </div>
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