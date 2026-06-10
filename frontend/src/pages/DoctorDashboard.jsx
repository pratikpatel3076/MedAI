import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  FileText, 
  MessageSquare, 
  PlusCircle, 
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import api from '../api/axios';
import TriageBadge from '../components/TriageBadge';
import ECGBackground from '../components/ECGBackground';

const DoctorDashboard = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, [filter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/doctor/consultations?triage_level=${filter}`);
      setConsultations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (id) => {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await api.post(`/doctor/consultations/${id}/note`, { note: noteText });
      setConsultations(prev => prev.map(c => c._id === id ? { ...c, doctor_note: noteText } : c));
      setNoteText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
      setNoteText('');
    } else {
      setExpandedRow(id);
      const cons = consultations.find(c => c._id === id);
      setNoteText(cons?.doctor_note || '');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Users className="text-primary" />
            Patient Consultations
          </h2>
          <p className="text-gray-400">Review and manage AI-triage results</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="ALL">All Levels</option>
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="URGENT">Urgent Priority</option>
            </select>
          </div>
          <button 
            onClick={fetchConsultations}
            className="p-2.5 bg-border hover:bg-gray-800 rounded-xl transition-colors"
          >
            <RefreshCcw size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Patient Input</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Triage</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
                    <p className="text-gray-400 font-medium italic">Loading consultations...</p>
                  </td>
                </tr>
              ) : consultations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <p className="text-gray-500 font-medium">No consultations found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                consultations.map((c) => (
                  <React.Fragment key={c._id}>
                    <tr 
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${expandedRow === c._id ? 'bg-primary/5' : ''}`}
                      onClick={() => toggleRow(c._id)}
                    >
                      <td className="px-6 py-4 max-w-md">
                        <p className="text-white font-medium truncate">{c.input_text}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-sm text-gray-400 font-bold">
                          {c.type === 'symptom' ? <MessageSquare size={16} /> : <FileText size={16} />}
                          {c.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <TriageBadge level={c.triage_level} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {formatDate(c.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {expandedRow === c._id ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-gray-500" />}
                      </td>
                    </tr>
                    
                    {expandedRow === c._id && (
                      <tr className="bg-primary/5 border-t border-primary/20">
                        <td colSpan="5" className="px-8 py-8">
                          <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">AI Response Summary</h4>
                                <div className="bg-background/50 border border-border p-5 rounded-2xl text-sm text-gray-300 leading-relaxed">
                                  {c.ai_response?.reply || c.ai_response?.summary}
                                </div>
                              </div>
                              
                              {c.ai_response?.specialist && (
                                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 p-4 rounded-xl">
                                  <AlertTriangle size={18} className="text-primary" />
                                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                                    Specialist: {c.ai_response.specialist}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <PlusCircle size={14} />
                                Doctor's Notes
                              </h4>
                              <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="w-full bg-background border border-border rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary min-h-[120px]"
                                placeholder="Add clinical notes or follow-up instructions..."
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleAddNote(c._id)}
                                  disabled={savingNote || !noteText.trim()}
                                  className="px-6 py-3 bg-primary hover:bg-blue-600 disabled:bg-border text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2"
                                >
                                  {savingNote ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                  {c.doctor_note ? 'Update Note' : 'Save Note'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RefreshCcw = ({ size, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);

export default DoctorDashboard;
