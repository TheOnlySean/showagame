import React from 'react';

interface PlaceholderAdProps {
  width?: string;
  height?: string;
}

const PlaceholderAd: React.FC<PlaceholderAdProps> = ({ 
  width = '100%', 
  height = '250px' 
}) => {
  return (
    <div 
      style={{
        width,
        height,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: '1px solid #ddd',
        margin: '20px 0',
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>
        广告位
      </div>
      <div style={{ fontSize: '14px', color: '#999' }}>
        正在等待 AdSense 审核...
      </div>
    </div>
  );
};

export default PlaceholderAd; 