import { useState } from 'react';
import { IoSend, IoSparkles } from 'react-icons/io5';

/**
 * ChatInput Component
 * A sleek chat-style input bar at the bottom of the screen.
 * The marketer types natural language campaign descriptions here.
 *
 * Props:
 * - onSubmit(prompt: string) — called when the user sends a message
 * - isLoading (bool) — disables input while AI is processing
 */
export default function ChatInput({ onSubmit, isLoading }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim());
    setPrompt('');
  };

  // Submit on Enter (but allow Shift+Enter for newlines)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative" id="chat-input-form">
      {/* Light card container */}
      <div className="bg-white rounded-2xl p-1.5 shadow-md shadow-slate-100 border border-slate-200 
                      transition-all duration-300 focus-within:shadow-md focus-within:shadow-slate-200/50 focus-within:border-brand-300">
        <div className="flex items-end gap-2">
          {/* AI sparkle icon */}
          <div className="flex-shrink-0 p-3 pb-3.5">
            <IoSparkles className="w-5 h-5 text-[#FF6B6B] animate-pulse-slow" />
          </div>

          {/* Textarea input */}
          <textarea
            id="campaign-prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your campaign in plain English..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-sm 
                       resize-none py-3 pr-2 focus:outline-none disabled:opacity-50
                       min-h-[44px] max-h-[120px] leading-relaxed"
            style={{ overflow: 'auto' }}
          />

          {/* Send button */}
          <button
            type="submit"
            id="send-prompt-btn"
            disabled={!prompt.trim() || isLoading}
            className="flex-shrink-0 p-3 m-0.5 rounded-xl 
                       bg-gradient-to-r from-brand-500 to-[#FF6B6B] 
                       text-white transition-all duration-200
                       hover:from-brand-600 hover:to-[#E04E4E] hover:shadow-lg hover:shadow-[#FF6B6B]/25
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none
                       active:scale-95"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <IoSend className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Helper text */}
      <p className="hidden sm:block text-xs text-slate-400 mt-2 ml-2">
        Try: "Find customers in Mumbai who spent over ₹5000 and send them a Diwali offer on WhatsApp"
      </p>
    </form>
  );
}
