import { IoLocationSharp, IoWallet, IoCart, IoPerson } from 'react-icons/io5';

/**
 * SegmentPreview Component
 * Displays the AI-extracted segment filters and the list of matching customers.
 * Shows a summary of the filters applied and a scrollable customer preview table.
 *
 * Props:
 * - filters (Object) — the segmentFilters extracted by Gemini
 * - customers (Array) — matching customers from the segment preview query
 * - count (Number) — total number of matching customers
 * - reasoning (String) — AI's one-sentence explanation
 */
export default function SegmentPreview({ filters, customers, count, reasoning }) {
  // Build a human-readable list of active filters
  const activeFilters = [];
  if (filters?.minTotalSpend != null) activeFilters.push({ label: 'Min Spend', value: `₹${filters.minTotalSpend.toLocaleString()}`, icon: <IoWallet /> });
  if (filters?.maxTotalSpend != null) activeFilters.push({ label: 'Max Spend', value: `₹${filters.maxTotalSpend.toLocaleString()}`, icon: <IoWallet /> });
  if (filters?.minTotalOrders != null) activeFilters.push({ label: 'Min Orders', value: `${filters.minTotalOrders}+`, icon: <IoCart /> });
  if (filters?.daysSinceLastOrder != null) activeFilters.push({ label: 'Inactive', value: `${filters.daysSinceLastOrder}+ days`, icon: <IoPerson /> });
  if (filters?.city) activeFilters.push({ label: 'City', value: filters.city, icon: <IoLocationSharp /> });
  if (filters?.channel) activeFilters.push({ label: 'Channel', value: filters.channel, icon: <IoPerson /> });

  return (
    <div className="animate-slide-up" id="segment-preview">
      {/* AI Reasoning */}
      {reasoning && (
        <div className="mb-4 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <p className="text-sm text-brand-300 leading-relaxed">
            <span className="font-semibold text-brand-200">AI Insight: </span>
            {reasoning}
          </p>
        </div>
      )}

      {/* Active Filters Tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                         bg-surface-700/50 border border-white/5 text-xs"
            >
              <span className="text-brand-400">{filter.icon}</span>
              <span className="text-gray-400">{filter.label}:</span>
              <span className="text-white font-medium">{filter.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Customer Count Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl 
                        bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                        border border-emerald-500/30">
          <span className="text-2xl font-bold text-emerald-400">{count}</span>
          <span className="text-sm text-emerald-300/80">
            customer{count !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Customer Preview Table */}
      {customers && customers.length > 0 && (
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar max-h-[280px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-700/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">City</th>
                  <th className="text-right px-4 py-3 font-medium">Spend</th>
                  <th className="text-right px-4 py-3 font-medium">Orders</th>
                  <th className="text-left px-4 py-3 font-medium">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.slice(0, 20).map((customer, i) => (
                  <tr
                    key={customer._id || i}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-2.5 text-white font-medium">
                      {customer.name}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">
                      {customer.city}
                    </td>
                    <td className="px-4 py-2.5 text-right text-emerald-400 font-medium">
                      ₹{customer.totalSpend?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-gray-300">
                      {customer.totalOrders}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                        ${customer.channel === 'whatsapp' ? 'bg-green-500/15 text-green-400' :
                          customer.channel === 'sms' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-purple-500/15 text-purple-400'}`}
                      >
                        {customer.channel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Show overflow indicator */}
          {customers.length > 20 && (
            <div className="px-4 py-2 text-xs text-gray-500 bg-surface-700/30 text-center">
              Showing 20 of {count} customers
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {count === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-1">No customers match these filters</p>
          <p className="text-sm">Try adjusting your campaign description</p>
        </div>
      )}
    </div>
  );
}
