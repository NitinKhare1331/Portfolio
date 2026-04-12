import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
        >
          <div>
            <div className="text-sm text-gray-400 mb-2 font-medium">{stat.label}</div>
            <div className="text-4xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              {stat.value}
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light">
              {stat.description}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 text-[10px] font-bold tracking-wider text-gray-500 uppercase flex justify-end">
            {stat.region}
          </div>
        </div>
      ))}
    </div>
  );
}
