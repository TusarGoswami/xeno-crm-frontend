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
        <div className="mb-4 p-3 rounded-xl bg-brand-500/5 border border-brand-500/10">
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-brand-500">AI Insight: </span>
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
                         bg-[#F7FAFC] border border-slate-200 text-xs shadow-sm"
            >
              <span className="text-brand-500">{filter.icon}</span>
              <span className="text-slate-500 font-semibold">{filter.label}:</span>
              <span className="text-slate-800 font-extrabold">{filter.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Customer Count Badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl 
                        bg-emerald-50/70 border border-emerald-200/50 shadow-sm">
          <span className="text-2xl font-black text-emerald-600">{count}</span>
          <span className="text-sm text-emerald-800 font-bold">
            customer{count !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Customer Preview Table */}
      {customers && customers.length > 0 && (
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto custom-scrollbar max-h-[280px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-500/5 text-brand-800 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left px-4 py-3 font-bold">Name</th>
                  <th className="text-left px-4 py-3 font-bold">City</th>
                  <th className="text-right px-4 py-3 font-bold">Spend</th>
                  <th className="text-right px-4 py-3 font-bold">Orders</th>
                  <th className="text-left px-4 py-3 font-bold">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.slice(0, 20).map((customer, i) => (
                  <tr
                    key={customer._id || i}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-slate-800 font-bold">
                      {customer.name}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-medium">
                      {customer.city}
                    </td>
                    <td className="px-4 py-2.5 text-right text-emerald-600 font-extrabold">
                      ₹{customer.totalSpend?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-700 font-semibold">
                      {customer.totalOrders}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold
                        ${customer.channel === 'whatsapp' ? 'bg-green-500/15 text-green-500' :
                          customer.channel === 'sms' ? 'bg-blue-500/15 text-blue-500' :
                          customer.channel === 'email' ? 'bg-brand-500/15 text-brand-500' :
                          'bg-orange-500/15 text-orange-600'}`}
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
            <div className="px-4 py-2 text-xs text-slate-500 bg-slate-50 text-center border-t border-slate-100 font-semibold">
              Showing 20 of {count} customers
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {count === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-lg font-bold mb-1">No customers match these filters</p>
          <p className="text-sm font-semibold">Try adjusting your campaign description</p>
        </div>
      )}
    </div>
  );
}
