'use client';

import React from 'react';
import { IndustrySolutionsData } from './data';
import { IndustrySection } from './IndustrySection';

export function IndustrySolutionsContainer() {
  return (
    <div className="w-full flex flex-col bg-[#030614]">
      {IndustrySolutionsData.map((section, idx) => (
        <IndustrySection key={section.id} section={section} />
      ))}
    </div>
  );
}
