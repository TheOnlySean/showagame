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
            padding: '20px',
            borderRadius: '8px',
            width: 'min(90vw, 360px)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowHintAd(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '5px',
                lineHeight: 1,
                zIndex: 2
              }}
            >
              ×
            </button>
            <h3 style={{ marginBottom: '15px', color: '#0288d1', textAlign: 'center' }}>ヒント</h3>
            <PlaceholderAd 
              width="100%" 
              height="640px" 
              onComplete={() => {
                setShowHintAd(false);
                onHint();
              }}
              onClose={() => setShowHintAd(false)}
            />
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
            padding: '20px',
            borderRadius: '8px',
            width: 'min(90vw, 360px)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowTimeAd(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '5px',
                lineHeight: 1,
                zIndex: 2
              }}
            >
              ×
            </button>
            <h3 style={{ marginBottom: '15px', color: '#388e3c', textAlign: 'center' }}>時間追加</h3>
            <PlaceholderAd 
              width="100%" 
              height="640px" 
              onComplete={() => {
                setShowTimeAd(false);
                onAddTime();
              }}
              onClose={() => setShowTimeAd(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ControlBar; 