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
    whatsapp: { label: 'WhatsApp', color: 'text-green-600', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    sms: { label: 'SMS', color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    email: { label: 'Email', color: 'text-brand-600', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
    rcs: { label: 'RCS', color: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  };

  const config = channelConfig[channel] || channelConfig.whatsapp;

  return (
    <div className="animate-slide-up" id="message-draft-editor">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IoSparkles className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-slate-800">AI-Drafted Message</h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${config.bg} ${config.color} ${config.border} border`}>
            {config.label}
          </span>
        </div>

        {/* Edit toggle button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
                     bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 border border-slate-200
                     transition-all duration-200 shadow-sm active:scale-95"
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
          ? 'border-brand-400/40 shadow-md shadow-brand-500/5' 
          : 'border-slate-200'
      }`}>
        {isEditing ? (
          <textarea
            id="message-draft-textarea"
            value={message}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white text-slate-800 text-sm p-4 rounded-xl 
                       focus:outline-none resize-none leading-relaxed min-h-[120px] focus:ring-1 focus:ring-brand-400/30"
            rows={4}
            maxLength={charLimit}
          />
        ) : (
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            {/* Simulated chat bubble */}
            <div className="bg-[#D1E6EC]/30 text-slate-800 border border-brand-100/30 rounded-2xl rounded-bl-md p-4 max-w-[85%]">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Character count */}
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-slate-500 font-medium">
          💡 Use <code className="text-brand-600 font-bold">{'{{name}}'}</code> to personalize with customer name
        </p>
        <span className={`text-xs font-bold ${
          message.length > charLimit ? 'text-red-500' : 'text-slate-500'
        }`}>
          {message.length}/{charLimit}
        </span>
      </div>
    </div>
  );
}
