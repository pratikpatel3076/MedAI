import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem('disclaimerAccepted', 'true');
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 text-warning">
          <ShieldAlert size={32} />
          <h2 className="text-2xl font-bold text-white">Medical Disclaimer</h2>
        </div>
        
        <div className="space-y-4 text-gray-300 mb-8 leading-relaxed">
          <p>
            This AI Medical Assistant is for educational and preliminary informational purposes only.
            It is <span className="text-white font-semibold">NOT</span> a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always consult a qualified doctor for medical decisions.
          </p>
          <p className="bg-danger/10 border border-danger/20 p-3 rounded-lg text-danger-light font-bold">
            In case of emergency, call 112 immediately.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group mb-8">
          <input 
            type="checkbox" 
            className="mt-1 w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
            I understand this is not a substitute for professional medical advice
          </span>
        </label>

        <button
          disabled={!isChecked}
          onClick={handleAccept}
          className={`w-full py-4 rounded-xl font-bold transition-all ${
            isChecked 
              ? 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/20' 
              : 'bg-border text-gray-500 cursor-not-allowed'
          }`}
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;
