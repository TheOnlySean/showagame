import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LevelCard from "../components/LevelCard";
import { levels } from "../data/levels";

export default function LevelSelect() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(Array(8).fill(false));

  useEffect(() => {
    // 第一关默认解锁，第二关完成第一关后解锁
    const cleared1 = localStorage.getItem('level1_cleared') === '1';
    const newUnlocked = Array(8).fill(false);
    newUnlocked[0] = true; // 第一关始终解锁
    newUnlocked[1] = cleared1; // 第二关条件解锁
    // 后面的关卡都锁定
    setUnlocked(newUnlocked);
  }, []);

  return (
    <div className="level-select-page" style={{
      minHeight: '100vh',
      width: '100vw',
      background: "#f5ecd7 url('/images/showa-paper-bg.png') center center / cover no-repeat",
      boxShadow: '0 0 32px #b77b4b33 inset',
      position: 'fixed',
      top: 0,
      left: 0,
      paddingBottom: '0.5em',
      overflowX: 'hidden',
      overflowY: 'auto', // 修改为可滚动
      margin: 0,
      zIndex: 0
    }}>
      {/* 頂部欄 */}
      <div className="level-select-header">
        <button className="level-back-btn" onClick={() => navigate("/")}>⬅️</button>
        <span className="level-select-title">懐かしい時代</span>
        <span style={{width: 32}}></span>
      </div>
      {/* 關卡卡片區 */}
      <div className="level-card-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // 两列布局
        gap: '1rem',
        padding: '1rem',
        marginBottom: '4rem' // 底部留白，避免被底栏遮挡
      }}>
        {levels.map((lv, i) => (
          <div key={i} onClick={() => {
            if (i < 2 && (i === 0 || unlocked[i])) {
              navigate(`/game/${lv.id}`);
            } else if (i >= 2) {
              alert('このレベルは開発中です。\nお楽しみに！');
            }
          }} style={{cursor: (i === 0 || unlocked[i]) ? 'pointer' : 'not-allowed'}}>
            <LevelCard title={lv.title} img={lv.image} locked={!unlocked[i]} index={i} />
          </div>
        ))}
      </div>
      {/* 底部欄 */}
      <div className="level-select-footer">
        <button className="level-gift-btn" onClick={() => {
          const shareUrl = encodeURIComponent(window.location.href);
          const shareText = encodeURIComponent("昭和の間違い探しゲーム：懐かしい時代の写真で遊んでみませんか？");
          const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
          window.open(lineShareUrl, '_blank');
        }}>シェア</button>
        <button className="level-home-btn">📲<span>ホーム追加</span></button>
      </div>
    </div>
  );
} 