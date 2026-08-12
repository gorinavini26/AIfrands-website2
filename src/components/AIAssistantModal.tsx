import React, { useState, useEffect, useRef } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

function cleanMarkdownForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' Code block. ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/#+\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[-*]\s/g, '')
    .trim();
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
      text: `Hello! I am your **Gemini CS Tutor & AI Assistant**. How can I help you today? You can speak your question using the microphone button or type below!`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Voice Input (SpeechRecognition) State
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Voice Output (SpeechSynthesis) State
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('aifrands_ai_tutor_muted') === 'true';
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('aifrands_ai_tutor_muted', isMuted ? 'true' : 'false');
    if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
    }
  }, [isMuted]);

  // Clean up speech on unmount or close
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const speakMessage = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceNotice('Text-to-speech is not supported in this browser environment.');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    window.speechSynthesis.cancel();

    if (speakingIndex === index && isSpeaking) {
      setIsSpeaking(false);
      setSpeakingIndex(null);
      return;
    }

    const cleanText = cleanMarkdownForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingIndex(index);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingIndex(null);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Speech Recognition API is not supported in this browser.');
      setTimeout(() => setVoiceNotice(null), 3500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('🎤 Listening... speak your CS question clearly.');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setPrompt(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setVoiceNotice(`Microphone error: ${event.error || 'speech recognition failed'}`);
        setTimeout(() => setVoiceNotice(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceNotice(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setVoiceNotice(`Could not activate microphone: ${err?.message || 'Access denied'}`);
      setTimeout(() => setVoiceNotice(null), 3500);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && !initialCode) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

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
      const aiResponseText = data.text || 'Received empty response from AI model.';

      const updatedMsgs: ChatMessage[] = [
        ...newMsgs,
        {
          sender: 'ai',
          text: aiResponseText,
        },
      ];
      setMessages(updatedMsgs);

      // Speak response aloud if not muted
      if (!isMuted) {
        speakMessage(aiResponseText, updatedMsgs.length - 1);
      }
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full h-[620px] flex flex-col justify-between shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm">
              🤖
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Gemini CS AI Tutor & Code Assistant
              </h3>
              <p className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <span>Powered by Gemini 2.5 Flash</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300">Voice Enabled</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Text to Speech Mute / Unmute Toggle Button */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                isMuted
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  : 'bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30'
              }`}
              title={isMuted ? 'Unmute AI Tutor Voice Output' : 'Mute AI Tutor Voice Output'}
            >
              <span className="material-symbols-outlined text-lg">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
              <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice On'}</span>
            </button>

            {/* Stop Speech if currently speaking */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-xs font-extrabold animate-pulse flex items-center gap-1 cursor-pointer"
                title="Stop speaking current answer"
              >
                <span className="material-symbols-outlined text-sm">stop_circle</span>
                <span>Stop</span>
              </button>
            )}

            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                onClose();
              }}
              className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Initial Code Preview if present */}
        {initialCode && (
          <div className="p-3 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 line-clamp-2 px-4 font-bold flex items-center justify-between">
            <div className="line-clamp-1">
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold uppercase text-[10px] mr-2">
                [Code Context Attached]:
              </span>
              {initialCode}
            </div>
          </div>
        )}

        {/* Voice System Notice Banner */}
        {voiceNotice && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base animate-pulse">mic</span>
              <span>{voiceNotice}</span>
            </div>
            <button
              onClick={() => setVoiceNotice(null)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-900 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/60 text-xs font-medium">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-2xl shadow-2xs font-sans relative group/msg ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white font-bold rounded-br-xs'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs leading-relaxed font-medium'
                }`}
              >
                {m.sender === 'user' ? (
                  <p className="whitespace-pre-wrap">{m.text}</p>
                ) : (
                  <div className="space-y-2">
                    <MarkdownRenderer content={m.text} />
                    
                    {/* Read Aloud Button on AI Message */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[10px]">
                      <button
                        onClick={() => speakMessage(m.text, idx)}
                        className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                          speakingIndex === idx && isSpeaking
                            ? 'bg-amber-500 text-slate-950 font-extrabold'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {speakingIndex === idx && isSpeaking ? 'graphic_eq' : 'volume_up'}
                        </span>
                        <span>
                          {speakingIndex === idx && isSpeaking ? 'Speaking...' : 'Read Aloud'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold p-3 rounded-2xl text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
                <span>AI Tutor is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form with Microphone Button */}
        <form
          onSubmit={handleSend}
          className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          {/* Voice Input Mic Toggle Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-3 rounded-2xl transition-all flex items-center justify-center cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
            title={isListening ? 'Click to stop listening' : 'Click to speak your question'}
          >
            <span className="material-symbols-outlined text-lg">
              {isListening ? 'mic_off' : 'mic'}
            </span>
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isListening
                ? 'Listening... speak now...'
                : 'Ask a question about algorithms, debugging, or C++...'
            }
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-3d btn-3d-amber py-3 px-5 text-slate-950 font-extrabold text-xs disabled:opacity-50 flex items-center gap-1 cursor-pointer"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

