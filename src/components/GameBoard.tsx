import React, { useRef, useState, useEffect } from "react";
import { spots } from "../data/spots";

interface Props {
  found: number[];
  onSpotFound: (id: number) => void;
}

export default function GameBoard({ found, onSpotFound }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [imgNatural, setImgNatural] = useState({ width: 0, height: 0 });
  const [wrong, setWrong] = useState<{x: number, y: number} | null>(null);
  const [showWrong, setShowWrong] = useState(false);

  useEffect(() => {
    function updateSize() {
      if (imgRef.current) {
        setImgSize({ width: imgRef.current.offsetWidth, height: imgRef.current.offsetHeight });
        setImgNatural({ width: imgRef.current.naturalWidth, height: imgRef.current.naturalHeight });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 計算圖片顯示區域（保證熱區絕對對齊圖片內容）
  let showW = 0, showH = 0, offsetX = 0, offsetY = 0, scale = 1;
  const containerW = containerRef.current?.offsetWidth || 0;
  const containerH = containerRef.current?.offsetHeight || 0;
  if (imgNatural.width && imgNatural.height && containerW && containerH) {
    scale = Math.min(containerW / imgNatural.width, containerH / imgNatural.height);
    showW = imgNatural.width * scale;
    showH = imgNatural.height * scale;
    offsetX = (containerW - showW) / 2;
    offsetY = (containerH - showH) / 2;
  }

  // 點擊圖片非熱區時觸發
  function handleWrongClick(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    if (!imgRef.current || !containerRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const crect = containerRef.current.getBoundingClientRect();
    // 計算點擊座標（相對於圖片顯示區域）
    const x = e.clientX - crect.left - offsetX;
    const y = e.clientY - crect.top - offsetY;
    // 檢查是否點在熱區
    const isInHotspot = spots.some(spot => {
      const left = spot.leftPct * showW;
      const top = spot.topPct * showH;
      const width = spot.widthPct * showW;
      const height = spot.heightPct * showH;
      return (
        x >= left && x <= left + width &&
        y >= top && y <= top + height &&
        !found.includes(spot.id)
      );
    });
    if (!isInHotspot) {
      setWrong({x: x + offsetX, y: y + offsetY});
      setShowWrong(true);
      document.body.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\'><text x=\'8\' y=\'38\' font-size=\'40\' fill=\'red\'>✖️</text></svg>") 24 24, auto';
      setTimeout(() => {
        setShowWrong(false);
        document.body.style.cursor = '';
      }, 2000);
    }
  }

  return (
    <div className="game-board" style={{
      position: 'fixed',
      top: '60px',
      left: 0,
      right: 0,
      bottom: '60px',
      backgroundImage: 'url(/images/bg.png)',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
      touchAction: 'none'
    }}>
      {spots.map(spot => (
        <div
          key={spot.id}
          className={`spot ${found.includes(spot.id) ? 'found' : ''}`}
          style={{
            position: 'absolute',
            left: `${spot.leftPct * 100}%`,
            top: `${spot.topPct * 100}%`,
            width: `${spot.widthPct * 100}%`,
            height: `${spot.heightPct * 100}%`,
            cursor: found.includes(spot.id) ? 'default' : 'pointer',
            pointerEvents: found.includes(spot.id) ? 'none' : 'auto',
            zIndex: found.includes(spot.id) ? 0 : 1
          }}
          onClick={() => onSpotFound(spot.id)}
        />
      ))}
      {showWrong && wrong && (
        <div
          style={{
            position: "absolute",
            left: wrong.x - 32,
            top: wrong.y - 32,
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 1000
          }}
        >
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: 'absolute', zIndex: 1000 }}>
            <line x1="8" y1="8" x2="48" y2="48" stroke="red" strokeWidth="8" strokeLinecap="round" />
            <line x1="48" y1="8" x2="8" y2="48" stroke="red" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      )}
      {found.map(id => {
        const spot = spots.find(s => s.id === id);
        if (!spot) return null;
        return (
          <div
            key={`found-${id}`}
            style={{
              position: 'absolute',
              width: `${spot.widthPct * 100}%`,
              height: `${spot.heightPct * 100}%`,
              border: '4px solid red',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
              pointerEvents: 'none',
              zIndex: 1000,
              transform: 'translate(-50%, -50%)',
              left: `${spot.leftPct * 100}%`,
              top: `${spot.topPct * 100}%`
            }}
          />
        );
      })}
    </div>
  );
} 