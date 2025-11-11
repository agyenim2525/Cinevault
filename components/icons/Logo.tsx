import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 160 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
    >
        <text 
            fontFamily="Poppins, sans-serif" 
            fontSize="24" 
            fontWeight="bold" 
            fill="white" 
            x="0" 
            y="21"
        >
            Cine
        </text>
        <text 
            fontFamily="Poppins, sans-serif" 
            fontSize="24" 
            fontWeight="bold" 
            fill="#E5097F"
            x="58" 
            y="21"
        >
            Vault
        </text>
    </svg>
);