import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Stethoscope, 
  Pill, 
  History, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import DisclaimerModal from '../components/DisclaimerModal';
import ECGBackground from '../components/ECGBackground';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden relative">
      <DisclaimerModal />
      
      {/* Section 1 — Hero */}
      <section className="relative pt-20 pb-16 px-6">
        {/* CSS grid background pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.2) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Glowing blue orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#12121a] border border-[#1e1e2e] px-4 py-2 rounded-full text-blue-400 text-sm font-bold shadow-xl shadow-blue-500/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Secure & Private AI Analysis
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
            Your AI <span className="text-blue-500">Medical</span> <br /> 
            Assistant.
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Get instant symptom triage and understand your medical reports in plain language using advanced Groq LLaMA 3.3 AI.
          </p>
        </div>
      </section>

      {/* Section 2 — Stats bar */}
      <section className="px-6 mb-20">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl px-8 py-6 mx-auto max-w-4xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={20} className="text-blue-500" />
                <span className="text-2xl font-black">6</span>
              </div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Core Features</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-l md:border-[#1e1e2e] md:pl-8">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={20} className="text-blue-500" />
                <span className="text-2xl font-black">3</span>
              </div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Languages</span>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-l md:border-[#1e1e2e] md:pl-8">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={20} className="text-blue-500" />
                <span className="text-2xl font-black">Real-time</span>
              </div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Triage</span>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left md:border-l md:border-[#1e1e2e] md:pl-8">
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope size={20} className="text-blue-500" />
                <span className="text-2xl font-black">Doctor</span>
              </div>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Dashboard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Feature cards */}
      <section className="px-6 max-w-6xl mx-auto mb-32">
        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            to="/chat"
            className="group bg-[#12121a] border border-[#1e1e2e] p-8 rounded-3xl hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-xl hover:shadow-blue-500/5"
          >
            <div className="bg-blue-500/20 text-blue-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Symptom Triage</h3>
            <p className="text-gray-400">Describe how you feel and get immediate guidance on what to do next.</p>
            <div className="mt-6 flex items-center gap-2 text-blue-500 font-bold">
              Start Chat <ArrowRight size={18} />
            </div>
          </Link>

          <Link 
            to="/reports"
            className="group bg-[#12121a] border border-[#1e1e2e] p-8 rounded-3xl hover:border-green-500/50 transition-all hover:-translate-y-1 shadow-xl hover:shadow-green-500/5"
          >
            <div className="bg-green-500/20 text-green-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Report Analyzer</h3>
            <p className="text-gray-400">Upload your PDF reports and get a simple, easy-to-understand explanation.</p>
            <div className="mt-6 flex items-center gap-2 text-green-500 font-bold">
              Analyze PDF <ArrowRight size={18} />
            </div>
          </Link>

          <Link 
            to="/medicine"
            className="group bg-[#12121a] border border-[#1e1e2e] p-8 rounded-3xl hover:border-purple-500/50 transition-all hover:-translate-y-1 shadow-xl hover:shadow-purple-500/5"
          >
            <div className="bg-purple-500/20 text-purple-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Pill size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Medicine Info</h3>
            <p className="text-gray-400">Search any medicine for dosage, side effects, and drug interactions explained simply.</p>
            <div className="mt-6 flex items-center gap-2 text-purple-500 font-bold">
              Search Medicine <ArrowRight size={18} />
            </div>
          </Link>

          <Link 
            to="/history"
            className="group bg-[#12121a] border border-[#1e1e2e] p-8 rounded-3xl hover:border-teal-500/50 transition-all hover:-translate-y-1 shadow-xl hover:shadow-teal-500/5"
          >
            <div className="bg-teal-500/20 text-teal-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <History size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Health Timeline</h3>
            <p className="text-gray-400">Review your past symptom consultations and track your triage history over time.</p>
            <div className="mt-6 flex items-center gap-2 text-teal-500 font-bold">
              View History <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </section>

      {/* Section 4 — How it works */}
      <section className="px-6 mb-32 max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16">How It Works</h2>
        
        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connecting lines for desktop */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-[#1e1e2e] -z-10" />
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center text-3xl font-black text-blue-400 shadow-xl">
              1
            </div>
            <h4 className="text-xl font-bold">Describe Symptoms</h4>
            <p className="text-sm text-gray-500">Type or speak your symptoms in any language</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center text-3xl font-black text-blue-400 shadow-xl">
              2
            </div>
            <h4 className="text-xl font-bold">AI Analysis</h4>
            <p className="text-sm text-gray-500">Groq LLaMA instantly triages and assesses severity</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center text-3xl font-black text-blue-400 shadow-xl">
              3
            </div>
            <h4 className="text-xl font-bold">Get Guidance</h4>
            <p className="text-sm text-gray-500">Receive specialist recommendation and next steps</p>
          </div>
        </div>
      </section>

      {/* Section 5 — Footer */}
      <footer className="px-6 pb-20 border-t border-[#1e1e2e] pt-12 text-gray-500 text-sm flex flex-col items-center gap-6">
        <p className="text-center">Powered by Groq LLaMA 3.3 · Built with React & Flask</p>
        <div className="flex flex-wrap justify-center gap-8">
          <span className="flex items-center gap-2 px-4 py-1.5 bg-[#12121a] border border-[#1e1e2e] rounded-full">
            <ShieldCheck size={16} className="text-blue-500" /> HIPAA Compliant Architecture
          </span>
          <span className="flex items-center gap-2 px-4 py-1.5 bg-[#12121a] border border-[#1e1e2e] rounded-full">
            <ShieldCheck size={16} className="text-blue-500" /> 256-bit Encryption
          </span>
        </div>
      </footer>

      <ECGBackground />
    </div>
  );
};

export default Home;
