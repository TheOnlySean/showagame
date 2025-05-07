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
      <div className="top-bar-title">昭和時代に合わないところを見つけてください</div>
      <div className="top-bar-timer">時間：{mm}:{ss}</div>
      <div className="top-bar-progress">見つけたまちがい：{found}/{total}</div>
    </div>
  );
} 