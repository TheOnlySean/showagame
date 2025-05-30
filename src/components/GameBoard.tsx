import React, { useRef, useState, useEffect } from "react";
import type { Spot } from "../data/spots";

interface Props {
  found: number[];
  onSpotFound: (id: number) => void;
  spots: Spot[];
  image: string;
}

const IMAGE_SIZE = 1024; // 图片实际尺寸

export default function GameBoard({ found, onSpotFound, spots, image }: Props) {
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

  // 计算图片在容器中的实际显示尺寸和位置
  const getImageRect = () => {
    if (!containerRef.current) return null;
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // 计算图片的缩放比例
    const scale = Math.min(containerWidth / IMAGE_SIZE, containerHeight / IMAGE_SIZE);
    
    // 计算图片在容器中的实际显示尺寸
    const imageWidth = IMAGE_SIZE * scale;
    const imageHeight = IMAGE_SIZE * scale;
    
    // 计算图片在容器中的位置（居中）
    const imageLeft = (containerWidth - imageWidth) / 2;
    const imageTop = (containerHeight - imageHeight) / 2;
    
    return {
      left: imageLeft,
      top: imageTop,
      width: imageWidth,
      height: imageHeight,
      scale
    };
  };

  // 处理点击事件
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const imageRect = getImageRect();
    if (!imageRect) return;
    
    // 将点击坐标转换为图片坐标系（0-1024）
    const imageX = (x - imageRect.left) / imageRect.scale;
    const imageY = (y - imageRect.top) / imageRect.scale;
    
    // 判定范围缩小为1.2倍
    const HIT_SCALE = 1.2;
    // 检查是否点击到热区
    const clickedSpot = spots.find(spot => {
      const spotX = spot.leftPct * IMAGE_SIZE + spot.widthPct * IMAGE_SIZE / 2;
      const spotY = spot.topPct * IMAGE_SIZE + spot.heightPct * IMAGE_SIZE / 2;
      const spotWidth = spot.widthPct * IMAGE_SIZE * HIT_SCALE;
      const spotHeight = spot.heightPct * IMAGE_SIZE * HIT_SCALE;
      
      return (
        imageX >= spotX - spotWidth/2 &&
        imageX <= spotX + spotWidth/2 &&
        imageY >= spotY - spotHeight/2 &&
        imageY <= spotY + spotHeight/2 &&
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

  const imageRect = getImageRect();

  return (
    <div 
      ref={containerRef}
      className="game-board" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${image})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        touchAction: 'none',
        margin: 0,
        padding: 0
      }}
      onClick={handleClick}
    >
      {imageRect && found.map(id => {
        const spot = spots.find(s => s.id === id);
        if (!spot) return null;

        // 修正：假设leftPct/topPct为左上角，显示时加上半宽高和半高
        const spotWidth = spot.widthPct * imageRect.width;
        const spotHeight = spot.heightPct * imageRect.height;
        const centerX = imageRect.left + (spot.leftPct + spot.widthPct / 2) * imageRect.width;
        const centerY = imageRect.top + (spot.topPct + spot.heightPct / 2) * imageRect.height;

        return (
          <div
            key={`found-${id}`}
            style={{
              position: 'absolute',
              left: centerX - spotWidth / 2,
              top: centerY - spotHeight / 2,
              width: spotWidth,
              height: spotHeight,
              border: '4px solid red',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
              pointerEvents: 'none',
              zIndex: 1000,
              margin: 0,
              padding: 0
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