import React from 'react';
import './bubbles.css';

const Bubble = React.forwardRef(({ 
  tool, 
  onPointerDown, 
}, ref) => {
  return (
    <div
      ref={ref}
      className="absolute top-0 left-0" // translation applied here via ref in TechStackBubbles
      style={{
        transform: `translate3d(${tool.x}px, ${tool.y}px, 0)`,
        width: tool.size,
        height: tool.size,
      }}
    >
      <div
        className="crystal-bubble w-full h-full flex items-center justify-center rounded-full hover:scale-110 hover:shadow-[0_0_25px_rgba(0,255,255,0.35)] touch-none"
        onPointerDown={onPointerDown}
        title={tool.name}
        aria-label={tool.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={tool.icon} 
          alt={tool.name} 
          className="w-1/2 h-1/2 object-contain pointer-events-none drop-shadow-md" 
          draggable={false}
        />
      </div>
    </div>
  );
});

Bubble.displayName = 'Bubble';
export default Bubble;
