import React from 'react';

// FIX: Renamed component from MoonIcon to FilmIcon and updated SVG.
export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        d="M6 3.75V20.25m12-16.5V20.25M6 3.75H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25H6m12-16.5h1.5A2.25 2.25 0 0121.75 6v12a2.25 2.25 0 01-2.25 2.25H18m-12 0h12"
    />
  </svg>
);