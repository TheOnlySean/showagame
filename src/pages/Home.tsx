import React from "react";

const leftButtons = [
  { label: "シェア", emoji: "🔗" },
  { label: "ホーム追加", emoji: "📲" },
  { label: "每日ギフト", emoji: "🗓️" },
  { label: "入口ギフト", emoji: "🎁" },
];

interface HomeProps {
  onStartGame?: () => void;
}

export default function Home({ onStartGame }: HomeProps) {
  return (
    <div className="home-page" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: "url(/images/cover.png) center center / cover no-repeat",
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      zIndex: 1
    }}>
      {/* 標題和小字 */}
      <div className="home-title">
        <div className="home-title-main">昭和まちがい探し</div>
        <div className="home-title-small">写真復活スタジオ制作</div>
      </div>
      
      {/* LINE公式账号按钮 */}
      <button 
        onClick={() => window.open('https://line.me/R/ti/p/@824unncx', '_blank')}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '28vh',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(to bottom, #06c755, #00b347)',
          color: '#fff',
          border: 'none',
          borderRadius: '0.8em',
          padding: '0.6em 1.2em',
          fontSize: '1.2em',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4em',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          zIndex: 2
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M24 10.3c0-5.4-5.4-9.8-12-9.8s-12 4.4-12 9.8c0 4.8 4.3 8.9 10.1 9.6.4.1.9.3 1.1.6.2.3.1.8.1.9l-.2 1.1c-.1.4-.3 1.5 1.3.8s8.6-5.1 11.8-8.8c2.2-2.3 1.8-4.6 1.8-4.6v.2z"/>
        </svg>
        <span>写真復活LINE</span>
      </button>
      
      {/* 開始遊戲按鈕（缩小版） */}
      <button 
        className="home-start-btn" 
        onClick={onStartGame}
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '16vh',
          transform: 'translateX(-50%)',
          margin: 0,
          padding: '0.6em 1.8em',
          background: '#fffde7',
          border: '4px solid #ffb300',
          borderRadius: '1em',
          fontSize: '1.8em',
          color: '#b77b4b',
          fontWeight: 'bold',
          boxShadow: '0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)',
          zIndex: 2,
          letterSpacing: '0.15em',
          textShadow: '2px 2px 6px #fff, 0 4px 16px rgba(0,0,0,0.10)',
          whiteSpace: 'nowrap',
          animation: 'bounce 1.2s infinite',
          cursor: 'pointer'
        }}
      >
        ゲームスタート
      </button>
    </div>
  );
} 