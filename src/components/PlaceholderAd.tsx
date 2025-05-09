import React, { useState, useEffect } from 'react';

interface PlaceholderAdProps {
  width?: string;
  height?: string;
  onComplete?: () => void;
  onClose?: () => void;
}

const PlaceholderAd: React.FC<PlaceholderAdProps> = ({ 
  width = '100%', 
  height = '250px',
  onComplete,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentAd, setCurrentAd] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // 随机选择一个广告视频
  const getRandomAd = () => {
    const ads = [
      'https://firebasestorage.googleapis.com/v0/b/angelsphoto-d2998.firebasestorage.app/o/for%20game%20use%2Fad-1.mp4?alt=media&token=9bc45fda-ae79-4cf2-8318-b7ccf17c90f1',
      'https://firebasestorage.googleapis.com/v0/b/angelsphoto-d2998.firebasestorage.app/o/for%20game%20use%2Fad-2.mp4?alt=media&token=0f01fa72-163f-4cf3-8f62-4a21a8fe4604',
      'https://firebasestorage.googleapis.com/v0/b/angelsphoto-d2998.firebasestorage.app/o/for%20game%20use%2Fad-3.mp4?alt=media&token=07f67f09-cb1d-45c9-a5b2-e8c8e6f55801'
    ];
    const randomIndex = Math.floor(Math.random() * ads.length);
    return ads[randomIndex];
  };

  useEffect(() => {
    if (videoRef.current) {
      setCurrentAd(getRandomAd());
      setIsLoading(true);
      
      // 监听视频加载完成事件
      const handleCanPlay = () => {
        setIsLoading(false);
        videoRef.current?.play();
        setIsPlaying(true);
      };

      videoRef.current.addEventListener('canplay', handleCanPlay);
      return () => {
        videoRef.current?.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      const video = videoRef.current;
      const timer = setInterval(() => {
        if (video.currentTime >= video.duration) {
          setIsPlaying(false);
          setProgress(100);
          onComplete?.();
          clearInterval(timer);
        } else {
          setProgress((video.currentTime / video.duration) * 100);
        }
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isPlaying, onComplete]);

  const handleCloseAttempt = () => {
    if (progress < 100) {
      setShowConfirmModal(true);
    } else {
      onClose?.();
    }
  };

  const handleConfirmClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setShowConfirmModal(false);
    onClose?.();
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);
    if (videoRef.current) {
      videoRef.current.play();
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
          )}
          <video
            ref={videoRef}
            src={currentAd}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '4px',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            controls={false}
            playsInline
            autoPlay
          />
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
              backgroundColor: '#d35400',
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
          <a
            href="https://angelsphoto.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#d35400',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 2
            }}
          >
            今すぐ試し
          </a>
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
            <h3 style={{ marginBottom: '15px', color: '#d32f2f' }}>注意</h3>
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
                キャンセル
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
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceholderAd; 