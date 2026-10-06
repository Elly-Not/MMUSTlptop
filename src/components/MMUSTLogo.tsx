import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const MMUSTLogo: React.FC<LogoProps> = ({ className = '', size = 52, showText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm select-none"
      >
        {/* Outer Circular Ring with Stitches */}
        <circle cx="100" cy="100" r="94" stroke="#0B4F9C" strokeWidth="4" fill="#FFFFFF" />
        <circle cx="100" cy="100" r="88" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <circle cx="100" cy="100" r="62" stroke="#0B4F9C" strokeWidth="3" fill="#F0F7FF" />

        {/* Circular text path guide: MASINDE MULIRO UNIVERSITY */}
        <path
          id="textPathTop"
          d="M 28,100 A 72,72 0 0,1 172,100"
          fill="none"
        />
        <text fontSize="12" fontWeight="800" fill="#0B2F64" letterSpacing="1.2">
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            MASINDE MULIRO UNIVERSITY
          </textPath>
        </text>

        {/* Circular text path guide: OF SCIENCE AND TECHNOLOGY */}
        <path
          id="textPathBottom"
          d="M 172,102 A 72,72 0 0,1 28,102"
          fill="none"
        />
        <text fontSize="10.5" fontWeight="800" fill="#0B2F64" letterSpacing="1">
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            OF SCIENCE &amp; TECHNOLOGY
          </textPath>
        </text>

        {/* Dots on sides */}
        <circle cx="22" cy="100" r="3.5" fill="#0B4F9C" />
        <circle cx="178" cy="100" r="3.5" fill="#0B4F9C" />

        {/* Industrial Gear Wheel Silhouette */}
        <g transform="translate(100, 100) scale(0.92) translate(-100, -100)">
          <path
            d="M93 42h14l2 10 7 3 8-7 10 10-7 8 3 7 10 2v14l-10 2-3 7 7 8-10 10-8-7-7 3-2 10H93l-2-10-7-3-8 7-10-10 7-8-3-7-10-2v-14l10-2 3-7-7-8 10-10 8 7 7-3 2-10z"
            fill="#1E293B"
          />
          <circle cx="100" cy="100" r="38" fill="#FFFFFF" stroke="#0B4F9C" strokeWidth="2.5" />
        </g>

        {/* Open Book in Center */}
        <path
          d="M72 108c10-5 24-2 28 4 4-6 18-9 28-4v20c-10-5-24-2-28 4-4-6-18-9-28-4v-20z"
          fill="#FFFFFF"
          stroke="#0B4F9C"
          strokeWidth="2.5"
        />
        <path d="M100 112v20" stroke="#0B4F9C" strokeWidth="2.5" />
        {/* Book pages lines */}
        <path d="M78 116c6-3 15-2 18 2M104 118c3-4 12-5 18-2" stroke="#60A5FA" strokeWidth="1.5" />

        {/* Bold Stylized MMUST in Book */}
        <text
          x="100"
          y="102"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fontFamily="sans-serif"
          fill="#0B4F9C"
          stroke="#0B4F9C"
          strokeWidth="0.5"
        >
          Mmust
        </text>

        {/* Ribbon Banner at bottom */}
        <g transform="translate(0, 15)">
          {/* Banner Ribbons Endings */}
          <path d="M24 165 L44 153 L44 172 Z" fill="#93C5FD" stroke="#0B4F9C" strokeWidth="1.5" />
          <path d="M176 165 L156 153 L156 172 Z" fill="#93C5FD" stroke="#0B4F9C" strokeWidth="1.5" />
          {/* Banner Center */}
          <path
            d="M38 153 C70 148, 130 148, 162 153 L162 170 C130 166, 70 166, 38 170 Z"
            fill="#BFDBFE"
            stroke="#0B4F9C"
            strokeWidth="2"
          />
          <text
            x="100"
            y="164"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="800"
            fill="#0A3670"
            letterSpacing="0.8"
          >
            Technology for Development
          </text>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-blue-900 leading-tight text-lg tracking-tight">
            MMUST
          </span>
          <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
            Digital Clearance System
          </span>
          <span className="text-[10px] text-slate-500 font-medium italic">
            Technology for Development
          </span>
        </div>
      )}
    </div>
  );
};
