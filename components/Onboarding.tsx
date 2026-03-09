import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Region, Diet, InjuryType } from '../types';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  options?: string[];
  field?: keyof UserProfile;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Namaste! I'm DayOne AI. Let's build your wellness plan. What should I call you?", sender: 'bot', field: 'name' }
  ]);
  const [inputText, setInputText] = useState('');
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    age: 25, // Default
    gender: 'Male', // Default
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Process input and determine next step
    processInput(text);
  };

  const processInput = (text: string) => {
    const lastBotMessage = [...messages].reverse().find(m => m.sender === 'bot');
    const field = lastBotMessage?.field;

    let updatedProfile = { ...profile };

    if (field === 'name') {
      updatedProfile.name = text;
      setProfile(updatedProfile);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Great to meet you, ${text}. To customize your meals, which region of India are you from?`,
          sender: 'bot',
          options: Object.values(Region),
          field: 'region'
        }]);
      }, 800);
    } else if (field === 'region') {
      updatedProfile.region = text as Region;
      setProfile(updatedProfile);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "Understood. Regional flavor is key! Now, what are your dietary preferences?",
          sender: 'bot',
          options: Object.values(Diet),
          field: 'diet'
        }]);
      }, 800);
    } else if (field === 'diet') {
      updatedProfile.diet = text as Diet;
      setProfile(updatedProfile);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "Got it. Finally, are you recovering from any specific injury?",
          sender: 'bot',
          options: Object.values(InjuryType),
          field: 'injury'
        }]);
      }, 800);
    } else if (field === 'injury') {
      updatedProfile.injury = text as InjuryType;
      updatedProfile.isOnboarded = true;
      setProfile(updatedProfile);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: "Perfect. Initializing your dashboard...",
          sender: 'bot'
        }]);
        // Finish onboarding
        setTimeout(() => {
           onComplete(updatedProfile as UserProfile);
        }, 1500);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-brand-bg relative overflow-hidden w-full max-w-lg mx-auto">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-orange rounded-full filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-red rounded-full filter blur-[100px] opacity-20"></div>

      {/* Header */}
      <div className="p-6 pt-12 text-center z-10">
        <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-brand-orange animate-pulse" />
            <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">DayOne</h1>
        </div>
        <p className="text-brand-muted text-sm">Wellness Starts Today</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-md border ${
              msg.sender === 'user' 
                ? 'bg-brand-orange/20 border-brand-orange/30 text-white rounded-br-none' 
                : 'bg-brand-surface border-slate-700 text-slate-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-brand-bg/80 backdrop-blur-xl border-t border-slate-800 absolute bottom-0 w-full z-20">
        {/* Quick Options */}
        {messages[messages.length - 1]?.sender === 'bot' && messages[messages.length - 1]?.options && (
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {messages[messages.length - 1].options!.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSend(opt)}
                className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-brand-orange/20 border border-slate-700 hover:border-brand-orange text-sm rounded-full transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputText)}
            placeholder="Type your answer..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-6 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors"
          />
          <button 
            onClick={() => handleSend(inputText)}
            className="bg-gradient-to-r from-brand-orange to-brand-red p-3 rounded-full text-white shadow-lg shadow-orange-500/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
