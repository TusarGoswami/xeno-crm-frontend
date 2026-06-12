import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  IoSparkles, IoCalendar, IoPeople, IoArrowForward,
  IoCheckmarkCircle, IoCloseCircle, IoEye, IoHandRight,
  IoTrendingUp,
} from 'react-icons/io5';
import { SkeletonCard } from '../components/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Campaigns List Page
 * Displays all campaigns as cards with stats summary.
 * Click a card → navigates to /campaigns/:id detail page.
 */
export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/campaigns`);
      setCampaigns(res.data.campaigns || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const channelConfig = {
    whatsapp: { label: 'WhatsApp', color: 'bg-green-500/15 text-green-500 font-bold' },
    sms: { label: 'SMS', color: 'bg-blue-500/15 text-blue-500 font-bold' },
    email: { label: 'Email', color: 'bg-brand-500/15 text-brand-500 font-bold' },
    rcs: { label: 'RCS', color: 'bg-orange-500/15 text-orange-600 font-bold' },
  };

  // Compute aggregate stats
  const aggStats = campaigns.reduce((acc, c) => ({
    totalSent: acc.totalSent + (c.stats?.sent || 0),
    totalDelivered: acc.totalDelivered + (c.stats?.delivered || 0),
    totalOpened: acc.totalOpened + (c.stats?.opened || 0),
    totalClicked: acc.totalClicked + (c.stats?.clicked || 0),
  }), { totalSent: 0, totalDelivered: 0, totalOpened: 0, totalClicked: 0 });

  const deliveryRate = aggStats.totalSent > 0
    ? ((aggStats.totalDelivered / aggStats.totalSent) * 100).toFixed(1) : '0.0';
  const openRate = aggStats.totalDelivered > 0
    ? ((aggStats.totalOpened / aggStats.totalDelivered) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Campaigns</h1>
          <p className="text-sm text-slate-500 mt-1">{campaigns.length} total campaigns</p>
        </div>
        <button
          onClick={() => navigate('/copilot')}
          id="new-campaign-btn"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     bg-gradient-to-r from-[#0F4C5C] to-[#FF6B6B] text-white
                     hover:shadow-[0_4px_15px_rgba(255,107,107,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <IoSparkles className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Summary Metrics */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Campaigns', value: campaigns.length, color: 'text-brand-500' },
            { label: 'Messages Sent', value: aggStats.totalSent, color: 'text-slate-800' },
            { label: 'Delivery Rate', value: `${deliveryRate}%`, color: 'text-emerald-600' },
            { label: 'Open Rate', value: `${openRate}%`, color: 'text-blue-600' },
          ].map((m) => (
            <div key={m.label} className="premium-card rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-400 font-bold mb-1">{m.label}</p>
              <p className={`text-xl font-extrabold ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/5 flex items-center justify-center mb-4">
            <IoPeople className="w-8 h-8 text-brand-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No campaigns yet</h2>
          <p className="text-sm text-slate-500 mb-6">Create your first AI-powered campaign to get started.</p>
          <button
            onClick={() => navigate('/copilot')}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold
                       bg-gradient-to-r from-[#0F4C5C] to-[#FF6B6B] text-white
                       hover:shadow-[0_4px_12px_rgba(255,107,107,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign) => {
            const chConfig = channelConfig[campaign.channel] || channelConfig.whatsapp;
            const stats = campaign.stats || {};

            return (
              <button
                key={campaign._id}
                onClick={() => navigate(`/campaigns/${campaign._id}`)}
                className="w-full premium-card rounded-2xl px-6 py-5 flex items-center gap-4 text-left group"
                id={`campaign-card-${campaign._id}`}
              >
                {/* Campaign icon */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-400/20 
                                flex items-center justify-center border border-brand-500/10">
                  <IoSparkles className="w-5 h-5 text-brand-400" />
                </div>

                {/* Campaign info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-800 truncate">{campaign.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${chConfig.color}`}>
                      {chConfig.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium
                      ${campaign.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                        campaign.status === 'sending' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-gray-500/15 text-gray-400'}`}>
                      {campaign.status === 'sending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                      {campaign.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <IoCalendar className="w-3 h-3" />
                      {formatDate(campaign.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <IoPeople className="w-3 h-3" />
                      {campaign.audienceSize} recipients
                    </span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex-shrink-0 hidden sm:flex items-center gap-5 mr-2">
                  {[
                    { label: 'Delivered', val: stats.delivered, color: 'text-emerald-600' },
                    { label: 'Opened', val: stats.opened, color: 'text-blue-600' },
                    { label: 'Clicked', val: stats.clicked, color: 'text-purple-600' },
                    { label: 'Converted', val: stats.converted, color: 'text-[#FF6B6B]' },
                  ].map((s) => (
                    <div key={s.label} className="text-center min-w-[50px]">
                      <p className={`text-sm font-extrabold ${s.color}`}>{s.val || 0}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</p>
                    </div>
                  ))}
                </div>

                <IoArrowForward className="w-5 h-5 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
