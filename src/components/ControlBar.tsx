import React, { useState } from "react";
import type { Spot } from "../data/spots";
import PlaceholderAd from "./PlaceholderAd";

interface ControlBarProps {
  found: number[];
  spots: Spot[];
  onHint: () => void;
  onAddTime: () => void;
  onShare: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  found,
  spots,
  onHint,
  onAddTime,
  onShare,
}) => {
  const [showHintAd, setShowHintAd] = useState(false);
  const [showTimeAd, setShowTimeAd] = useState(false);

  const handleHint = () => {
    setShowHintAd(true);
  };

  const handleAddTime = () => {
    setShowTimeAd(true);
  };

  return (
    <>
      <div className="control-bar">
        <div className="found-list">
          {found.map(id => {
            const spot = spots.find(s => s.id === id);
            return (
              <div className="found-icon" key={id} title={spot?.desc}>
                {/* SVG佔位icon */}
                <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#ffe082" stroke="#b77b4b" strokeWidth="2" /></svg>
              </div>
            );
          })}
          {/* 補足空位 */}
          {Array(spots.length - found.length).fill(0).map((_, i) => (
            <div className="found-icon empty" key={i + 'empty'} />
          ))}
        </div>
        <div className="control-btns">
          <button
            className="hint-btn"
            onClick={handleHint}
          >
            <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#b3e5fc" stroke="#0288d1" strokeWidth="2" /><text x="14" y="19" textAnchor="middle" fontSize="16" fill="#0288d1">ヒ</text></svg>
            ヒント
          </button>
          <button
            className="addtime-btn"
            onClick={handleAddTime}
          >
            <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#c8e6c9" stroke="#388e3c" strokeWidth="2" /><text x="14" y="19" textAnchor="middle" fontSize="16" fill="#388e3c">＋</text></svg>
            時間追加
          </button>
          <button className="share-btn" onClick={onShare}>
            <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#ffe0b2" stroke="#f57c00" strokeWidth="2" /><text x="14" y="19" textAnchor="middle" fontSize="16" fill="#f57c00">シ</text></svg>
            シェア
          </button>
        </div>
      </div>

      {showHintAd && (
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
            padding: '12px',
            borderRadius: '8px',
            width: 'min(85vw, 320px)',
            position: 'relative',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <p style={{ 
              margin: '0', 
              color: '#666',
              fontSize: '0.8em',
              lineHeight: '1.4',
              textAlign: 'left'
            }}>
              広告動画を最後まで視聴すると、<br/>
              まだ見つけていないアイテムを<br/>
              自動的に1つ見つけてくれます。<br/>
              <span style={{ color: '#0288d1', fontWeight: 'bold' }}>
                ※途中で閉じると機能は発動しません
              </span>
            </p>
            <div style={{ flex: 1, minHeight: 0, height: 'calc(90vh - 120px)' }}>
              <PlaceholderAd 
                width="100%" 
                height="100%" 
                onComplete={() => {
                  setShowHintAd(false);
                  onHint();
                }}
                onClose={() => setShowHintAd(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showTimeAd && (
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
            padding: '12px',
            borderRadius: '8px',
            width: 'min(85vw, 320px)',
            position: 'relative',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <p style={{ 
              marginBottom: '8px', 
              color: '#666',
              fontSize: '0.8em',
              lineHeight: '1.4',
              textAlign: 'left'
            }}>
              広告動画を最後まで視聴すると、<br/>
              ゲーム時間が60秒追加されます。<br/>
              <span style={{ color: '#388e3c', fontWeight: 'bold' }}>
                ※途中で閉じると時間は追加されません
              </span>
            </p>
            <div style={{ flex: 1, minHeight: 0 }}>
              <PlaceholderAd 
                width="100%" 
                height="100%" 
                onComplete={() => {
                  setShowTimeAd(false);
                  onAddTime();
                }}
                onClose={() => setShowTimeAd(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ControlBar; 