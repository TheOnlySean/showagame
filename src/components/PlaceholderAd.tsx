import React, { useState, useEffect } from 'react';

interface PlaceholderAdProps {
  width?: string;
  height?: string;
  onComplete?: () => void;
}

const PlaceholderAd: React.FC<PlaceholderAdProps> = ({ 
  width = '100%', 
  height = '250px',
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

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

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCloseAttempt = () => {
    if (progress < 100) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setShowConfirmModal(false);
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
          width,
          height,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: '1px solid #ddd',
          margin: '20px 0',
          padding: '20px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {!isPlaying ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>
              広告を再生
            </div>
            <button
              onClick={handlePlay}
              style={{
                background: '#d35400',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>▶️</span> 再生する
            </button>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <video
              ref={videoRef}
              src="/videos/ad.mp4"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
              controls={false}
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
                fontSize: '20px'
              }}
            >
              ×
            </button>
          </div>
        )}
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
            <h3 style={{ marginBottom: '15px', color: '#d32f2f' }}>警告</h3>
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