import React, { useRef, useState, useEffect } from "react";
import { spots } from "../data/spots";

interface Props {
  found: number[];
  onSpotFound: (id: number) => void;
}

export default function GameBoard({ found, onSpotFound }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [wrong, setWrong] = useState<{x: number, y: number} | null>(null);
  const [showWrong, setShowWrong] = useState(false);

  // 监听容器大小变化
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 检查是否点击到热区
    const clickedSpot = spots.find(spot => {
      const spotX = spot.leftPct * containerSize.width;
      const spotY = spot.topPct * containerSize.height;
      const spotWidth = spot.widthPct * containerSize.width;
      const spotHeight = spot.heightPct * containerSize.height;
      
      return (
        x >= spotX - spotWidth/2 &&
        x <= spotX + spotWidth/2 &&
        y >= spotY - spotHeight/2 &&
        y <= spotY + spotHeight/2 &&
        !found.includes(spot.id)
      );
    });

    if (clickedSpot) {
      onSpotFound(clickedSpot.id);
    } else {
      setWrong({ x, y });
      setShowWrong(true);
      setTimeout(() => setShowWrong(false), 1000);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="game-board" 
      style={{
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
      }}
      onClick={handleClick}
    >
      {found.map(id => {
        const spot = spots.find(s => s.id === id);
        if (!spot) return null;
        return (
          <div
            key={`found-${id}`}
            style={{
              position: 'absolute',
              left: `${spot.leftPct * 100}%`,
              top: `${spot.topPct * 100}%`,
              width: `${spot.widthPct * 100}%`,
              height: `${spot.heightPct * 100}%`,
              border: '4px solid red',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
              pointerEvents: 'none',
              zIndex: 1000,
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      })}
      {showWrong && wrong && (
        <div
          style={{
            position: "absolute",
            left: wrong.x - 28,
            top: wrong.y - 28,
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 2000
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