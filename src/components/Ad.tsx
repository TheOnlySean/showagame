import React, { useState, useEffect, useRef } from 'react';

interface AdProps {
  width?: string;
  height?: string;
  onComplete?: () => void;
  onClose?: () => void;
  type?: 'hint' | 'time';
}

const Ad: React.FC<AdProps> = ({ 
  width = '100%', 
  height = '250px',
  onComplete,
  onClose,
  type = 'hint'
}) => {
  const [progress, setProgress] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // 加载 AdMax 广告脚本
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://adm.shinobi.jp/s/54ce8855c9f73bb652753d0ca73e3bfa';
      script.async = true;
      document.body.appendChild(script);
      scriptLoaded.current = true;
    }

    // 模拟广告加载
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // 模拟广告进度
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          if (onComplete) {
            onComplete();
          }
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      clearTimeout(loadingTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  const handleCloseAttempt = () => {
    if (progress < 100) {
      setShowConfirmModal(true);
    } else {
      onClose?.();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    onClose?.();
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);
  };

  const getAdContent = () => {
    if (type === 'hint') {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#0288d1', marginBottom: '20px' }}>ヒント広告</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            広告を最後まで視聴すると、<br/>
            まだ見つけていないアイテムを<br/>
            自動的に1つ見つけてくれます。
          </p>
          <div style={{
            width: '100%',
            height: '100px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <span style={{ color: '#0288d1' }}>ヒント広告プレースホルダー</span>
          </div>
        </div>
      );
    } else {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#388e3c', marginBottom: '20px' }}>時間延長広告</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            広告を最後まで視聴すると、<br/>
            ゲーム時間が30秒延長されます。
          </p>
          <div style={{
            width: '100%',
            height: '100px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <span style={{ color: '#388e3c' }}>時間延長広告プレースホルダー</span>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: '1px solid #ddd',
          margin: '0',
          padding: '0',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          width: '100%', 
          height: '100%', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isLoading ? (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 1
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #d35400',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          ) : (
            <div id="admax" style={{ width: '100%', height: '100%' }} />
          )}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: '#ddd'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: type === 'hint' ? '#0288d1' : '#388e3c',
              transition: 'width 0.1s linear'
            }} />
          </div>
          <button
            onClick={handleCloseAttempt}
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
          zIndex: 1000
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
              広告を途中で閉じると、ボーナス時間を獲得できません。<br/>
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
    </>
  );
};

export default Ad; 