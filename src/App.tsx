import React, { useState, useEffect, useRef } from "react";
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import TopBar from "./components/TopBar";
import BackButton from "./components/BackButton";
import PauseButton from "./components/PauseButton";
import GameBoard from "./components/GameBoard";
import ControlBar from "./components/ControlBar";
import { levels } from "./data/levels";
import Home from "./pages/Home";
import LevelSelect from "./pages/LevelSelect";
import { AdsProvider } from './contexts/AdsContext';
import PlaceholderAd from './components/PlaceholderAd';
import './App.css';
// import type { Spot } from "./data/spots";

const TOTAL_TIME = 120; // 秒

declare global {
  interface Window {
    _globalBGM?: HTMLAudioElement;
    onShareReward?: () => void;
  }
}

function GamePage() {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const level = levels.find(l => l.id === Number(levelId)) || levels[0];
  const [found, setFound] = useState<number[]>([]);
  const [time, setTime] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showDemoEnd, setShowDemoEnd] = useState(false);
  const [showTimeAd, setShowTimeAd] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingShareReward, setPendingShareReward] = useState(false);

  // 监听 levelId 变化，重置游戏状态
  useEffect(() => {
    setFound([]); // 清空已找到的热点
    setTime(TOTAL_TIME); // 重置时间
    setGameOver(false);
    setShowGameOver(false);
    setShowPauseModal(false);
    setPaused(false);
    setShowWinModal(false);
    setShowTimeAd(false);
    setShowShareModal(false);
  }, [levelId]);

  // 倒計時副作用
  useEffect(() => {
    if (gameOver || paused || showWinModal) return;
    if (time <= 0) {
      setGameOver(true);
      setShowGameOver(true);
      return;
    }
    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, gameOver, paused, showWinModal]);

  // 播放按鍵音效
  function playClickSound() {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.25;
    audio.currentTime = 0;
    audio.play();
  }

  // 播放正確提示音效
  function playCompleteSound() {
    const audio = new Audio('/sounds/complete.mp3');
    audio.volume = 0.2;
    audio.currentTime = 0;
    audio.play();
  }

  // 按鈕事件佔位
  const handleBack = () => { playClickSound(); window.history.back(); };
  const handlePause = () => { playClickSound(); setShowPauseModal(true); setPaused(true); };
  const handleHint = () => {
    // 找到还未发现的点
    const unfoundSpots = level.spots.filter(spot => !found.includes(spot.id));
    if (unfoundSpots.length > 0) {
      // 随机选择一个未发现的点
      const randomSpot = unfoundSpots[Math.floor(Math.random() * unfoundSpots.length)];
      // 直接将该点添加到已发现列表中
      setFound(prev => [...prev, randomSpot.id]);
      playCompleteSound();
    }
  };
  const handleAddTime = () => {
    setGameOver(false); // 确保游戏不会处于结束状态
    setTime(t => t + 60);
  };
  const handleShare = () => { 
    playClickSound(); 
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`昭和の間違い探しゲーム：${level.title}で遊んでいます！あなたも挑戦してみませんか？`);
    const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
    window.open(lineShareUrl, '_blank');
  };

  const handleSpotFound = (id: number) => {
    if (!found.includes(id)) {
      setFound([...found, id]);
      playCompleteSound();
    }
  };

  // 當全部熱區找到時彈出勝利彈窗
  useEffect(() => {
    if (found.length === level.spots.length && !showWinModal) {
      setShowWinModal(true);
      // 第一关通关时写入localStorage
      if (level.id === 1) {
        localStorage.setItem('level1_cleared', '1');
      }
    }
  }, [found, showWinModal, level.spots.length]);

  const resetGame = () => {
    setGameOver(false);
    setFound([]);
    setTime(TOTAL_TIME);
  };

  // 监听页面可见性变化，判断用户是否从LINE返回
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && pendingShareReward) {
        setPendingShareReward(false);
        setTime(t => t + 30);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pendingShareReward]);

  const handleShareReward = () => {
    setShowShareModal(true);
  };
  const doShare = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`昭和の間違い探しゲーム：${level.title}で遊んでいます！あなたも挑戦してみませんか？`);
    const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
    setPendingShareReward(true);
    setShowShareModal(false);
    setShowGameOver(false); // 关闭Game Over弹窗
    window.open(lineShareUrl, '_blank');
  };

  // 時間追加廣告彈窗
  const timeAdModal = showTimeAd ? ReactDOM.createPortal(
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
              setGameOver(false);
              setTime(t => t + 60);
            }}
            onClose={() => {
              setShowTimeAd(false);
              resetGame();
            }}
          />
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // 暫停彈窗
  const pauseModal = showPauseModal ? ReactDOM.createPortal(
    <div className="game-over-modal">
      <div style={{
        background: '#f5ecd7',
        border: '4px solid #b77b4b',
        borderRadius: '18px',
        width: '90vw',
        maxWidth: 340,
        minWidth: 220,
        boxShadow: '0 8px 32px #0005',
        textAlign: 'center',
        position: 'relative',
        padding: '0 0 1.2em 0'
      }}>
        <button
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            background: 'none',
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            zIndex: 10,
            fontSize: 38,
            cursor: 'pointer',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
          onClick={() => {
            playClickSound();
            navigate('/levels');
          }}
          aria-label="ホームへ戻る"
        >
          <svg width="38" height="38" viewBox="0 0 32 32" style={{filter: 'drop-shadow(0 2px 6px #b77b4b88)'}}><rect x="8" y="14" width="16" height="12" rx="3" fill="#fff3e0" stroke="#b77b4b" strokeWidth="2"/><polygon points="16,6 28,16 4,16" fill="#e6a23c" stroke="#b77b4b" strokeWidth="2"/></svg>
        </button>
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '-32px',
          transform: 'translateX(-50%)',
          background: '#e6a23c',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.2em',
          borderRadius: '18px',
          padding: '0.3em 1.5em',
          letterSpacing: '0.2em',
          boxShadow: '0 2px 8px #b77b4b33',
          border: '2.5px solid #fff3e0',
          zIndex: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>お知らせ</div>
        <div style={{marginTop: 40, fontSize: '1.1em', color: '#7b3f00', fontWeight: 600, lineHeight: 1.6}}>
          ホームに戻ると、このステージの進捗は保存されません
        </div>
        <div style={{display:'flex', flexDirection:'column', gap: '1em', margin:'2em 1em 0 1em'}}>
          <button
            style={{
              background:'#d35400',
              color:'#fff',
              fontWeight:'bold',
              fontSize:'1em',
              border:'none',
              borderRadius:'12px',
              boxShadow:'0 2px 8px #b77b4b33',
              padding:'0.7em 0',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              gap:'0.4em'
            }}
            onClick={() => {
              playClickSound();
              setShowPauseModal(false);
              setPaused(false);
              // 這裡可加跳過本關邏輯
            }}
          >
            <span style={{fontSize:'1.1em'}}>📺</span> スキップ
          </button>
          <button
            style={{
              background:'#e6a23c',
              color:'#fff',
              fontWeight:'bold',
              fontSize:'1em',
              border:'none',
              borderRadius:'12px',
              boxShadow:'0 2px 8px #b77b4b33',
              padding:'0.7em 0',
              marginTop: '0.2em'
            }}
            onClick={() => {
              playClickSound();
              setShowPauseModal(false);
              setPaused(false);
            }}
          >
            ゲームを続ける
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // 勝利彈窗
  const winModal = showWinModal ? ReactDOM.createPortal(
    <div className="game-over-modal" style={{zIndex: 10000}}>
      <div style={{
        background: '#fffbe8',
        border: '4px solid #b77b4b',
        borderRadius: '18px',
        width: '90vw',
        maxWidth: 340,
        minWidth: 220,
        boxShadow: '0 8px 32px #0005',
        textAlign: 'center',
        position: 'relative',
        padding: '2.2em 1.2em 2em 1.2em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Demo提示语，始终显示在最前面 */}
        {showDemoEnd && (
          <div style={{whiteSpace:'pre-line', fontSize:'1.1em', lineHeight:1.7, maxWidth:'90vw', margin:'0 auto 1em auto', padding:'1.2em 1.5em', background:'#fffbe8', color:'#b77b4b', borderRadius:'14px', boxShadow:'0 2px 12px #b77b4b22', fontWeight:600, textAlign:'center'}}>
            Demo体験はここまでです。<br/>
            ゲームは開発中です。<br/>
            ご期待ください！
          </div>
        )}
        <div style={{
          color: '#d32f2f',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          textShadow: '2px 2px 0 #fff',
          marginBottom: '0.7em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: '0.04em',
        }}>おめでとうございます！</div>
        <div style={{ fontSize: '1.3rem', marginBottom: '2.2em', color: '#7b3f00', fontWeight: 600 }}>全部見つけました！</div>
        <div style={{display:'flex', gap:'1.2em', justifyContent:'center', width:'100%'}}>
          <button
            style={{
              flex:1,
              background:'#c1440e',
              color:'#fff',
              fontWeight:'bold',
              fontSize:'1.1em',
              border:'none',
              borderRadius:'12px',
              boxShadow:'0 2px 8px #b77b4b33',
              padding:'0.8em 0',
              marginRight: '0.2em',
            }}
            onClick={() => {
              playClickSound();
              setShowWinModal(false);
              navigate('/levels');
            }}
          >レベル選択に戻る</button>
          <button
            style={{
              flex:1,
              background:'#e57373',
              color:'#fff',
              fontWeight:'bold',
              fontSize:'1.1em',
              border:'none',
              borderRadius:'12px',
              boxShadow:'0 2px 8px #b77b4b33',
              padding:'0.8em 0',
              marginLeft: '0.2em',
            }}
            onClick={() => {
              playClickSound();
              setShowWinModal(false);
              if (level.id === 1) {
                setFound([]); // 清空已找到的热点
                setTime(TOTAL_TIME); // 重置时间
                navigate('/game/2'); // 导航到第二关
              } else {
                alert('Demo体験はここまでです。\nゲームは開発中です。\nご期待ください！');
              }
            }}
          >次のステージへ</button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // Game Over 弹窗
  const gameOverModal = showGameOver ? ReactDOM.createPortal(
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
        padding: '32px 16px 24px 16px',
        borderRadius: '8px',
        maxWidth: '340px',
        width: '90vw',
        textAlign: 'center',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <h2 style={{ marginBottom: '20px', color: '#d32f2f' }}>ゲームオーバー</h2>
        <p style={{ marginBottom: '20px' }}>
          時間切れです。<br/>
          再挑戦しますか？
        </p>
        <div 
          className="gameover-btn-group"
          style={{ 
            marginTop: '1.2em',
            width: '100%'
          }}>
          <button
            onClick={() => {
              setShowGameOver(false);
              resetGame();
            }}
            style={{
              background: '#4caf50',
              color: '#fff',
              border: 'none',
              padding: '12px 0',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold',
              fontSize: '1em',
            }}
          >再挑戦</button>
          <button
            onClick={handleShareReward}
            style={{
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              padding: '12px 0',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              animation: 'bounce-btn 1.2s infinite',
              fontWeight: 'bold',
              fontSize: '1em',
            }}
          >シェアして30秒延長</button>
          <button
            onClick={() => {
              setShowGameOver(false);
              setShowTimeAd(true);
            }}
            style={{
              background: '#ff9800',
              color: '#fff',
              border: 'none',
              padding: '12px 0',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              animation: 'bounce-btn 1.2s infinite',
              fontWeight: 'bold',
              fontSize: '1em',
            }}
          >広告視聴で60秒延長</button>
        </div>
      </div>
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
            このゲームを友だちにシェアすると、<br/>30秒の延長がもらえます！<br/><br/>
            <div style={{display:'flex', gap:'1.2em', justifyContent:'center', marginTop:'1.5em'}}>
              <button style={{flex:1, background:'#e57373', color:'#fff', fontWeight:'bold', fontSize:'1em', border:'none', borderRadius:'12px', boxShadow:'0 2px 8px #b77b4b33', padding:'0.7em 0'}} onClick={()=>setShowShareModal(false)}>放棄</button>
              <button style={{flex:1, background:'#388e3c', color:'#fff', fontWeight:'bold', fontSize:'1em', border:'none', borderRadius:'12px', boxShadow:'0 2px 8px #b77b4b33', padding:'0.7em 0'}} onClick={doShare}>シェア</button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  ) : null;

  useEffect(() => {
    // 分享奖励回调
    window.onShareReward = () => {
      setTime(t => t + 30);
    };
    return () => {
      window.onShareReward = undefined;
    };
  }, []);

  return (
    <AdsProvider clientId="pub-9462097609872972" testMode={true}>
      <div className="app" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        touchAction: 'none'
      }}>
        <TopBar time={time} total={level.spots.length} found={found.length} />
        <BackButton onClick={handleBack} />
        <PauseButton onClick={handlePause} />
        <div className="main-content">
          <GameBoard found={found} onSpotFound={handleSpotFound} spots={level.spots} image={level.image} />
          {pauseModal}
          {gameOverModal}
          {timeAdModal}
          {winModal}
        </div>
        <ControlBar found={found} spots={level.spots} onHint={handleHint} onAddTime={handleAddTime} onShare={handleShare} />
      </div>
    </AdsProvider>
  );
}

function HomeWithNav() {
  const navigate = useNavigate();
  return <Home onStartGame={() => navigate('/levels')} />;
}

function App() {
  const [bgmMuted, setBgmMuted] = useState(false);

  useEffect(() => {
    // 全局單例BGM
    if (!window._globalBGM) {
      window._globalBGM = new Audio('/sounds/bgm.mp3');
      window._globalBGM.loop = true;
      window._globalBGM.volume = 0.2;
    }
    if (!bgmMuted) {
      window._globalBGM.play();
    } else {
      window._globalBGM.pause();
    }
    // 不要銷毀BGM，否則切頁會斷
  }, [bgmMuted]);

  // 新增：全局监听用户首次交互，自动播放BGM（兼容LINE等移动端）
  useEffect(() => {
    const tryPlayBGM = () => {
      if (window._globalBGM && !bgmMuted) {
        window._globalBGM.play();
      }
      window.removeEventListener('touchstart', tryPlayBGM);
      window.removeEventListener('click', tryPlayBGM);
    };
    window.addEventListener('touchstart', tryPlayBGM, { once: true });
    window.addEventListener('click', tryPlayBGM, { once: true });
    return () => {
      window.removeEventListener('touchstart', tryPlayBGM);
      window.removeEventListener('click', tryPlayBGM);
    };
  }, [bgmMuted]);

  return (
    <Router>
      {/* BGM 靜音/開啟按鈕，全局顯示，只渲染一次 */}
      <button
        style={{
          position: 'fixed',
          top: 60,
          right: 12,
          zIndex: 200,
          background: 'rgba(255,255,255,0.7)',
          border: '1.5px solid #b77b4b',
          borderRadius: 12,
          fontSize: 22,
          padding: '0.2em 0.7em',
          boxShadow: '0 2px 8px #b77b4b22',
          cursor: 'pointer',
        }}
        onClick={() => setBgmMuted(m => !m)}
        aria-label={bgmMuted ? 'BGMオン' : 'BGMオフ'}
      >{bgmMuted ? '🔇' : '🎵'}</button>
      <Routes>
        <Route path="/" element={<HomeWithNav />} />
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/game/:levelId" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
