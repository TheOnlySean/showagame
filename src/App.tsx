import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import TopBar from "./components/TopBar";
import BackButton from "./components/BackButton";
import PauseButton from "./components/PauseButton";
import GameBoard from "./components/GameBoard";
import ControlBar from "./components/ControlBar";
import { spots } from "./data/spots";
import Home from "./pages/Home";
import LevelSelect from "./pages/LevelSelect";
import { AdsProvider } from './contexts/AdsContext';
import './App.css';
// import type { Spot } from "./data/spots";

const TOTAL_TIME = 120; // 秒

declare global { interface Window { _globalBGM?: HTMLAudioElement } }

function GamePage() {
  const navigate = useNavigate();
  const [found, setFound] = useState<number[]>([]);
  const [time, setTime] = useState(TOTAL_TIME);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showDemoEnd, setShowDemoEnd] = useState(false);

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
  const handleHint = () => { playClickSound(); alert("ヒント"); };
  const handleAddTime = () => { playClickSound(); alert("時間追加"); };
  const handleShare = () => { playClickSound(); alert("シェア"); };

  const handleSpotFound = (id: number) => {
    if (!found.includes(id)) {
      setFound([...found, id]);
      playCompleteSound();
    }
  };

  // 當全部熱區找到時彈出勝利彈窗
  useEffect(() => {
    if (found.length === spots.length && !showWinModal) {
      setShowWinModal(true);
    }
  }, [found, showWinModal]);

  // 彈窗內容
  const gameOverModal = showGameOver ? ReactDOM.createPortal(
    <div className="game-over-modal">
      <div style={{
        background: '#f5ecd7',
        border: '4px solid #b77b4b',
        borderRadius: '18px',
        width: '90vw',
        maxWidth: 320,
        minWidth: 220,
        boxShadow: '0 8px 32px #0005',
        textAlign: 'center',
        position: 'relative',
        padding: '0 0 1.2em 0'
      }}>
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
        }}>時間切れ！</div>
        <div style={{marginTop: 40, fontSize: '1.1em', color: '#7b3f00', fontWeight: 600, lineHeight: 1.6}}>
          視聴ボーナス動画を見ると<br/>
          <span style={{color:'#d32f2f', fontWeight:700}}>60秒</span> 回復できます
        </div>
        <div style={{display:'flex', justifyContent:'space-between', gap: '1em', margin:'2em 1em 0 1em'}}>
          <button
            style={{
              flex:1,
              background:'#c1440e',
              color:'#fff',
              fontWeight:'bold',
              fontSize:'1em',
              border:'none',
              borderRadius:'12px',
              boxShadow:'0 2px 8px #b77b4b33',
              padding:'0.6em 0',
              marginRight: '0.2em',
            }}
            onClick={() => {
              playClickSound();
              setShowGameOver(false);
              setGameOver(false);
              setFound([]);
              setTime(TOTAL_TIME);
            }}
          >やめる</button>
          <button
            style={{
              flex:1,
              background:'#d35400',
              color:'#fff',
              fontWeight:'bold',
              fontSize:'1em',
              border:'none',
              borderRadius:'12px',
              boxShadow:'0 2px 8px #b77b4b33',
              padding:'0.6em 0',
              marginLeft: '0.2em',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              gap:'0.4em'
            }}
            onClick={async () => {
              playClickSound();
              // 這裡可接入Google廣告SDK
              // 模擬看完廣告
              setShowGameOver(false);
              setGameOver(false);
              setTime(t => t + 60);
            }}
          >
            <span style={{fontSize:'1.1em'}}>📺</span> すぐ加時
          </button>
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
          >選択画面に戻る</button>
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
              setShowDemoEnd(true);
              setTimeout(() => setShowDemoEnd(false), 2000);
            }}
          >次のステージへ</button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <AdsProvider clientId="pub-9462097609872972" testMode={true}>
      <div className="App">
        <TopBar time={time} total={spots.length} found={found.length} />
        <BackButton onClick={handleBack} />
        <PauseButton onClick={handlePause} />
        <div className="main-content">
          <GameBoard found={found} onSpotFound={handleSpotFound} />
          {pauseModal}
          {gameOverModal}
          {winModal}
          {showDemoEnd && (
            <div className="toast" style={{zIndex:10001}}>
              Demo体験はここまでです。ゲームは開発中です。ご期待ください！
            </div>
          )}
        </div>
        <ControlBar found={found} spots={spots} onHint={handleHint} onAddTime={handleAddTime} onShare={handleShare} />
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
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
