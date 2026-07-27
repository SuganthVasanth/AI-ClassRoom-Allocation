import React, { useState, useRef, useEffect } from 'react';
import { AI_PROMPTS } from '../constants/mockData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';
import { Sparkles, Send, Bot, User, Trash2, ArrowUpRight, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

interface AIScreenProps {
  onAutoDraftRequest?: (buildingId: string, strength: number, subject: string) => void;
}

export const AIScreen: React.FC<AIScreenProps> = ({ onAutoDraftRequest }) => {
  const { showToast } = useToast();

  const [messages, setMessages] = useState<any[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: "Hello! I'm your BIT SmartCampus AI Assistant. 🤖\nI can analyze live timetable grids, predict vacant blocks, and resolve scheduling clashes. How can I help you today?\n\nTry asking me:\n• *Show vacant rooms on 2026-07-20 from 09:00 to 10:00*\n• *Recommend classroom for Class with 50 students on 2026-07-20*",
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<string[]>([
    'Find empty room on 2026-07-20 at 09:00',
    'Recommend room for 60 students on 2026-07-20',
    'Resolve Monday clash'
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const parseMessageForAPI = async (text: string): Promise<string | null> => {
    const textLower = text.toLowerCase();
    
    // 1. Detect Room Availability Search
    if (textLower.includes('vacant') || textLower.includes('available') || textLower.includes('empty') || textLower.includes('free') || textLower.includes('lookup')) {
      const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : '2026-07-20';
      
      const timeMatches = text.match(/\b\d{1,2}:\d{2}\b/g);
      const startTime = timeMatches && timeMatches[0] ? timeMatches[0].padStart(5, '0') : '09:00';
      const endTime = timeMatches && timeMatches[1] ? timeMatches[1].padStart(5, '0') : '10:00';
      
      try {
        const res = await api.checkRoomAvailability(date, startTime, endTime);
        if (res && res.rooms && res.rooms.length > 0) {
          const roomList = res.rooms.slice(0, 5).map((r: any) => `• **${r.venue_name}** (${r.block}, Floor ${r.floor}, Cap: ${r.capacity} pax)`).join('\n');
          return `🔍 **Room Availability Check** on **${date}** (${startTime} - ${endTime}):\n\nI found **${res.available_rooms_count}** vacant rooms. Here are the top suggestions:\n\n${roomList}\n\nWould you like me to book a slot for your lecture?`;
        } else {
          return `🔍 **Room Availability Check** on **${date}** (${startTime} - ${endTime}):\n\nUnfortunately, there are no classrooms vacant during this slot. All rooms are currently occupied or undergoing maintenance.`;
        }
      } catch (err: any) {
        return `❌ Error querying room availability: ${err.message || err}`;
      }
    }
    
    // 2. Detect Recommendation Request
    if (textLower.includes('recommend') || textLower.includes('suggest') || textLower.includes('allocate') || textLower.includes('book')) {
      const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : '2026-07-20';
      
      const timeMatches = text.match(/\b\d{1,2}:\d{2}\b/g);
      const startTime = timeMatches && timeMatches[0] ? timeMatches[0].padStart(5, '0') : '09:00';
      const endTime = timeMatches && timeMatches[1] ? timeMatches[1].padStart(5, '0') : '10:00';
      
      const strengthMatch = text.match(/\b\d{2,3}\b/);
      const strength = strengthMatch ? parseInt(strengthMatch[0]) : 45;
      
      let parsedPurpose = 'Class';
      if (textLower.includes('lab')) parsedPurpose = 'Lab';
      else if (textLower.includes('exam')) parsedPurpose = 'Exam';
      else if (textLower.includes('seminar')) parsedPurpose = 'Seminar';
      else if (textLower.includes('workshop')) parsedPurpose = 'Workshop';
      
      try {
        const payload = {
          purpose: parsedPurpose,
          student_count: strength,
          date,
          start_time: startTime,
          end_time: endTime,
          department: 'CSE',
          faculty_id: 'FAC5001',
          strict_dept: false
        };
        
        const res = await api.recommendRoom(payload);
        if (res && res.allocated_room) {
          const optimal = res.allocated_room;
          const alternatives = (res.top_5_recommendations || []).map((r: any) => r[0]).join(', ');
          return `🤖 **AI Classroom Recommendation Engine**:\n\nFor your **${parsedPurpose}** request for **${strength} students** on **${date}** (${startTime} - ${endTime}):\n\n• **Allocated Room**: **${optimal.venue_name}** (${optimal.block}, Capacity: ${optimal.capacity} pax)\n• **Walking Distance**: ${res.distance_from_prev} meters\n• **Optimization Score Cost**: ${res.cost.toFixed(4)}\n\n*ML Model Alternative Rankings*: ${alternatives}\n\nWould you like to draft a booking hold for this optimal room?`;
        } else {
          return `🤖 **AI Classroom Recommendation Engine**:\n\nNo rooms passed rule validation filters for date ${date} between ${startTime} - ${endTime} for ${strength} students. Please try a different slot.`;
        }
      } catch (err: any) {
        return `❌ Error running room recommendation: ${err.message || err}`;
      }
    }
    
    return null;
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. Try parsing message for real API queries
      const apiResponse = await parseMessageForAPI(text);
      
      let responseText = apiResponse;
      let actions = ['Book a Room'];

      if (!responseText) {
        // 2. Fallback to mock preset prompts
        const matched = AI_PROMPTS.find(
          (p) => text.toLowerCase().includes(p.prompt.toLowerCase().substring(0, 15))
        );
        responseText = matched 
          ? matched.response 
          : `🤖 I've analyzed the live schedules for your request: "${text}". \n\nI recommend utilizing **ARY-101** or **RAM-201** which are vacant during normal lecture blocks. Would you like me to book a slot?`;
        actions = matched?.actions || ['Book a Room'];
      } else {
        actions = ['Draft Request (AI)'];
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        actions: actions,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: `🤖 Sorry, I encountered an error running that lookup: ${err.message || err}`,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      
      // Append to local history if unique
      if (!chatHistory.includes(text)) {
        setChatHistory(prev => [text, ...prev.slice(0, 4)]);
      }
    }
  };

  const handleActionClick = (action: string) => {
    showToast(`AI Action Triggered: ${action}`, 'info');
    if (action.includes('Draft Request') && onAutoDraftRequest) {
      // Autofill booking
      onAutoDraftRequest('bld-1', 60, 'AI Auto Allocated Class');
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'm1',
        role: 'assistant',
        content: "Hello! Chat cleared. How can I assist you with classroom allocations today?",
        timestamp: 'Just now'
      }
    ]);
    showToast('Chat history cleared.', 'info');
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" /> AI Assistant
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Converse with the smart allocation bot to book rooms, check occupancy, and analyze timetables.
          </p>
        </div>
        <Button variant="outline" size="sm" icon={<Trash2 className="w-4 h-4 text-rose-500" />} onClick={clearChat}>
          Clear Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch flex-1 min-h-0">
        
        {/* Chat History Panel */}
        <Card className="col-span-1 hidden lg:flex flex-col gap-4" header={<h3 className="text-sm font-bold text-slate-705 dark:text-slate-350">Recent Topics</h3>}>
          <div className="flex flex-col gap-2">
            {chatHistory.map((hist, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(hist)}
                className="w-full text-left p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-655 dark:text-slate-400 truncate flex items-center gap-2 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>{hist}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Core Chat Box */}
        <Card padding="none" className="lg:col-span-3 flex flex-col justify-between bg-white dark:bg-slate-900 h-full border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          
          {/* Scrollable messages area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 min-h-0">
            {messages.map((msg) => {
              const isAi = msg.role === 'assistant';
              return (
                <div key={msg.id} className={`flex items-start gap-4 ${isAi ? 'justify-start' : 'justify-end'}`}>
                  
                  {isAi && (
                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 border border-primary/20">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 max-w-[80%]">
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed
                      ${isAi 
                        ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-205 rounded-tl-sm border border-slate-100 dark:border-slate-800' 
                        : 'bg-primary text-white rounded-tr-sm'
                      }
                    `}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                      
                      {/* Action buttons inside bot responses */}
                      {isAi && msg.actions && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                          {msg.actions.map((act: string) => (
                            <button
                              key={act}
                              onClick={() => handleActionClick(act)}
                              className="px-3 py-1 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-[10px] font-bold text-primary rounded-lg border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1"
                            >
                              <span>{act}</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] text-slate-400 font-semibold px-1 ${!isAi ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAi && (
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                  )}

                </div>
              );
            })}

            {/* Simulated typing dot animation */}
            {isTyping && (
              <div className="flex items-start gap-4 justify-start">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 border border-primary/20">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl rounded-tl-sm flex items-center gap-1.5 border border-slate-100 dark:border-slate-800">
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-550 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-550 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 dark:bg-slate-550 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendation prompts overlay */}
          {messages.length === 1 && (
            <div className="px-6 py-2 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 select-none">Suggested prompts</span>
              <div className="flex flex-wrap gap-2">
                {AI_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.prompt)}
                    className="px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-150 dark:border-slate-800 text-[11px] font-semibold text-slate-655 dark:text-slate-350 rounded-xl transition-all select-none text-left"
                  >
                    {p.prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message input footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Query live schedules, find vacant labs..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-200 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Button
              onClick={() => handleSend(inputValue)}
              variant="primary"
              className="px-3 py-2.5"
              icon={<Send className="w-4.5 h-4.5" />}
            >
              Send
            </Button>
          </div>

        </Card>
      </div>

    </div>
  );
};
