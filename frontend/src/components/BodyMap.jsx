import React, { useState } from 'react';

const BodyMap = ({ onRegionClick }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);

  const regions = [
    { id: 'head', name: 'Head', symptom: 'I have a headache and pain in my head', shape: <ellipse cx="100" cy="35" rx="28" ry="32"/> },
    { id: 'neck', name: 'Throat/Neck', symptom: 'I have a sore throat and neck pain', shape: <rect x="88" y="65" width="24" height="20"/> },
    { id: 'chest', name: 'Chest', symptom: 'I have chest pain and discomfort in my chest', shape: <rect x="60" y="85" width="80" height="70" rx="5"/> },
    { id: 'abdomen', name: 'Abdomen', symptom: 'I have stomach pain and abdominal discomfort', shape: <rect x="60" y="155" width="80" height="50" rx="5"/> },
    { id: 'pelvis', name: 'Pelvis', symptom: 'I have lower abdominal pain and pelvic discomfort', shape: <rect x="65" y="205" width="70" height="35" rx="5"/> },
    { id: 'l-arm', name: 'Left Arm', symptom: 'I have pain and discomfort in my left arm', shape: <rect x="20" y="85" width="35" height="100" rx="15"/> },
    { id: 'r-arm', name: 'Right Arm', symptom: 'I have pain and discomfort in my right arm', shape: <rect x="145" y="85" width="35" height="100" rx="15"/> },
    { id: 'l-leg', name: 'Left Leg', symptom: 'I have pain and discomfort in my left leg', shape: <rect x="65" y="240" width="32" height="120" rx="10"/> },
    { id: 'r-leg', name: 'Right Leg', symptom: 'I have pain and discomfort in my right leg', shape: <rect x="103" y="240" width="32" height="120" rx="10"/> },
    { id: 'eyes', name: 'Eyes', symptom: 'I have eye pain, redness or vision problems', shape: <g><circle cx="88" cy="30" r="4"/><circle cx="112" cy="30" r="4"/></g> }
  ];

  const handleClick = (region) => {
    setActiveRegion(region.id);
    onRegionClick(region.symptom);
    setTimeout(() => setActiveRegion(null), 300);
  };

  return (
    <div className="relative w-full max-w-[200px] mx-auto group">
      <svg
        viewBox="0 0 200 400"
        className="w-full h-auto drop-shadow-2xl"
      >
        {regions.map((region) => (
          <g
            key={region.id}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredRegion(region.name)}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleClick(region)}
          >
            {React.cloneElement(region.shape, {
              fill: activeRegion === region.id ? '#2563eb' : hoveredRegion === region.name ? '#1e3a5f' : '#1e2a3a',
              stroke: '#3b82f6',
              strokeWidth: 1.5,
              className: 'transition-colors duration-200'
            })}
          </g>
        ))}
      </svg>
      
      {/* Tooltip */}
      {hoveredRegion && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
          {hoveredRegion}
        </div>
      )}
    </div>
  );
};

export default BodyMap;
