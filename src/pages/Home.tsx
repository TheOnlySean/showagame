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
      width: "100vw",
      height: "100vh",
      background: "url(/images/cover.png) center center / cover no-repeat",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* 左側按鈕 */}
      <div className="home-left-btns">
        {leftButtons.map((btn, i) => (
          <button className="home-side-btn no-border" key={btn.label}>
            <span className="home-side-emoji" role="img" aria-label={btn.label}>{btn.emoji}</span>
            <span className="home-side-label-hori">{btn.label}</span>
          </button>
        ))}
      </div>
      {/* 標題和小字 */}
      <div className="home-title">
        <div className="home-title-main">昭和まちがい探し</div>
        <div className="home-title-small">写真復活スタジオ制作</div>
      </div>
      {/* 開始遊戲大按鈕移到下方中央 */}
      <button className="home-start-btn" onClick={onStartGame}>ゲーム開始</button>
    </div>
  );
} 