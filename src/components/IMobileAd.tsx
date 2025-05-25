import React, { useEffect, useRef, useState } from 'react';

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
  requiredWatchTime?: number; // 新增：需要观看的时间（秒）
}

const IMobileAd: React.FC<IMobileAdProps> = ({ onComplete, onClose, requiredWatchTime = 30 }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [remainingTime, setRemainingTime] = useState(requiredWatchTime);
  const [canClose, setCanClose] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

    // 开始倒计时
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 清理
    return () => {
      clearInterval(timer);
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [requiredWatchTime]);

  const handleCloseAttempt = () => {
    if (canClose) {
      onComplete?.();
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    onClose?.();
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);
  };

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
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {!canClose && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {remainingTime}秒
          </div>
        )}
        <button
          onClick={handleCloseAttempt}
          style={{
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

      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '80%',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#d32f2f' }}>ご注意</h3>
            <p style={{ marginBottom: '20px' }}>
              広告を途中で閉じると、ボーナスを獲得できません。<br/>
              あと{remainingTime}秒で完了します。<br/>
              本当に閉じますか？
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleCancelClose}
                style={{
                  background: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                いいえ
              </button>
              <button
                onClick={handleConfirmClose}
                style={{
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                はい
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IMobileAd; 