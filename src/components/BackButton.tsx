import React from "react";

interface Props {
  onClick: () => void;
}
export default function BackButton({ onClick }: Props) {
  return (
    <button className="back-btn" onClick={onClick} aria-label="戻る">
      {/* SVG箭頭圖標 */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#fff3e0" stroke="#b77b4b" strokeWidth="2" />
        <polyline points="18,10 12,16 18,22" fill="none" stroke="#b77b4b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
} 