'use client';

import React, { useRef, useState } from 'react';
import { TabPanel } from './TabPanel';
import { StatsGrid } from './StatsGrid';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function IndustrySection({ section }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalTabs = section.tabs.length;

  useGSAP(() => {
    if (!containerRef.current || totalTabs <= 1) return;

    // We pin the container for a scroll distance proportional to the number of tabs
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${totalTabs * 100}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        // Calculate which tab should be active based on scroll progress
        const rawIndex = self.progress * (totalTabs - 1);
        let idx = Math.round(rawIndex);
        
        // Safety bounds
        if (idx < 0) idx = 0;
        if (idx >= totalTabs) idx = totalTabs - 1;
        
        if (idx !== activeIndex) {
          setActiveIndex(idx);
        }
      },
      snap: {
        snapTo: 1 / (totalTabs - 1),
        duration: { min: 0.2, max: 0.5 },
        delay: 0.1,
        ease: 'power1.inOut'
      }
    });

    return () => {
      trigger.kill();
    };
  }, { dependencies: [totalTabs, activeIndex], scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="h-screen w-full bg-[#030614] text-white flex flex-col justify-between overflow-hidden relative border-b border-white/5"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-[50vh] h-[50vh] bg-indigo-600/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vh] h-[50vh] bg-blue-600/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Main Split Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 pt-20 pb-10 overflow-hidden">
        
        {/* Left Side: Tabs Content */}
        <div className="w-full lg:w-[45%] flex h-full items-center justify-center z-10">
          <TabPanel 
            tabs={section.tabs} 
            activeIndex={activeIndex} 
            onTabClick={setActiveIndex}
          />
        </div>

        {/* Right Side: Hero Image */}
        <div className="w-full lg:w-[55%] h-[40vh] lg:h-[70vh] relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)] z-10 border border-white/10 group bg-white/5">
          {section.tabs.map((tab, idx) => (
            <div 
              key={tab.id}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-in-out",
                activeIndex === idx ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"
              )}
            >
               <Image 
                 src={tab.imageUrl} 
                 alt={tab.label}
                 fill
                 sizes="(max-width: 1024px) 100vw, 50vw"
                 className="object-cover"
                 priority={idx === 0}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#030614] via-transparent to-transparent opacity-80" />
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Stats Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 z-10 pb-8 shrink-0">
        <StatsGrid stats={section.stats} />
      </div>

    </section>
  );
}
