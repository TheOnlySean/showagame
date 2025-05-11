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
      zIndex: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* 頂部欄 */}
      <div className="level-select-header" style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 15px',
        background: 'rgba(255, 251, 232, 0.8)',
        borderBottom: '1px solid #e0c9a6',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button className="level-back-btn" onClick={() => navigate("/")} style={{
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0
        }}>⬅️</button>
        <span className="level-select-title" style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#a0522d'
        }}>懐かしい時代</span>
        <span style={{width: '32px'}}></span>
      </div>
      {/* 關卡卡片區 */}
      <div className="level-card-container" style={{
        width: '90%',
        maxWidth: '360px',
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '5rem' // 底部留白，避免被底栏遮挡
      }}>
        <div className="level-card-list" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)', // 两列布局
          gap: '12px',
          padding: '0.5rem',
          width: '100%',
          justifyItems: 'center'
        }}>
          {levels.map((lv, i) => (
            <div key={i} onClick={() => {
              if (i < 2 && (i === 0 || unlocked[i])) {
                navigate(`/game/${lv.id}`);
              }
            }} style={{
              cursor: (i === 0 || unlocked[i]) ? 'pointer' : 'not-allowed',
              width: '130px' // 缩小卡片宽度
            }}>
              <LevelCard title={lv.title} img={lv.image} locked={!unlocked[i]} index={i} />
            </div>
          ))}
        </div>
      </div>
      {/* 底部欄 */}
      <div className="level-select-footer" style={{
        position: 'fixed',
        bottom: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '360px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        padding: '12px',
        background: 'rgba(255, 251, 232, 0.9)',
        borderRadius: '15px',
        boxShadow: '0 3px 10px rgba(183, 123, 75, 0.25)'
      }}>
        <button className="level-gift-btn" style={{
          background: 'linear-gradient(to bottom, #f77a7a, #e57373)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 0',
          fontSize: '1em',
          fontWeight: 'bold',
          width: '100%',
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
          transition: 'transform 0.1s ease',
          cursor: 'pointer'
        }} onClick={() => {
          const shareUrl = encodeURIComponent(window.location.href);
          const shareText = encodeURIComponent("昭和の間違い探しゲーム：懐かしい写真で面白い発見をしてみませんか？");
          const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;
          window.open(lineShareUrl, '_blank');
        }}>シェア</button>
        <button className="level-home-btn" style={{
          background: 'linear-gradient(to bottom, #5ec1b6, #4db6ac)',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 0',
          fontSize: '1em',
          fontWeight: 'bold',
          width: '100%',
          boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.3em',
          transition: 'transform 0.1s ease',
          cursor: 'pointer'
        }}>📲<span>ホーム追加</span></button>
      </div>
    </div>
  );
} 