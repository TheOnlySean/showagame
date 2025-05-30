import React, { useState, useEffect } from "react";
import type { Spot } from "../data/spots";
import IMobileAd from "./IMobileAd";

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingShareReward, setPendingShareReward] = useState(false);
  const [shareStartTime, setShareStartTime] = useState<number | null>(null);
  const [shareStep, setShareStep] = useState<'init'|'shared'>('init');

  const handleHint = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowHintAd(true);
  };

  const handleAddTime = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTimeAd(true);
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && pendingShareReward && shareStartTime) {
        const currentTime = Date.now();
        const timeDiff = currentTime - shareStartTime;
        if (timeDiff >= 3000) {
          setPendingShareReward(false);
          setShareStartTime(null);
          if (typeof window.onShareReward === 'function') {
            window.onShareReward();
          }
        } else {
          setPendingShareReward(false);
          setShareStartTime(null);
          alert('シェアを完了してください。');
          setShowShareModal(false);
          onShare?.();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pendingShareReward, shareStartTime, onShare]);

  const handleShare = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = encodeURIComponent(window.location.origin);
    const shareText = encodeURIComponent("昭和の間違い探しゲーム：懐かしい時代の写真で遊んでみませんか？");
    const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
    
    // 检查是否是 LINE 浏览器
    const isLineBrowser = /Line/.test(navigator.userAgent);
    if (isLineBrowser) {
      // 在 LINE 浏览器中，使用 LINE 的分享 API
      window.open(lineShareUrl, '_blank');
      setPendingShareReward(true);
      setShareStartTime(Date.now());
    } else {
      // 非 LINE 浏览器，使用原生分享 API
      if (navigator.share) {
        navigator.share({
          title: 'ゲームシェア',
          text: '昭和の間違い探しゲーム：懐かしい時代の写真で遊んでみませんか？',
          url: window.location.origin
        }).then(() => {
          // 分享成功
          if (typeof window.onShareReward === 'function') {
            window.onShareReward();
          }
        }).catch(() => {
          // 分享失败
          alert('シェアに失敗しました。もう一度お試しください。');
        });
      } else {
        // 如果浏览器不支持原生分享，则复制链接
        navigator.clipboard.writeText(window.location.origin).then(() => {
          alert('リンクをコピーしました。友達にシェアしてください。');
          if (typeof window.onShareReward === 'function') {
            window.onShareReward();
          }
        }).catch(() => {
          alert('リンクのコピーに失敗しました。もう一度お試しください。');
        });
      }
    }
  };

  const handleGetReward = () => {
    setShowShareModal(false);
    setShareStep('init');
    if (typeof window.onShareReward === 'function') {
      window.onShareReward();
    }
  };

  return (
    <>
      <div className="control-bar">
        <div className="found-list">
          {found.map(id => {
            const spot = spots.find(s => s.id === id);
            return (
              <div className="found-icon" key={id} title={spot?.desc}>
                <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#ffe082" stroke="#b77b4b" strokeWidth="2" /></svg>
              </div>
            );
          })}
          {Array(spots.length - found.length).fill(0).map((_, i) => (
            <div className="found-icon empty" key={i + 'empty'} />
          ))}
        </div>
        <div className="control-btns">
          <button
            className="hint-btn"
            onClick={handleHint}
            onTouchStart={handleHint}
          >
            <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#b3e5fc" stroke="#0288d1" strokeWidth="2" /><text x="14" y="19" textAnchor="middle" fontSize="16" fill="#0288d1">ヒ</text></svg>
            ヒント
          </button>
          <button
            className="addtime-btn"
            onClick={handleAddTime}
            onTouchStart={handleAddTime}
          >
            <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#c8e6c9" stroke="#388e3c" strokeWidth="2" /><text x="14" y="19" textAnchor="middle" fontSize="16" fill="#388e3c">＋</text></svg>
            時間延長
          </button>
          <button className="share-btn" onClick={handleShare}>
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
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#fff',
            padding: '12px',
            borderRadius: '8px',
            width: 'min(85vw, 320px)',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
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
              textAlign: 'left',
              flexShrink: 0
            }}>
              広告動画を最後まで視聴すると、<br/>
              まだ見つけていないアイテムを<br/>
              自動的に1つ見つけてくれます。<br/>
              <span style={{ color: '#0288d1', fontWeight: 'bold' }}>
                ※途中で閉じると機能は発動しません
              </span>
            </p>
            <div style={{ 
              flex: 1, 
              minHeight: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              touchAction: 'none'
            }}>
              <IMobileAd 
                onComplete={() => {
                  setShowHintAd(false);
                  onHint();
                }}
                onClose={() => setShowHintAd(false)}
                requiredWatchTime={10}
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
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#fff',
            padding: '12px',
            borderRadius: '8px',
            width: 'min(85vw, 320px)',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
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
              textAlign: 'left',
              flexShrink: 0
            }}>
              広告動画を最後まで視聴すると、<br/>
              ゲーム時間が60秒延長されます。<br/>
              <span style={{ color: '#388e3c', fontWeight: 'bold' }}>
                ※途中で閉じると延長されません
              </span>
            </p>
            <div style={{ 
              flex: 1, 
              minHeight: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              touchAction: 'none'
            }}>
              <IMobileAd 
                onComplete={() => {
                  setShowTimeAd(false);
                  onAddTime();
                }}
                onClose={() => setShowTimeAd(false)}
                requiredWatchTime={10}
              />
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '2em 1.5em 1.5em 1.5em',
            minWidth: 240,
            maxWidth: '90vw',
            textAlign: 'center',
            boxShadow: '0 4px 16px #b77b4b33',
            fontSize: '1.1em',
            color: '#b77b4b',
            fontWeight: 600
          }}>
            {shareStep === 'init' ? (
              <>
                このゲームを友だちにシェアすると、<br/>30秒延長されます！<br/><br/>
                <div style={{display:'flex', gap:'1.2em', justifyContent:'center', marginTop:'1.5em'}}>
                  <button style={{flex:1, background:'#e57373', color:'#fff', fontWeight:'bold', fontSize:'1em', border:'none', borderRadius:'12px', boxShadow:'0 2px 8px #b77b4b33', padding:'0.7em 0'}} onClick={()=>setShowShareModal(false)}>キャンセル</button>
                  <button style={{flex:1, background:'#388e3c', color:'#fff', fontWeight:'bold', fontSize:'1em', border:'none', borderRadius:'12px', boxShadow:'0 2px 8px #b77b4b33', padding:'0.7em 0'}} onClick={handleShare}>シェア</button>
                </div>
              </>
            ) : (
              <>
                シェアが完了したら、下のボタンを押してください！<br/><br/>
                <button style={{width:'100%', background:'#388e3c', color:'#fff', fontWeight:'bold', fontSize:'1.1em', border:'none', borderRadius:'12px', boxShadow:'0 2px 8px #b77b4b33', padding:'0.9em 0', marginTop:'1.2em'}} onClick={handleGetReward}>30秒延長を受け取る</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ControlBar; 