import React, { useState } from 'react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  initialCode,
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello! I am your **Gemini CS Tutor & AI Assistant**. How can I help you today? You can ask about Data Structures, Operating Systems, C++ pointers, or paste a snippet to debug!`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && !initialCode) return;

    const userQuery = prompt.trim() || 'Please analyze and explain this code.';
    const newMsgs: ChatMessage[] = [
      ...messages,
      { sender: 'user', text: userQuery },
    ];
    setMessages(newMsgs);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/code-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userQuery,
          context: initialCode,
        }),
      });

      const data = await res.json();
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: data.text || 'Received empty response from AI model.',
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: `Error connecting to AI Tutor: ${err?.message || 'Network error'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-slate-200 rounded-3xl max-w-2xl w-full h-[600px] flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm">
              🤖
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Gemini CS AI Tutor & Code Assistant
              </h3>
              <p className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
                Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Initial Code Preview if present */}
        {initialCode && (
          <div className="p-3 bg-slate-100 border-b border-slate-200 text-xs font-mono text-slate-700 line-clamp-2 px-4 font-bold">
            <span className="text-indigo-600 font-extrabold uppercase text-[10px] mr-2">[Code Context Attached]:</span>
            {initialCode}
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs font-medium">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl shadow-2xs font-sans ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white font-bold rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs leading-relaxed font-medium'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-indigo-600 font-extrabold p-3 rounded-2xl text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>AI Tutor is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question about algorithms, debugging, or C++..."
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md border-b-4 border-amber-600 active:border-b-0 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
