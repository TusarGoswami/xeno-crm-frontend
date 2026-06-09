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
      {/* Glassmorphism container */}
      <div className="glass rounded-2xl p-1.5 shadow-lg shadow-brand-500/5 border border-white/10 
                      transition-all duration-300 focus-within:shadow-brand-500/20 focus-within:border-brand-400/30">
        <div className="flex items-end gap-2">
          {/* AI sparkle icon */}
          <div className="flex-shrink-0 p-3 pb-3.5">
            <IoSparkles className="w-5 h-5 text-brand-400 animate-pulse-slow" />
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
            className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm 
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
                       bg-gradient-to-r from-brand-500 to-brand-600 
                       text-white transition-all duration-200
                       hover:from-brand-400 hover:to-brand-500 hover:shadow-lg hover:shadow-brand-500/25
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
      <p className="text-xs text-gray-600 mt-2 ml-2">
        Try: "Find customers in Mumbai who spent over ₹5000 and send them a Diwali offer on WhatsApp"
      </p>
    </form>
  );
}
