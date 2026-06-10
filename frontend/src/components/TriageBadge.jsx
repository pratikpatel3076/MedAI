import React, { useState, useEffect } from 'react';

const TriageBadge = ({ level }) => {
  const styles = {
    LOW: "bg-success/20 text-success border-success/30",
    MEDIUM: "bg-warning/20 text-warning border-warning/30",
    URGENT: "bg-danger/20 text-danger border-danger/30 animate-pulse-fast shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  };

  const labels = {
    LOW: "Low Priority",
    MEDIUM: "Medium Priority",
    URGENT: "Urgent Attention",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[level] || styles.LOW}`}>
      {labels[level] || level}
    </span>
  );
};

export function TriageMeter({ level }) {
  const [offset, setOffset] = useState(251.2); // Full circumference (PI * 80)
  
  const radius = 80;
  const circumference = Math.PI * radius;
  
  const configs = {
    LOW: { color: "#22c55e", percent: 0.30, label: "Low Priority" },
    MEDIUM: { color: "#f59e0b", percent: 0.60, label: "Medium Priority" },
    URGENT: { color: "#ef4444", percent: 0.95, label: "Urgent Attention" },
  };
  
  const config = configs[level] || configs.LOW;
  
  useEffect(() => {
    const targetOffset = circumference * (1 - config.percent);
    const timeout = setTimeout(() => setOffset(targetOffset), 100);
    return () => clearTimeout(timeout);
  }, [config.percent, circumference]);

  const needleRotation = -90 + (config.percent * 180);

  return (
    <div className="flex flex-col items-center mt-4 mb-2 animate-in fade-in zoom-in duration-500">
      <div className="relative w-48">
        <svg viewBox="0 0 200 110" className="w-full">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e1e2e"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Foreground Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={config.color}
            strokeWidth="12"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1s ease-out',
              animation: level === 'URGENT' ? 'pulse-slow 2s infinite' : 'none'
            }}
          />
          {/* Needle */}
          <line
            x1="100" y1="100"
            x2="100" y2="40"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              transformOrigin: '100px 100px',
              transform: `rotate(${needleRotation}deg)`,
              transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
          <circle cx="100" cy="100" r="6" fill="#0a0a0f" stroke="white" strokeWidth="2" />
        </svg>
        <div className="text-center mt-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.7; filter: brightness(1.2); }
        }
      `}</style>
    </div>
  );
}

export default TriageBadge;
