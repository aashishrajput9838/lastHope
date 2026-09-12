import React from 'react';

export default function BrandLogo({ size = 'default' }) {
  const isLarge = size === 'large';
  const iconSize = isLarge ? 28 : 22;

  return (
    <div className="brand-badge">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4E2E" />
            <stop offset="50%" stopColor="#E5181C" />
            <stop offset="100%" stopColor="#DC7D70" />
          </linearGradient>
        </defs>
        {/* Primary 4-point sparkle */}
        <path
          d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
          fill="url(#sparkGradient)"
        />
        {/* Secondary micro accent star */}
        <path
          d="M19 3C19 4.3 17.7 5.5 16.5 5.5C17.7 5.5 19 6.7 19 8C19 6.7 20.3 5.5 21.5 5.5C20.3 5.5 19 4.3 19 3Z"
          fill="#DC7D70"
          opacity="0.85"
        />
      </svg>
      <span className="brand-name" style={{ fontSize: isLarge ? '24px' : '20px' }}>
        last<span style={{ fontWeight: 800, color: 'var(--brand-red)' }}>Hope</span>
      </span>
    </div>
  );
}
