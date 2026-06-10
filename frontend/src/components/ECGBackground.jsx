import { useEffect, useRef } from 'react'

export default function ECGBackground() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-20 pointer-events-none z-0 opacity-20">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <polyline
          points="0,40 100,40 120,40 130,10 140,70 150,20 160,60 170,40 280,40 300,40 320,40 340,10 350,70 360,20 370,60 380,40 500,40 520,40 540,10 550,70 560,20 570,60 580,40 700,40 720,40 740,10 750,70 760,20 770,60 780,40 900,40 920,40 940,10 950,70 960,20 970,60 980,40 1100,40 1120,40 1140,10 1150,70 1160,20 1170,60 1180,40 1300,40 1440,40"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className="ecg-line"
        />
      </svg>
      <style>{`
        .ecg-line {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: ecgDraw 3s linear infinite;
        }
        @keyframes ecgDraw {
          0% { stroke-dashoffset: 2000; opacity: 1; }
          80% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
