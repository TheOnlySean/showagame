import React from "react";
import { useNavigate } from "react-router-dom";
import LevelCard from "../components/LevelCard";

const levels = [
  { title: "懐かしい街並み", img: "/images/bg.png", locked: false },
  { title: "懐かしい学校", img: "https://placehold.co/200x200?text=No+Image", locked: true },
  { title: "懐かしい神社", img: "https://placehold.co/200x200?text=No+Image", locked: true },
  { title: "懐かしい宴会", img: "https://placehold.co/200x200?text=No+Image", locked: true },
  { title: "懐かしい朝ごはん", img: "https://placehold.co/200x200?text=No+Image", locked: true },
  { title: "懐かしい駅", img: "https://placehold.co/200x200?text=No+Image", locked: true },
];

export default function LevelSelect() {
  const navigate = useNavigate();
  return (
    <div className="level-select-page">
      {/* 頂部欄 */}
      <div className="level-select-header">
        <button className="level-back-btn" onClick={() => navigate("/")}>⬅️</button>
        <span className="level-select-title">懐かしい時代</span>
        <span style={{width: 32}}></span>
      </div>
      {/* 關卡卡片區 */}
      <div className="level-card-list">
        {levels.map((lv, i) => (
          <div key={i} onClick={() => { if(i === 0) navigate('/game'); }} style={{cursor: i === 0 ? 'pointer' : 'default'}}>
            <LevelCard {...lv} index={i} />
          </div>
        ))}
      </div>
      {/* 底部欄 */}
      <div className="level-select-footer">
        <button className="level-gift-btn">🎁<span>入口ギフト</span></button>
        <button className="level-home-btn">📲<span>ホーム追加</span></button>
      </div>
    </div>
  );
} 