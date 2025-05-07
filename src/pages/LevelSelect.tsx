import React from "react";
import { useNavigate } from "react-router-dom";
import LevelCard from "../components/LevelCard";

const levels = [
  { title: "懐かしい牛車", img: "/images/bg.png", locked: false },
  { title: "懐かしいゴム跳び", img: "https://placehold.co/200x200?text=No+Image", locked: true },
  { title: "懐かしい集金", img: "https://placehold.co/200x200?text=No+Image", locked: true },
  { title: "懐かしい新学期", img: "https://placehold.co/200x200?text=No+Image", locked: true },
  { title: "懐かしい昼食", img: "https://placehold.co/200x200?text=No+Image", locked: true },
  { title: "懐かしい釣り", img: "https://placehold.co/200x200?text=No+Image", locked: true },
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