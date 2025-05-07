import React from "react";

interface Props {
  onClick: () => void;
}
export default function PauseButton({ onClick }: Props) {
  return (
    <button className="pause-btn" onClick={onClick} aria-label="一時停止">
      {/* SVG暫停圖標 */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#fff3e0" stroke="#b77b4b" strokeWidth="2" />
        <rect x="11" y="10" width="3" height="12" rx="1" fill="#b77b4b" />
        <rect x="18" y="10" width="3" height="12" rx="1" fill="#b77b4b" />
      </svg>
    </button>
  );
} 