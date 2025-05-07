import React from "react";
import type { Spot } from "../data/spots";

interface Props {
  found: number[];
  spots: Spot[];
  onHint: () => void;
  onAddTime: () => void;
  onShare: () => void;
}
export default function ControlBar({ found, spots, onHint, onAddTime, onShare }: Props) {
  return (
    <div className="control-bar">
      <div className="found-list">
        {found.map(id => {
          const spot = spots.find(s => s.id === id);
          return (
            <div className="found-icon" key={id} title={spot?.desc}>
              {/* SVG佔位icon */}
              <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#ffe082" stroke="#b77b4b" strokeWidth="2" /></svg>
            </div>
          );
        })}
        {/* 補足空位 */}
        {Array(spots.length - found.length).fill(0).map((_, i) => (
          <div className="found-icon empty" key={i + 'empty'} />
        ))}
      </div>
      <div className="control-btns">
        <button className="hint-btn" onClick={onHint}>
          <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#b3e5fc" stroke="#0288d1" strokeWidth="2" /><text x="14" y="19" textAnchor="middle" fontSize="16" fill="#0288d1">ヒ</text></svg>
          ヒント
        </button>
        <button className="addtime-btn" onClick={onAddTime}>
          <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#c8e6c9" stroke="#388e3c" strokeWidth="2" /><text x="14" y="19" textAnchor="middle" fontSize="16" fill="#388e3c">＋</text></svg>
          時間追加
        </button>
        <button className="share-btn" onClick={onShare}>
          <svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="13" fill="#ffe0b2" stroke="#f57c00" strokeWidth="2" /><text x="14" y="19" textAnchor="middle" fontSize="16" fill="#f57c00">シ</text></svg>
          シェア
        </button>
      </div>
    </div>
  );
} 