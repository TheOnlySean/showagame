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
  const adContainerRef = useRef<HTMLDivElement>(null);

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
      <div 
        ref={adContainerRef} 
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
        {/* i-mobile广告标签代码 */}
        <script type="text/javascript">
          {`
            var _imobile_ads = _imobile_ads || [];
            _imobile_ads.push({
              pid: 83654,
              mid: 583903,
          asid: 1898156,
          type: "banner",
          display: "inline",
          elementid: "im-324fdc83799a4edebb93cbcb7dbe1aea"
            });
          `}
        </script>
        <script type="text/javascript" src="https://imp-adedge.i-mobile.co.jp/script/v1/spot.js?20220104" async></script>
        <div id="im-324fdc83799a4edebb93cbcb7dbe1aea" style={{ width: '100%', height: '100%' }}></div>
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