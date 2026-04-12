import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function TabPanel({ tabs, activeIndex, onTabClick }) {
  return (
    <div className="flex flex-col space-y-4 w-full justify-center">
      {tabs.map((tab, idx) => {
        const isActive = activeIndex === idx;
        
        return (
          <div 
            key={tab.id}
            onClick={() => onTabClick?.(idx)}
            className={cn(
              "group flex flex-col rounded-2xl border transition-all duration-500 overflow-hidden cursor-pointer",
              isActive 
                ? "bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]" 
                : "bg-transparent border-transparent"
            )}
          >
            {/* Tab Header */}
            <div className={cn(
              "px-6 py-5 flex items-center transition-colors duration-300",
              isActive ? "text-indigo-300" : "text-gray-400 group-hover:text-indigo-300/60"
            )}>
              <div className="text-xl font-medium tracking-tight break-words">{tab.label}</div>
            </div>

            {/* Expander Content */}
            <div className={cn(
              "grid transition-all duration-500 ease-in-out",
              isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
              <div className="overflow-hidden">
                <div className={cn(
                  "px-6 pb-6 transform transition-transform duration-500 delay-100",
                  isActive ? "translate-y-0" : "translate-y-4"
                )}>
                  <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500/50 to-transparent mb-5" />
                  <h3 className="text-2xl font-bold text-white mb-4">{tab.title}</h3>
                  <ul className="space-y-4">
                    {tab.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start text-gray-300 text-sm md:text-base leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 mr-3 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
