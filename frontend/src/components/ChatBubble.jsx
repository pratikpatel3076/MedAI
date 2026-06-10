import React from 'react';
import { User, Bot } from 'lucide-react';
import TriageBadge from './TriageBadge';

const ChatBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'
        }`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        
        <div className={`p-4 rounded-2xl ${
          isUser 
            ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
            : 'bg-card border border-border text-gray-200 rounded-tl-none'
        }`}>
          {!isUser && message.triage_level && (
            <div className="mb-2">
              <TriageBadge level={message.triage_level} />
            </div>
          )}
          
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {!isUser && message.specialist && (
            <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recommended Specialist:</span>
              <span className="text-xs font-semibold text-primary">{message.specialist}</span>
            </div>
          )}

          {!isUser && message.disclaimer && (
            <p className="mt-3 text-[10px] text-gray-500 italic">
              {message.disclaimer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
