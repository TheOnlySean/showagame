import React from "react";

interface LevelCardProps {
  title: string;
  img: string;
  locked?: boolean;
  index?: number;
}
export default function LevelCard({ title, img, locked, index }: LevelCardProps) {
  return (
    <div className="level-card">
      <div className="level-card-img-wrap">
        <img src={img} alt={title} className="level-card-img" />
        {index !== 0 && locked && (
          <span className="level-card-lock">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a0522d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" fill="#fff3e0" stroke="#a0522d"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#a0522d"/><circle cx="12" cy="16" r="2" fill="#a0522d"/></svg>
          </span>
        )}
      </div>
      <div className="level-card-title">{title}</div>
    </div>
  );
} 