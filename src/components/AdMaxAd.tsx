import React, { useEffect, useRef, useState } from 'react';

interface AdMaxAdProps {
  onComplete: () => void;
  onClose: () => void;
}

const AdMaxAd: React.FC<AdMaxAdProps> = ({ onComplete, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // 加载AdMax脚本
    const script = document.createElement('script');
    script.src = 'https://adm.shinobi.jp/s/54ce8855c9f73bb652753d0ca73e3bfa';
    script.async = true;
    document.body.appendChild(script);

    // 设置加载完成后的回调
    script.onload = () => {
      setIsLoading(false);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // 开始倒计时
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, onComplete]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          zIndex: 1
        }}>
          広告を読み込み中...
        </div>
      )}
      <div 
        ref={adContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          opacity: isLoading ? 0 : 1
        }}
      >
        {/* AdMax广告将在这里渲染 */}
      </div>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '8px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        textAlign: 'center',
        fontSize: '0.9em',
        zIndex: 2
      }}>
        残り時間: {timeLeft}秒
      </div>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default AdMaxAd; 