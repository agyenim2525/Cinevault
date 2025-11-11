import React from 'react';

// FIX: Renamed component from BookmarkIcon to CompassIcon and updated SVG.
export const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
    >
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 21a9 9 0 100-18 9 9 0 000 18z" 
    />
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.75 8.25L12 12m0 0l-3.75 3.75M12 12L8.25 8.25M12 12l3.75 3.75M12 3v1.5M12 19.5v1.5M4.5 12h1.5m12 0h1.5" 
    />
  </svg>
);
