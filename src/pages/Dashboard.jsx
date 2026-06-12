import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  IoPeople, IoMegaphone, IoChatbubbles, IoWallet,
  IoTrendingUp, IoSparkles, IoArrowForward,
} from 'react-icons/io5';
import { SkeletonCard } from '../components/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Dashboard Page
 * Overview of key CRM metrics at a glance:
 * - Total customers, campaigns, revenue, avg spend
 * - City & channel distribution bars
 * - Recent campaigns list
 * - Quick action buttons
 */
export default function Dashboard() {
  const [customerStats, setCustomerStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [campaignStats, setCampaignStats] = useState({ total: 0, totalSent: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0, totalConverted: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, campaignsRes] = await Promise.all([
        axios.get(`${API_URL}/api/customers/stats`),
        axios.get(`${API_URL}/api/campaigns`),
      ]);

      setCustomerStats(statsRes.data.stats);

      const allCampaigns = campaignsRes.data.campaigns || [];
      setCampaigns(allCampaigns.slice(0, 5));

      // Aggregate campaign stats
      const aggStats = allCampaigns.reduce((acc, c) => ({
        total: acc.total + 1,
        totalSent: acc.totalSent + (c.stats?.sent || 0),
        totalDelivered: acc.totalDelivered + (c.stats?.delivered || 0),
        totalOpened: acc.totalOpened + (c.stats?.opened || 0),
        totalClicked: acc.totalClicked + (c.stats?.clicked || 0),
        totalConverted: acc.totalConverted + (c.stats?.converted || 0),
        totalRevenue: acc.totalRevenue + (c.stats?.revenue || 0),
      }), { total: 0, totalSent: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0, totalConverted: 0, totalRevenue: 0 });
      setCampaignStats(aggStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deliveryRate = campaignStats.totalSent > 0
    ? ((campaignStats.totalDelivered / campaignStats.totalSent) * 100).toFixed(1) : 0;
  const openRate = campaignStats.totalDelivered > 0
    ? ((campaignStats.totalOpened / campaignStats.totalDelivered) * 100).toFixed(1) : 0;
  const clickRate = campaignStats.totalOpened > 0
    ? ((campaignStats.totalClicked / campaignStats.totalOpened) * 100).toFixed(1) : 0;
  const conversionRate = campaignStats.totalSent > 0
    ? ((campaignStats.totalConverted / campaignStats.totalSent) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-surface-700/50 rounded-lg animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-surface-700/50 via-surface-700/80 to-surface-700/50" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Total Customers',
      value: customerStats?.totalCustomers || 0,
      icon: IoPeople,
      color: 'from-brand-500/10 to-brand-500/5',
      iconColor: 'text-brand-500',
      borderColor: 'border-slate-100 hover:border-brand-500/20',
    },
    {
      label: 'Campaigns Sent',
      value: campaignStats.total,
      icon: IoMegaphone,
      color: 'from-[#FF6B6B]/10 to-[#FF6B6B]/5',
      iconColor: 'text-[#FF6B6B]',
      borderColor: 'border-slate-100 hover:border-[#FF6B6B]/20',
    },
    {
      label: 'Campaign Revenue (ROI)',
      value: `₹${(campaignStats.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: IoWallet,
      color: 'from-emerald-500/10 to-emerald-500/5',
      iconColor: 'text-emerald-500',
      borderColor: 'border-slate-100 hover:border-emerald-500/20',
    },
    {
      label: 'Total Customer Value',
      value: `₹${(customerStats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: IoWallet,
      color: 'from-[#FF6B6B]/10 to-[#FF6B6B]/5',
      iconColor: 'text-[#FF6B6B]',
      borderColor: 'border-slate-100 hover:border-[#FF6B6B]/20',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your CRM performance</p>
        </div>
        <button
          onClick={() => navigate('/copilot')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     bg-gradient-to-r from-[#0F4C5C] to-[#FF6B6B] text-white
                     hover:shadow-[0_4px_15px_rgba(255,107,107,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          id="quick-new-campaign"
        >
          <IoSparkles className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`premium-card rounded-2xl p-5 border ${card.borderColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{card.label}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center border border-slate-100`}>
                  <Icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Rates */}
        <div className="premium-card rounded-2xl p-6 lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
            <IoTrendingUp className="w-4 h-4 text-[#FF6B6B]" />
            Campaign Performance
          </h3>
          <div className="space-y-5">
            {[
              { label: 'Delivery Rate', value: `${deliveryRate}%`, pct: deliveryRate, color: 'from-[#0F4C5C] to-[#1B5E73]' },
              { label: 'Open Rate', value: `${openRate}%`, pct: openRate, color: 'from-[#1B5E73] to-[#FF6B6B]' },
              { label: 'Click Rate', value: `${clickRate}%`, pct: clickRate, color: 'from-[#FF6B6B] to-[#FFA69E]' },
              { label: 'Conversion Rate', value: `${conversionRate}%`, pct: conversionRate, color: 'from-[#FF6B6B] to-amber-400' },
            ].map((rate) => (
              <div key={rate.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500 font-medium">{rate.label}</span>
                  <span className="text-sm font-extrabold text-slate-800">{rate.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${rate.color} animate-funnel`}
                    style={{ width: `${Math.min(100, rate.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="premium-card rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 mb-5">Audience Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* City Distribution */}
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-3 uppercase tracking-wider">By City</p>
              <div className="space-y-2">
                {(customerStats?.cityDistribution || []).map((item) => {
                  const pct = customerStats.totalCustomers > 0
                    ? ((item.count / customerStats.totalCustomers) * 100).toFixed(0) : 0;
                  return (
                    <div key={item.city} className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 w-20 truncate">{item.city}</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0F4C5C] to-[#1B5E73] animate-funnel"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-8 text-right font-medium">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Channel Distribution */}
            <div>
              <p className="text-xs text-slate-400 font-semibold mb-3 uppercase tracking-wider">By Channel</p>
              <div className="space-y-3">
                {(customerStats?.channelDistribution || []).map((item) => {
                  const pct = customerStats.totalCustomers > 0
                    ? ((item.count / customerStats.totalCustomers) * 100).toFixed(0) : 0;
                  const colorMap = {
                    whatsapp: 'from-green-500 to-green-400',
                    sms: 'from-blue-500 to-blue-400',
                    email: 'from-[#0F4C5C] to-[#FF6B6B]',
                  };
                  return (
                    <div key={item.channel}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 capitalize font-medium">{item.channel}</span>
                        <span className="text-xs text-slate-500 font-medium">{pct}% ({item.count})</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colorMap[item.channel] || 'from-slate-400 to-slate-300'} animate-funnel`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="premium-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-slate-800">Recent Campaigns</h3>
          <button
            onClick={() => navigate('/campaigns')}
            className="flex items-center gap-1 text-xs text-[#FF6B6B] hover:text-[#FFA69E] font-semibold transition-colors"
          >
            View All <IoArrowForward className="w-3 h-3" />
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 mb-3">No campaigns yet</p>
            <button
              onClick={() => navigate('/copilot')}
              className="text-sm text-brand-500 hover:text-brand-400 font-semibold transition-colors"
            >
              Create your first campaign →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {campaigns.map((campaign) => (
              <button
                key={campaign._id}
                onClick={() => navigate(`/campaigns/${campaign._id}`)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl
                           hover:bg-slate-50 transition-colors text-left group border border-transparent hover:border-slate-100"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-500/5 flex items-center justify-center flex-shrink-0">
                  <IoMegaphone className="w-4 h-4 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 font-bold truncate">{campaign.name}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {campaign.audienceSize} recipients · {new Date(campaign.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-md font-semibold
                    ${campaign.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                      campaign.status === 'sending' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-slate-500/10 text-slate-600'}`}>
                    {campaign.status}
                  </span>
                  <IoArrowForward className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
