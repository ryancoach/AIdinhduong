import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-12 w-12' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      strokeWidth="1.5" 
      className={className}
      aria-label="Application Logo"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2dd4bf' }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
        </linearGradient>
      </defs>
      {/* Magnifying glass outline */}
      <path 
        stroke="url(#logo-gradient)" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
      />
      {/* Leaf shape inside */}
      <path 
        fill="url(#logo-gradient)" 
        d="M12.53 12.53a5.25 5.25 0 01-7.424 0 5.25 5.25 0 010-7.424l.176-.177L13.5 13.15l-1.025-.62z" 
      />
    </svg>
  );
};

export default Logo;