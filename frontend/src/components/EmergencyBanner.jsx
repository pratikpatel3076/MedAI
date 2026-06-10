import React from 'react';
import { AlertOctagon, PhoneCall, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const EmergencyBanner = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-emergency/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full bg-card border-4 border-danger rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(239,68,68,0.4)] animate-pulse-fast"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-danger p-4 rounded-full">
            <AlertOctagon size={64} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">
          ⚠ EMERGENCY DETECTED
        </h1>
        
        <p className="text-xl text-gray-200 mb-10 font-medium">
          Based on your symptoms, you may need immediate medical attention. 
          Every second counts.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="tel:112"
            className="flex items-center justify-center gap-3 bg-white text-danger py-5 rounded-2xl text-2xl font-black hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            <PhoneCall size={28} />
            Call 112
          </a>
          
          <button
            onClick={onDismiss}
            className="flex items-center justify-center gap-3 bg-border text-white py-5 rounded-2xl text-xl font-bold hover:bg-gray-800 transition-all"
          >
            <CheckCircle size={24} />
            I am safe
          </button>
        </div>
        
        <p className="mt-8 text-gray-400 text-sm">
          This is an automated alert based on keyword detection.
        </p>
      </motion.div>
    </div>
  );
};

export default EmergencyBanner;
