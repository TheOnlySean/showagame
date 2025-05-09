import React from "react";

interface Props {
  time: number;
  total: number;
  found: number;
}
export default function TopBar({ time, total, found }: Props) {
  // 將秒數格式化為 mm:ss
  const mm = String(Math.floor(time / 60)).padStart(2, '0');
  const ss = String(time % 60).padStart(2, '0');
  return (
    <div className="top-bar">
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '-32px',
        transform: 'translateX(-50%)',
        background: '#e6a23c',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1em',
        borderRadius: '18px',
        padding: '0.3em 1.5em',
        letterSpacing: '0.2em',
        boxShadow: '0 2px 8px #b77b4b33',
        border: '2.5px solid #fff3e0',
        zIndex: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>昭和時代の思い出</div>
      <div className="top-bar-timer">時間：{mm}:{ss}</div>
      <div className="top-bar-progress">見つけたまちがい：{found}/{total}</div>
    </div>
  );
} 