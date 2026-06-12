import { useState } from 'react';
import { IoPencil, IoCheckmark, IoSparkles } from 'react-icons/io5';

/**
 * MessageDraftEditor Component
 * Displays the AI-drafted message in an editable textarea.
 * The marketer can review and tweak the message before launching.
 *
 * Props:
 * - message (string) — the AI-suggested message template
 * - onChange(newMessage: string) — called when the user edits the message
 * - channel (string) — the target channel (whatsapp/sms/email)
 */
export default function MessageDraftEditor({ message, onChange, channel }) {
  const [isEditing, setIsEditing] = useState(false);
  const charLimit = channel === 'sms' ? 160 : 500;

  const channelConfig = {
    whatsapp: { label: 'WhatsApp', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    sms: { label: 'SMS', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    email: { label: 'Email', color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
  };

  const config = channelConfig[channel] || channelConfig.whatsapp;

  return (
    <div className="animate-slide-up" id="message-draft-editor">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IoSparkles className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-semibold text-white">AI-Drafted Message</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
            {config.label}
          </span>
        </div>

        {/* Edit toggle button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                     bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white
                     transition-all duration-200"
          id="toggle-edit-message-btn"
        >
          {isEditing ? (
            <>
              <IoCheckmark className="w-3.5 h-3.5" />
              Done
            </>
          ) : (
            <>
              <IoPencil className="w-3.5 h-3.5" />
              Edit
            </>
          )}
        </button>
      </div>

      {/* Message display / editor */}
      <div className={`rounded-xl border transition-all duration-300 ${
        isEditing 
          ? 'border-brand-400/40 shadow-lg shadow-brand-500/10' 
          : 'border-white/5'
      }`}>
        {isEditing ? (
          <textarea
            id="message-draft-textarea"
            value={message}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-surface-800/50 text-white text-sm p-4 rounded-xl 
                       focus:outline-none resize-none leading-relaxed min-h-[120px]"
            rows={4}
            maxLength={charLimit}
          />
        ) : (
          <div className="p-4 bg-surface-800/30 rounded-xl">
            {/* Simulated chat bubble */}
            <div className="bg-surface-700/50 rounded-2xl rounded-bl-md p-4 max-w-[85%]">
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                {message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Character count */}
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-gray-600">
          💡 Use <code className="text-brand-400/70">{'{{name}}'}</code> to personalize with customer name
        </p>
        <span className={`text-xs ${
          message.length > charLimit ? 'text-red-400' : 'text-gray-600'
        }`}>
          {message.length}/{charLimit}
        </span>
      </div>
    </div>
  );
}
