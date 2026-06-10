import React, { useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle, X, CheckCircle } from 'lucide-react';
import api from '../api/axios';
import ReportCard from '../components/ReportCard';
import ECGBackground from '../components/ECGBackground';

const ReportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please drop a valid PDF file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/reports/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to analyze report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-white">Report Analyzer</h2>
        <p className="text-gray-400">Upload your blood test or medical report for a simple AI explanation.</p>
      </div>

      {!result && (
        <div 
          className={`relative border-2 border-dashed rounded-3xl p-12 transition-all ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border bg-card'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf"
          />
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
              file ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
            }`}>
              {file ? <CheckCircle size={40} /> : <Upload size={40} />}
            </div>
            
            {file ? (
              <div className="space-y-2">
                <p className="text-xl font-bold text-white">{file.name}</p>
                <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={() => setFile(null)}
                  className="text-danger text-sm font-bold flex items-center gap-1 mx-auto hover:underline"
                >
                  <X size={14} /> Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl font-bold text-white">Drop your report here</p>
                <p className="text-gray-400">or click to browse files (PDF only)</p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-danger/10 border border-danger/20 p-4 rounded-2xl flex items-center gap-3 text-danger">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {file && !result && (
        <div className="space-y-6">
          {loading ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center animate-in fade-in duration-500">
              <div className="relative w-48 h-64 mx-auto border-2 border-blue-500/30 rounded-lg overflow-hidden bg-[#12121a] mb-8">
                {/* Document lines */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="mx-4 my-2 h-2 bg-[#1e1e2e] rounded" style={{width: i % 3 === 0 ? '60%' : '85%'}} />
                ))}
                {/* Scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-lg shadow-blue-400/50" 
                     style={{animation: 'scanDown 1.5s ease-in-out infinite'}} />
              </div>
              <p className="text-blue-400 text-sm mt-4 animate-pulse font-bold tracking-widest uppercase">Analyzing your medical report...</p>
              <style>{`
                @keyframes scanDown {
                  0% { top: 0%; }
                  100% { top: 100%; }
                }
              `}</style>
            </div>
          ) : (
            <button
              onClick={handleUpload}
              className="w-full py-5 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black text-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
            >
              <FileText />
              Analyze Report
            </button>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <ReportCard data={result} />
          <button 
            onClick={() => {setResult(null); setFile(null);}}
            className="w-full py-4 border border-border text-gray-400 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} />
            Analyze Another Report
          </button>
        </div>
      )}

      <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl">
        <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          How it works
        </h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>1. Our system extracts text from your uploaded PDF report securely.</li>
          <li>2. Groq LLaMA 3.3 AI analyzes values against standard medical ranges.</li>
          <li>3. You get a summary, key findings, and red flags in plain English.</li>
          <li className="text-gray-500 italic mt-2">Note: Scanned images/photos are not supported. Please use text-based PDFs.</li>
        </ul>
      </div>
      <ECGBackground />
    </div>
  );
};

const RefreshCcw = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);

export default ReportAnalyzer;
