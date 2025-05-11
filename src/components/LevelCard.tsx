import React from "react";

interface LevelCardProps {
  title: string;
  img: string;
  locked?: boolean;
  index?: number;
}
export default function LevelCard({ title, img, locked, index }: LevelCardProps) {
  return (
    <div className="level-card" style={{
      width: '130px',
      height: '100px',
      background: locked ? '#fff8e5' : '#fffbe8',
      border: '2px solid #b77b4b',
      borderRadius: '12px',
      margin: '5px auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      boxShadow: locked ? 
        '0 2px 8px rgba(160,82,45,0.1)' : 
        '0 3px 10px rgba(160,82,45,0.2)',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      transform: locked ? 'scale(0.98)' : 'scale(1)',
      position: 'relative'
    }}>
      {locked && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.3)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />
      )}
      <div className="level-card-img-wrap" style={{
        width: '65px',
        height: '65px',
        background: '#fff',
        borderRadius: '8px',
        margin: '8px 0 3px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid #e0c9a6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05) inset'
      }}>
        <img src={img} alt={title} className="level-card-img" style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: locked ? 'grayscale(40%) brightness(0.95)' : 'none'
        }} />
        {locked && (
          <span className="level-card-lock" style={{
            position: 'absolute',
            right: '3px',
            bottom: '3px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '50%',
            padding: '2px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            zIndex: 2
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a0522d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" fill="#fff3e0" stroke="#a0522d"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#a0522d"/><circle cx="12" cy="16" r="2" fill="#a0522d"/></svg>
          </span>
        )}
      </div>
      <div className="level-card-title" style={{
        fontSize: '0.85em',
        fontWeight: 'bold',
        width: '90%',
        margin: '1px auto 0 auto',
        color: locked ? '#be8a64' : '#a0522d',
        textAlign: 'center',
        padding: '2px 0',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>{title}</div>
    </div>
  );
} 