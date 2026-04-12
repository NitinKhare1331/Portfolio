'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Bubble from './Bubble';

const availableTools = [
  { name: "React", icon: "/tools/react.png" },
  { name: "Docker", icon: "/tools/docker.png" },
  { name: "MongoDB", icon: "/tools/mongodb.png" },
  { name: "PostgreSQL", icon: "/tools/postgresql.png" },
  { name: "AWS", icon: "/tools/aws.png" },
  { name: "Azure", icon: "/tools/azure.png" },
  { name: "GCP", icon: "/tools/google-cloud.png" },
  { name: "Python", icon: "/tools/python.png" },
  { name: "GitHub", icon: "/tools/github.png" },
  { name: "VS Code", icon: "/tools/vscode.png" },
  { name: "Slack", icon: "/tools/slack.png" },
  { name: "Jira", icon: "/tools/jira.png" },
  { name: "Postman", icon: "/tools/postman.png" },
  { name: "OpenAI", icon: "/tools/chatgpt.png" },
  { name: "Gemini", icon: "/tools/gemini.png" },
  { name: "Next.js", icon: "/tools/nextjs.png" },
  { name: "JavaScript", icon: "/tools/javascript.png" },
  { name: "Vercel", icon: "/tools/vercel.png" },
  { name: "Copilot", icon: "/tools/copilot.png" },
];

export default function TechStackBubbles() {
  const containerRef = useRef(null);
  const bubbleRefs = useRef([]);
  const bubblesPhysics = useRef([]);
  const animationRef = useRef(null);
  
  const [bubblesData, setBubblesData] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Interaction refs
  const draggedBubbleId = useRef(null);
  const pointerOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initBubbles = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    // Config based on screen size
    const isMobile = clientWidth < 768;
    // Use all tools so they are all visible at a time
    const bubbleCount = availableTools.length; 
    const getBubbleSize = () => isMobile 
      ? 45 + Math.random() * 30 // 45-75 smaller to fit all on mobile
      : 70 + Math.random() * 50; // 70-120
      
    // Create initial physics state
    const newBubbles = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      const tool = availableTools[i];
      const size = getBubbleSize();
      
      // Attempt to place without overlapping
      let x, y;
      let attempts = 0;
      let overlapping = true;
      while (overlapping && attempts < 100) {
        x = Math.random() * (clientWidth - size);
        y = Math.random() * (clientHeight - size);
        overlapping = false;
        
        for (const existing of newBubbles) {
          const dx = (x + size / 2) - (existing.x + existing.size / 2);
          const dy = (y + size / 2) - (existing.y + existing.size / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < (size / 2 + existing.size / 2) + 5) {
            overlapping = true;
            break;
          }
        }
        attempts++;
      }
      
      const speedMultiplier = isMobile ? 0.3 : 0.6; // adjust for visual smoothness
      let velocityX = (Math.random() - 0.5) * 2 * speedMultiplier;
      let velocityY = (Math.random() - 0.5) * 2 * speedMultiplier;

      // Prevent exact 0
      if (Math.abs(velocityX) < 0.1) velocityX = 0.2 * Math.sign(velocityX || 1);
      if (Math.abs(velocityY) < 0.1) velocityY = 0.2 * Math.sign(velocityY || 1);

      newBubbles.push({
        id: i,
        ...tool,
        size,
        x,
        y,
        velocityX,
        velocityY,
      });
    }

    bubblesPhysics.current = newBubbles;
    setBubblesData(newBubbles); // trigger render for DOM nodes
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    initBubbles();
    
    const handleResize = () => {
      // Re-initialize physics on resize or clamp
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      bubblesPhysics.current.forEach(b => {
        if (b.x > clientWidth - b.size) b.x = Math.max(0, clientWidth - b.size);
        if (b.y > clientHeight - b.size) b.y = Math.max(0, clientHeight - b.size);
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isClient, initBubbles]);

  const updatePhysics = useCallback(function update() {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    bubblesPhysics.current.forEach((bubble) => {
      // Skip dragging bubble
      if (draggedBubbleId.current === bubble.id) return;
      
      let { x, y, velocityX, velocityY, size } = bubble;
      
      x += velocityX;
      y += velocityY;
      
      // Bounce logic with padding inside the container
      if (x <= 0) {
        x = 0;
        velocityX *= -1;
      } else if (x >= clientWidth - size) {
        x = clientWidth - size;
        velocityX *= -1;
      }
      
      if (y <= 0) {
        y = 0;
        velocityY *= -1;
      } else if (y >= clientHeight - size) {
        y = clientHeight - size;
        velocityY *= -1;
      }
      
      bubble.x = x;
      bubble.y = y;
      bubble.velocityX = velocityX;
      bubble.velocityY = velocityY;
    });
    
    // 2. Bubble-to-Bubble Collision
    for (let i = 0; i < bubblesPhysics.current.length; i++) {
      for (let j = i + 1; j < bubblesPhysics.current.length; j++) {
        const b1 = bubblesPhysics.current[i];
        const b2 = bubblesPhysics.current[j];
        
        const r1 = b1.size / 2;
        const r2 = b2.size / 2;
        
        const c1x = b1.x + r1;
        const c1y = b1.y + r1;
        const c2x = b2.x + r2;
        const c2y = b2.y + r2;
        
        const dx = c2x - c1x;
        const dy = c2y - c1y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = r1 + r2;
        
        if (distance < minDistance && distance > 0) {
          // Collision detected!
          // Separate them (prevent sticking)
          const overlap = minDistance - distance;
          const nx = dx / distance;
          const ny = dy / distance;
          
          const isB1Dragged = draggedBubbleId.current === b1.id;
          const isB2Dragged = draggedBubbleId.current === b2.id;
          
          // Move bubbles apart based on whether they are being dragged
          if (!isB1Dragged && !isB2Dragged) {
            b1.x -= nx * (overlap / 2);
            b1.y -= ny * (overlap / 2);
            b2.x += nx * (overlap / 2);
            b2.y += ny * (overlap / 2);
          } else if (isB1Dragged && !isB2Dragged) {
            b2.x += nx * overlap;
            b2.y += ny * overlap;
          } else if (!isB1Dragged && isB2Dragged) {
            b1.x -= nx * overlap;
            b1.y -= ny * overlap;
          }
          
          // Elastic Collision Response (exchange velocity along normal)
          if (!isB1Dragged && !isB2Dragged) {
            // we can use bubble size as proxy for mass to make bigger bubbles heavier
            const m1 = r1;
            const m2 = r2;
            
            // Relative velocity
            const kx = (b1.velocityX - b2.velocityX);
            const ky = (b1.velocityY - b2.velocityY);
            
            // 2 * dot(vel, normal) / (m1 + m2)
            const p = 2 * (nx * kx + ny * ky) / (m1 + m2);
            
            // Set new velocities + slight dampening (0.98)
            const dampening = 0.98;
            b1.velocityX = (b1.velocityX - p * m2 * nx) * dampening;
            b1.velocityY = (b1.velocityY - p * m2 * ny) * dampening;
            b2.velocityX = (b2.velocityX + p * m1 * nx) * dampening;
            b2.velocityY = (b2.velocityY + p * m1 * ny) * dampening;
            
            // Floor minimum limits to prevent stopping completely
            const minSpeed = 0.15;
            const speed1 = Math.sqrt(b1.velocityX**2 + b1.velocityY**2);
            if (speed1 < minSpeed) {
              b1.velocityX = (b1.velocityX / speed1) * minSpeed || (Math.random() - 0.5) * minSpeed;
              b1.velocityY = (b1.velocityY / speed1) * minSpeed || (Math.random() - 0.5) * minSpeed;
            }
            const speed2 = Math.sqrt(b2.velocityX**2 + b2.velocityY**2);
            if (speed2 < minSpeed) {
              b2.velocityX = (b2.velocityX / speed2) * minSpeed || (Math.random() - 0.5) * minSpeed;
              b2.velocityY = (b2.velocityY / speed2) * minSpeed || (Math.random() - 0.5) * minSpeed;
            }
          }
        }
      }
    }
    
    // 3. Apply transforms to DOM cleanly
    bubblesPhysics.current.forEach((bubble, idx) => {
      const domNode = bubbleRefs.current[idx];
      if (domNode) {
        domNode.style.transform = `translate3d(${bubble.x}px, ${bubble.y}px, 0)`;
      }
    });
    
    animationRef.current = requestAnimationFrame(update);
  }, []);

  // Animation loop
  useEffect(() => {
    if (bubblesData.length > 0) {
      animationRef.current = requestAnimationFrame(updatePhysics);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubblesData, updatePhysics]);

  const moveBubble = useCallback((clientX, clientY) => {
    if (draggedBubbleId.current === null || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const bubbleIndex = bubblesPhysics.current.findIndex(b => b.id === draggedBubbleId.current);
    const bubble = bubblesPhysics.current[bubbleIndex];
    if (!bubble) return;
    
    // Calculate new position
    let newX = clientX - rect.left - pointerOffset.current.x;
    let newY = clientY - rect.top - pointerOffset.current.y;
    
    // Constrain to container boundaries
    newX = Math.max(0, Math.min(rect.width - bubble.size, newX));
    newY = Math.max(0, Math.min(rect.height - bubble.size, newY));
    
    bubble.x = newX;
    bubble.y = newY;
    
    // Update DOM instantly for smooth dragging
    const domNode = bubbleRefs.current[bubbleIndex];
    if (domNode) {
      domNode.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
      domNode.style.zIndex = "50"; // Bring to front while dragging
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    e.preventDefault(); // Prevents touch panning and scroll
    moveBubble(e.clientX, e.clientY);
  }, [moveBubble]);

  const handlePointerUp = useCallback(() => {
    // Reset z-index
    if (draggedBubbleId.current !== null) {
      const bubbleIndex = bubblesPhysics.current.findIndex(b => b.id === draggedBubbleId.current);
      const domNode = bubbleRefs.current[bubbleIndex];
      if (domNode) {
        domNode.style.zIndex = "";
      }
    }
    
    draggedBubbleId.current = null;
    
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  }, [handlePointerMove]);

  // Pointer interactions
  const handlePointerDown = useCallback((e, bubbleId) => {
    // Only capture primary button (0) or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    e.preventDefault(); 
    e.stopPropagation();
    
    draggedBubbleId.current = bubbleId;
    
    const bubble = bubblesPhysics.current.find(b => b.id === bubbleId);
    if (!bubble || !containerRef.current) return;
    
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    // Container coordinates
    const rect = containerRef.current.getBoundingClientRect();
    const containerX = clientX - rect.left;
    const containerY = clientY - rect.top;
    
    // Offset from pointer to top-left of bubble
    pointerOffset.current = {
      x: containerX - bubble.x,
      y: containerY - bubble.y
    };
    
    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }, [handlePointerMove, handlePointerUp]);

  return (
    <section className="relative w-full h-[100vh] bg-gray-50 flex flex-col pt-16 pb-12 overflow-hidden border-t border-gray-200">
      {/* Background glow effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center mb-10 shrink-0">
        <div className="inline-block mb-3 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-600 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
          Crystal Stack
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 drop-shadow-sm">
          Tools &amp; Software We Use
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto px-4">
          Our technology stack powers everything we build. Interact with the crystals below.
        </p>
      </div>

      <div 
        ref={containerRef} 
        className="relative grow w-full max-w-7xl mx-auto z-10"
        style={{ touchAction: 'none' }} // Prevent touch scrolling within this container
      >
        {isClient && bubblesData.map((tool, idx) => (
          <Bubble
            key={tool.id}
            tool={tool}
            ref={(el) => {
              if (el) bubbleRefs.current[idx] = el;
            }}
            onPointerDown={(e) => handlePointerDown(e, tool.id)}
          />
        ))}
      </div>
    </section>
  );
}
