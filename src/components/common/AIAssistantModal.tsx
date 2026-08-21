import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User as UserIcon, HelpCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { answerCampusQuery, answerCampusQueryAsync } from '../../services/aiService';
import { useNavigate } from 'react-router-dom';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    route: string;
  };
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, initialQuery }) => {
  const { complaints } = useComplaints();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am SmartFix AI, your campus issue and operational assistant. You can ask me about active Wi-Fi maintenance, library study zones, cafeteria services, reporting broken amenities, or finding lost items.',
      timestamp: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSend(initialQuery);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputQuery.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const reply = await answerCampusQueryAsync(text, complaints);
      let action: { label: string; route: string } | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('report') || lower.includes('broken') || lower.includes('complaint') || lower.includes('fix')) {
        action = { label: 'Go to Report Issue Form', route: '/student/report' };
      } else if (lower.includes('lost') || lower.includes('found')) {
        action = { label: 'Open Lost & Found Portal', route: '/student/lost-found' };
      } else if (lower.includes('wifi') || lower.includes('ticket') || lower.includes('status')) {
        action = { label: 'View All Campus Complaints', route: '/student/complaints' };
      }

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const reply = answerCampusQuery(text, complaints);
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts = [
    'Is the Wi-Fi in Hostel Block C being repaired?',
    'How do I report a flickering projector in Turing Hall?',
    'Someone left a laptop charger in the library',
    'What are the cafeteria meal hours?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-theme-subtle bg-surface shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme-subtle bg-surface-elevated">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-theme-primary">SmartFix AI Assistant</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Online
                </span>
              </div>
              <p className="text-xs text-theme-muted">Autonomous campus queries, routing & maintenance guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-brand-primary text-white'
                    : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed text-left ${
                    msg.sender === 'user'
                      ? 'bg-brand-primary text-white rounded-tr-sm'
                      : 'bg-surface-elevated text-theme-primary border border-theme-subtle rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.suggestedAction && (
                    <div className="mt-3 pt-2.5 border-t border-theme-subtle">
                      <button
                        onClick={() => {
                          onClose();
                          navigate(msg.suggestedAction!.route);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-semibold transition-colors"
                      >
                        {msg.suggestedAction.label}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-theme-muted mt-1 block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-3 rounded-2xl bg-surface-elevated border border-theme-subtle flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse delay-200" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 border-t border-theme-subtle bg-surface-elevated/50 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-theme-muted shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Suggestions:
          </span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs px-2.5 py-1 rounded-full bg-surface border border-theme-subtle text-theme-secondary hover:text-theme-primary hover:border-theme-strong whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-theme-subtle bg-surface flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask SmartFix AI anything about campus issues, locations, or status..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-theme-subtle bg-surface-elevated text-xs text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="p-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white disabled:opacity-40 transition-colors shrink-0 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
