import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, ChevronUp, History, User, Stethoscope, MessageSquare } from 'lucide-react';
import api from '../api/axios';
import TriageBadge from '../components/TriageBadge';
import ECGBackground from '../components/ECGBackground';

const SymptomHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/symptoms/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Loading your health timeline...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 relative">
      <div className="mb-12 flex items-center gap-4">
        <div className="bg-blue-500/20 p-4 rounded-2xl shadow-lg shadow-blue-500/10">
          <History className="text-blue-500" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Health Timeline</h1>
          <p className="text-gray-400">Your past symptom assessments and AI recommendations</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-3xl p-16 text-center shadow-2xl">
          <div className="bg-[#0a0a0f] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#1e1e2e]">
             <MessageSquare className="text-gray-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Your timeline is empty</h3>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">Start your first consultation to begin tracking your health history with AI guidance.</p>
          <a 
            href="/chat" 
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            Start Triage Chat
          </a>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#1e1e2e]" />
          
          <div className="space-y-8">
            {history.map((item, index) => (
              <div key={item._id} className="relative pl-12 group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Triage Dot */}
                <div className={`absolute left-2.5 top-8 w-3.5 h-3.5 rounded-full border-2 border-[#0a0a0f] z-10 transition-transform group-hover:scale-125 ${
                  item.ai_response.triage_level === 'URGENT' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  item.ai_response.triage_level === 'MEDIUM' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
                  'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                }`} />
                
                {/* Horizontal connector line */}
                <div className="absolute left-6 top-[38px] w-6 h-0.5 bg-[#1e1e2e]" />

                <div 
                  className={`bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden transition-all duration-300 hover:border-blue-500/30 cursor-pointer shadow-xl ${
                    expandedId === item._id ? 'ring-1 ring-blue-500/20 border-blue-500/30' : ''
                  }`}
                  onClick={() => toggleExpand(item._id)}
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-[#0a0a0f] px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <Calendar size={12} className="text-blue-500" />
                          {formatDate(item.created_at)}
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#0a0a0f] px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <Clock size={12} className="text-blue-500" />
                          {formatTime(item.created_at)}
                        </div>
                      </div>
                      <TriageBadge level={item.ai_response.triage_level} />
                    </div>

                    <div className="flex items-start gap-4 mb-5 bg-[#0a0a0f]/50 p-4 rounded-xl border border-[#1e1e2e]/50">
                      <div className="bg-[#12121a] p-2 rounded-lg border border-[#1e1e2e] shrink-0 shadow-inner">
                        <User size={18} className="text-blue-400" />
                      </div>
                      <p className="text-gray-300 line-clamp-2 italic text-sm leading-relaxed">
                        "{item.input_text}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#1e1e2e]">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-500/10 rounded-md">
                          <Stethoscope size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Recommended Specialist</p>
                          <p className="text-sm font-bold text-white">{item.ai_response.specialist}</p>
                        </div>
                      </div>
                      <div className={`p-2 rounded-full bg-[#1e1e2e] text-gray-400 transition-all ${expandedId === item._id ? 'rotate-180 text-blue-500' : ''}`}>
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {expandedId === item._id && (
                    <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-4 duration-500">
                      <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <MessageSquare size={100} />
                        </div>
                        <h4 className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2 relative z-10">
                          <Activity size={14} /> Full AI Assessment
                        </h4>
                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap relative z-10 font-medium">
                          {item.ai_response.reply}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ECGBackground />
    </div>
  );
};

export default SymptomHistory;
