import React from 'react';

export default function AuthBackground() {
  return (
    <div className="auth-bg-geometry" aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.65 }}
      >
        {/* Subtle large sweeping arcs inspired by the Dribbble reference */}
        <circle
          cx="200"
          cy="450"
          r="680"
          stroke="#BEC1C1"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.3"
        />
        <circle
          cx="1240"
          cy="450"
          r="720"
          stroke="#BEC1C1"
          strokeWidth="1"
          opacity="0.35"
        />
        <path
          d="M-100 150 Q 500 50 1100 750"
          stroke="#BEC1C1"
          strokeWidth="1"
          opacity="0.25"
        />
        <path
          d="M300 950 Q 800 650 1550 200"
          stroke="#BEC1C1"
          strokeWidth="1.2"
          opacity="0.3"
        />

        {/* Soft celestial dots/nodes */}
        <circle cx="180" cy="120" r="5" fill="#BEC1C1" opacity="0.4" />
        <circle cx="180" cy="120" r="10" fill="#BEC1C1" opacity="0.15" />

        <circle cx="1320" cy="220" r="4" fill="#BEC1C1" opacity="0.4" />
        <circle cx="1320" cy="220" r="8" fill="#BEC1C1" opacity="0.15" />

        <circle cx="110" cy="740" r="6" fill="#BEC1C1" opacity="0.4" />
        <circle cx="110" cy="740" r="14" fill="#BEC1C1" opacity="0.12" />

        <circle cx="1380" cy="680" r="8" fill="#BEC1C1" opacity="0.35" />
        <circle cx="1380" cy="680" r="18" fill="#BEC1C1" opacity="0.1" />

        <circle cx="680" cy="70" r="4" fill="#BEC1C1" opacity="0.3" />
        <circle cx="820" cy="840" r="5" fill="#BEC1C1" opacity="0.3" />
      </svg>
    </div>
  );
}
