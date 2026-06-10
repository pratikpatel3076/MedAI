import React, { useState } from 'react';
import { Search, Loader2, Pill, Info, AlertCircle, AlertTriangle, RefreshCcw } from 'lucide-react';
import api from '../api/axios';
import ECGBackground from '../components/ECGBackground';

const MedicineLookup = () => {
  const [medicineName, setMedicineName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!medicineName.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post('/medicine/lookup', { medicine_name: medicineName });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError('Medicine not found. Please check the spelling or consult a pharmacist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen relative">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Pill className="text-primary" size={32} />
          Medicine Information Lookup
        </h1>
        <p className="text-gray-400">Search for reliable information about medications</p>
      </div>

      <form onSubmit={handleLookup} className="relative max-w-2xl mx-auto mb-12">
        <input
          type="text"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          placeholder="Enter medicine name (e.g., Paracetamol, Metformin)..."
          className="w-full bg-card border border-border rounded-2xl py-5 px-6 pr-16 focus:outline-none focus:border-primary transition-all text-white placeholder:text-gray-600 shadow-xl"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!medicineName.trim() || loading}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
            medicineName.trim() && !loading ? 'bg-primary text-white scale-100' : 'bg-border text-gray-500 scale-90'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center text-red-400 flex flex-col items-center gap-3 animate-in fade-in duration-300">
          <AlertCircle size={40} />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 border-l-4 border-l-blue-500 relative">
            <div className="absolute top-6 right-8">
              <span className="bg-border/50 text-gray-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-border">
                AI Generated · Verify with Pharmacist
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-border pb-4 uppercase tracking-wider">
              <span className="bg-primary/20 text-primary p-2 rounded-lg">💊</span>
              {result.medicine_name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <section className="bg-background/40 p-5 rounded-2xl border border-border/50 transition-all hover:bg-background/60">
                <h3 className="text-primary font-bold mb-3 flex items-center gap-2">
                  <Info size={18} /> Used for
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">{result.used_for}</p>
              </section>

              <section className="bg-background/40 p-5 rounded-2xl border border-border/50 transition-all hover:bg-background/60">
                <h3 className="text-primary font-bold mb-3 flex items-center gap-2">
                  <RefreshCcw size={18} className="rotate-45" /> How it works
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">{result.how_it_works}</p>
              </section>

              <section className="bg-background/40 p-5 rounded-2xl border border-border/50 transition-all hover:bg-background/60">
                <h3 className="text-primary font-bold mb-3">Common Dosage</h3>
                <p className="text-gray-300 text-sm italic">
                  {result.common_dosage}
                </p>
              </section>

              <section className="bg-background/40 p-5 rounded-2xl border border-border/50 transition-all hover:bg-background/60">
                <h3 className="text-primary font-bold mb-3">Side Effects</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                  {result.side_effects.map((effect, idx) => (
                    <li key={idx}>{effect}</li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="mb-8 bg-background/40 p-5 rounded-2xl border border-border/50 transition-all hover:bg-background/60">
              <h3 className="text-primary font-bold mb-3">Drug Interactions</h3>
              <div className="flex flex-wrap gap-2">
                {result.interactions.map((item, idx) => (
                  <span key={idx} className="bg-border/50 text-gray-400 px-3 py-1 rounded-full text-sm border border-border">
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl mb-8">
              <h3 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
                <AlertTriangle size={20} /> Warnings
              </h3>
              <p className="text-amber-200/80 leading-relaxed text-sm">{result.warnings}</p>
            </section>

            <div className="border border-red-500/30 bg-red-500/5 p-4 rounded-xl text-center">
              <p className="text-red-400 text-[10px] font-medium italic">
                {result.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}
      <ECGBackground />
    </div>
  );
};

export default MedicineLookup;
