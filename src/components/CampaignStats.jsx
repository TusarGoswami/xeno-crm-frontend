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

  const { sent = 0, delivered = 0, failed = 0, opened = 0, clicked = 0 } = stats;

  // Calculate percentages relative to sent count
  const pctDelivered = sent > 0 ? ((delivered / sent) * 100).toFixed(1) : 0;
  const pctFailed = sent > 0 ? ((failed / sent) * 100).toFixed(1) : 0;
  const pctOpened = delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : 0;
  const pctClicked = opened > 0 ? ((clicked / opened) * 100).toFixed(1) : 0;

  const statBars = [
    {
      label: 'Delivered',
      count: delivered,
      pct: pctDelivered,
      total: sent,
      color: 'from-emerald-500 to-emerald-400',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
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
      text: 'text-blue-400',
      icon: <IoEye className="w-4 h-4" />,
    },
    {
      label: 'Clicked',
      count: clicked,
      pct: pctClicked,
      total: opened,
      color: 'from-purple-500 to-purple-400',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      icon: <IoHandRight className="w-4 h-4" />,
    },
  ];

  // Status badge config
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-500/20 text-gray-400' },
    sending: { label: 'Sending...', color: 'bg-amber-500/20 text-amber-400' },
    completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400' },
  };

  const statusBadge = statusConfig[status] || statusConfig.draft;

  return (
    <div id="campaign-stats">
      {/* Header row with sent count and status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">{sent}</span>
          <span className="text-sm text-gray-400">messages sent</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
          {status === 'sending' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          )}
          {statusBadge.label}
        </span>
      </div>

      {/* Stat Bars */}
      <div className="space-y-3">
        {statBars.map((stat) => (
          <div key={stat.label}>
            {/* Label row */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={stat.text}>{stat.icon}</span>
                <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{stat.count}</span>
                <span className="text-xs text-gray-500">
                  ({stat.pct}% of {stat.total})
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-surface-700/50 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${stat.color} stat-bar-fill`}
                style={{ width: `${Math.min(100, stat.pct)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Live indicator for sending campaigns */}
      {status === 'sending' && (
        <div className="mt-4 flex items-center gap-2 text-xs text-amber-400/70">
          <div className="flex gap-1">
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="typing-dot w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          <span>Stats updating live...</span>
        </div>
      )}
    </div>
  );
}
