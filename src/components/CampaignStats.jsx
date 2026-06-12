import { IoCheckmarkCircle, IoCloseCircle, IoEye, IoHandRight } from 'react-icons/io5';

/**
 * CampaignStats Component
 * Displays live campaign delivery statistics with animated progress bars.
 * Designed to be polled every 3 seconds to show real-time updates.
 *
 * Props:
 * - stats ({ sent, delivered, failed, opened, clicked }) — campaign stat counters
 * - audienceSize (Number) — total messages sent
 * - status (String) — campaign status (draft/sending/completed)
 */
export default function CampaignStats({ stats, audienceSize, status }) {
  if (!stats) return null;

  const { sent = 0, delivered = 0, failed = 0, opened = 0, clicked = 0, converted = 0, revenue = 0 } = stats;

  // Calculate percentages
  const pctDelivered = sent > 0 ? ((delivered / sent) * 100).toFixed(1) : 0;
  const pctFailed = sent > 0 ? ((failed / sent) * 100).toFixed(1) : 0;
  const pctOpened = delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : 0;
  const pctClicked = opened > 0 ? ((clicked / opened) * 100).toFixed(1) : 0;
  const pctConverted = clicked > 0 ? ((converted / clicked) * 100).toFixed(1) : 0;

  const statBars = [
    {
      label: 'Delivered',
      count: delivered,
      pct: pctDelivered,
      total: sent,
      color: 'from-emerald-500 to-emerald-400',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-500',
      icon: <IoCheckmarkCircle className="w-4 h-4" />,
    },
    {
      label: 'Failed',
      count: failed,
      pct: pctFailed,
      total: sent,
      color: 'from-red-500 to-red-400',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      icon: <IoCloseCircle className="w-4 h-4" />,
    },
    {
      label: 'Opened',
      count: opened,
      pct: pctOpened,
      total: delivered,
      color: 'from-blue-500 to-blue-400',
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      icon: <IoEye className="w-4 h-4" />,
    },
    {
      label: 'Clicked',
      count: clicked,
      pct: pctClicked,
      total: opened,
      color: 'from-brand-600 to-brand-400',
      bg: 'bg-brand-500/10',
      text: 'text-brand-500',
      icon: <IoHandRight className="w-4 h-4" />,
    },
    {
      label: 'Conversions',
      count: converted,
      pct: pctConverted,
      total: clicked,
      color: 'from-[#FF6B6B] to-[#FFA69E]',
      bg: 'bg-accent-200/20',
      text: 'text-[#FF6B6B]',
      icon: <span className="text-sm">🛒</span>,
    },
  ];

  // Status badge config
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-500/20 text-gray-500' },
    sending: { label: 'Sending...', color: 'bg-amber-500/20 text-amber-600 animate-pulse' },
    completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-600' },
  };

  const statusBadge = statusConfig[status] || statusConfig.draft;

  return (
    <div id="campaign-stats">
      {/* Header row with sent count and status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-slate-800">{sent}</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">messages sent</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
          {status === 'sending' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          )}
          {statusBadge.label}
        </span>
      </div>

      {/* Stat Bars */}
      <div className="space-y-4">
        {statBars.map((stat) => (
          <div key={stat.label}>
            {/* Label row */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={stat.text}>{stat.icon}</span>
                <span className="text-xs text-slate-500 font-semibold">{stat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-800">{stat.count}</span>
                <span className="text-xs text-slate-400 font-medium">
                  ({stat.pct}% of {stat.total})
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${stat.color} stat-bar-fill`}
                style={{ width: `${Math.min(100, stat.pct)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Generated */}
      {revenue > 0 && (
        <div className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between animate-fade-in shadow-sm">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Revenue Generated</span>
          <span className="text-lg font-black text-emerald-600">₹{revenue.toLocaleString('en-IN')}</span>
        </div>
      )}

      {/* Live indicator for sending campaigns */}
      {status === 'sending' && (
        <div className="mt-4 flex items-center gap-2 text-xs text-amber-500 font-medium">
          <div className="flex gap-1">
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-amber-500" />
          </div>
          <span>Stats updating live...</span>
        </div>
      )}
    </div>
  );
}
