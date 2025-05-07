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
    <div className="game-board-container" ref={containerRef}>
      <img
        ref={imgRef}
        src="/images/bg.png"
        alt="昭和の町"
        className="game-board-img"
        onLoad={() => {
          if (imgRef.current) {
            setImgSize({ width: imgRef.current.offsetWidth, height: imgRef.current.offsetHeight });
            setImgNatural({ width: imgRef.current.naturalWidth, height: imgRef.current.naturalHeight });
          }
        }}
        onClick={handleWrongClick}
        style={{
          cursor: showWrong ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\'><text x=\'8\' y=\'38\' font-size=\'40\' fill=\'red\'>✖️</text></svg>") 24 24, auto' : 'auto',
          objectFit: 'contain',
          width: '100%',
          height: '100%'
        }}
      />
      {showW > 0 && showH > 0 && spots.map((spot) => (
        <div
          key={spot.id}
          style={{
            position: "absolute",
            left: offsetX + spot.leftPct * showW,
            top: offsetY + spot.topPct * showH,
            width: spot.widthPct * showW,
            height: spot.heightPct * showH,
            border: found.includes(spot.id) ? "2px solid red" : "2px solid transparent",
            borderRadius: "50%",
            cursor: found.includes(spot.id) ? "default" : "pointer",
            pointerEvents: found.includes(spot.id) ? "none" : "auto",
            transition: "border 0.2s",
            zIndex: 2,
          }}
          title={found.includes(spot.id) ? spot.desc : ""}
          onClick={e => { e.stopPropagation(); onSpotFound(spot.id); }}
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
            zIndex: 10,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 56 56">
            <line x1="8" y1="8" x2="48" y2="48" stroke="red" strokeWidth="8" strokeLinecap="round" />
            <line x1="48" y1="8" x2="8" y2="48" stroke="red" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
} 