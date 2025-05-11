import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LevelCard from "../components/LevelCard";
import { levels } from "../data/levels";

export default function LevelSelect() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState([true, false]);

  useEffect(() => {
    // 检查localStorage，第一关通关后解锁第二关
    const cleared1 = localStorage.getItem('level1_cleared') === '1';
    setUnlocked([true, cleared1]);
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
      overflowY: 'hidden',
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
      <div className="level-card-list">
        {levels.slice(0,2).map((lv, i) => (
          <div key={i} onClick={() => {
            if (i === 0 || unlocked[i]) navigate(`/game/${lv.id}`);
          }} style={{cursor: (i === 0 || unlocked[i]) ? 'pointer' : 'not-allowed'}}>
            <LevelCard title={lv.title} img={lv.image} locked={i !== 0 && !unlocked[i]} index={i} />
          </div>
        ))}
      </div>
      {/* 底部欄 */}
      <div className="level-select-footer">
        <button className="level-gift-btn" onClick={() => {
          const shareUrl = encodeURIComponent(window.location.href);
          const shareText = encodeURIComponent("昭和まちがい探しで遊ぼう！一緒に間違いを探そう！");
          const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
          window.open(lineShareUrl, '_blank');
        }}>シェア</button>
        <button className="level-home-btn">📲<span>ホーム追加</span></button>
      </div>
    </div>
  );
} 