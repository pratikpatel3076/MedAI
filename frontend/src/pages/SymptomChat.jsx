import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, RefreshCcw, AlertTriangle, Mic, MicOff, Globe } from 'lucide-react';
import api from '../api/axios';
import ChatBubble from '../components/ChatBubble';
import EmergencyBanner from '../components/EmergencyBanner';
import ECGBackground from '../components/ECGBackground';
import BodyMap from '../components/BodyMap';
import { TriageMeter } from '../components/TriageBadge';

const SymptomChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hello! I'm your AI Medical Assistant. Please describe your symptoms in as much detail as possible (e.g., 'I have a sharp pain in my chest that started an hour ago').\n\nHow can I help you today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [language, setLanguage] = useState('english');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input not supported in this browser. Try Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      const langMap = {
        english: 'en-IN',
        telugu: 'te-IN',
        hindi: 'hi-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-IN';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.post('/symptoms/analyze', {
        message: userMessage,
        chat_history: chatHistory,
        language: language
      });

      const aiResponse = res.data;

      if (aiResponse.is_emergency) {
        setShowEmergency(true);
      }

      setMessages(prev => [...prev, {
        role: 'bot',
        content: aiResponse.reply,
        triage_level: aiResponse.triage_level,
        specialist: aiResponse.specialist,
        disclaimer: aiResponse.disclaimer
      }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: "I'm sorry, I'm having trouble connecting to my brain. Please try again or seek medical help if you're concerned.",
        triage_level: 'URGENT'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'bot',
      content: "Chat reset. How can I help you today?",
    }]);
    setShowEmergency(false);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4 md:p-6">
      {showEmergency && <EmergencyBanner onDismiss={() => setShowEmergency(false)} />}
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Symptom Analysis
            <div className="w-2 h-2 bg-success rounded-full animate-ping" />
          </h2>
          <p className="text-gray-400 text-sm">Powered by Groq AI • Real-time Triage</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl">
            <Globe size={14} className="text-primary" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="english">English</option>
              <option value="telugu">తెలుగు (Telugu)</option>
              <option value="hindi">हिंदी (Hindi)</option>
            </select>
          </div>
          <button 
            onClick={resetChat}
            className="p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
          >
            <RefreshCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
        {/* Left Column: Body Map (Desktop Only) */}
        <div className="hidden md:flex flex-col w-1/3 bg-card border border-border rounded-3xl p-6 items-center justify-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">Click to select body region</p>
          <BodyMap onRegionClick={(symptom) => setInput(symptom)} />
        </div>

        {/* Right Column: Chat Interface */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          >
            {messages.map((m, i) => (
              <div key={i}>
                <ChatBubble message={m} />
                {m.role === 'bot' && m.triage_level && (
                  <div className="flex justify-start ml-14 mb-6">
                    <TriageMeter level={m.triage_level} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-6">
                <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-2xl rounded-tl-none">
                  <Loader2 className="animate-spin text-primary" size={20} />
                  <span className="text-gray-400 text-sm font-medium italic">Analyzing symptoms...</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="bg-warning/10 border border-warning/20 p-3 rounded-xl mb-4 flex items-center gap-3">
              <AlertTriangle className="text-warning flex-shrink-0" size={18} />
              <p className="text-[11px] text-warning font-medium leading-tight">
                AI can make mistakes. This chat is for informational purposes only. In case of emergency, call 112 immediately.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-2">
               <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                 {language}
               </span>
               {isListening && (
                 <span className="flex items-center gap-1.5 text-danger text-[10px] font-bold animate-pulse">
                   <div className="w-1.5 h-1.5 bg-danger rounded-full" />
                   Listening...
                 </span>
               )}
            </div>

            <form onSubmit={handleSend} className="relative group flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your symptoms (e.g. 'persistent headache and nausea')..."
                  className="w-full bg-card border border-border rounded-2xl py-5 px-6 pr-16 focus:outline-none focus:border-primary transition-all text-white placeholder:text-gray-600 shadow-xl"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={loading}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
                    isListening ? 'bg-danger text-white animate-pulse' : 'bg-border/50 text-gray-400 hover:text-white'
                  }`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`p-5 rounded-2xl transition-all flex items-center justify-center ${
                  input.trim() && !loading ? 'bg-primary text-white scale-100 shadow-lg shadow-primary/20' : 'bg-border text-gray-500 scale-95'
                }`}
              >
                <Send size={24} />
              </button>
            </form>
          </div>
        </div>
      </div>
      <ECGBackground />
    </div>
  );
};

export default SymptomChat;
