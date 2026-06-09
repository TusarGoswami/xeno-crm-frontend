import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  IoSparkles, IoArrowBack, IoCalendar, IoPeople,
  IoChevronDown, IoChevronUp, IoClose,
  IoCheckmarkCircle, IoCloseCircle, IoEye, IoHandRight,
} from 'react-icons/io5';
import CampaignStats from '../components/CampaignStats';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Campaigns Dashboard Page
 *
 * Displays all campaigns as cards with live-updating stats.
 * - Lists campaigns sorted by newest first
 * - Each card shows name, date, audience size, channel, stats
 * - Click to expand → full message-level delivery breakdown
 * - Polls /api/campaigns/:id every 3 seconds for live updates on expanded cards
 */
export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedData, setExpandedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Poll expanded campaign every 3 seconds for live stats
  useEffect(() => {
    if (expandedId) {
      fetchCampaignDetail(expandedId);
      pollRef.current = setInterval(() => {
        fetchCampaignDetail(expandedId);
      }, 3000);
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [expandedId]);

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

  const fetchCampaignDetail = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/campaigns/${id}`);
      setExpandedData(res.data);
      // Also update the campaign in the list to reflect new stats
      setCampaigns((prev) =>
        prev.map((c) => (c._id === id ? res.data.campaign : c))
      );
    } catch (error) {
      console.error('Failed to fetch campaign detail:', error);
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedData(null);
    } else {
      setExpandedId(id);
      setExpandedData(null);
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
    whatsapp: { label: 'WhatsApp', color: 'bg-green-500/15 text-green-400' },
    sms: { label: 'SMS', color: 'bg-blue-500/15 text-blue-400' },
    email: { label: 'Email', color: 'bg-purple-500/15 text-purple-400' },
  };

  const statusIcon = (status) => {
    const map = {
      sent: <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />,
      delivered: <IoCheckmarkCircle className="w-3.5 h-3.5 text-emerald-400 inline-block" />,
      failed: <IoCloseCircle className="w-3.5 h-3.5 text-red-400 inline-block" />,
      opened: <IoEye className="w-3.5 h-3.5 text-blue-400 inline-block" />,
      read: <IoEye className="w-3.5 h-3.5 text-cyan-400 inline-block" />,
      clicked: <IoHandRight className="w-3.5 h-3.5 text-purple-400 inline-block" />,
    };
    return map[status] || map.sent;
  };

  return (
    <div className="min-h-screen bg-surface-900">
      {/* ── Header ── */}
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              id="nav-home-btn"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 
                         text-gray-400 hover:text-white transition-all"
            >
              <IoArrowBack className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Campaigns</h1>
              <p className="text-xs text-gray-500">{campaigns.length} total campaigns</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            id="new-campaign-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                       bg-gradient-to-r from-brand-600 to-brand-500 text-white
                       hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-200"
          >
            <IoSparkles className="w-4 h-4" />
            New Campaign
          </button>
        </div>
      </header>

      {/* ── Campaign Cards ── */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-brand-500/30 border-t-brand-400 rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-500">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-700/50 flex items-center justify-center mb-4">
              <IoPeople className="w-8 h-8 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-400 mb-2">No campaigns yet</h2>
            <p className="text-sm text-gray-600 mb-6">Create your first AI-powered campaign to get started.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl text-sm font-medium
                         bg-gradient-to-r from-brand-600 to-brand-500 text-white
                         hover:shadow-lg hover:shadow-brand-500/25 transition-all"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const isExpanded = expandedId === campaign._id;
              const chConfig = channelConfig[campaign.channel] || channelConfig.whatsapp;

              return (
                <div
                  key={campaign._id}
                  className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'border-brand-500/20 shadow-lg shadow-brand-500/5' : ''
                  }`}
                >
                  {/* Card Header — always visible */}
                  <button
                    onClick={() => toggleExpand(campaign._id)}
                    className="w-full text-left px-6 py-5 flex items-center gap-4 
                               hover:bg-white/[0.02] transition-colors"
                    id={`campaign-card-${campaign._id}`}
                  >
                    {/* Campaign icon */}
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 
                                    flex items-center justify-center border border-brand-500/10">
                      <IoSparkles className="w-5 h-5 text-brand-400" />
                    </div>

                    {/* Campaign info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {campaign.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${chConfig.color}`}>
                          {chConfig.label}
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

                    {/* Quick stats summary */}
                    <div className="flex-shrink-0 hidden sm:flex items-center gap-4 mr-4">
                      {[
                        { label: 'Delivered', val: campaign.stats?.delivered, color: 'text-emerald-400' },
                        { label: 'Opened', val: campaign.stats?.opened, color: 'text-blue-400' },
                        { label: 'Clicked', val: campaign.stats?.clicked, color: 'text-purple-400' },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <p className={`text-sm font-bold ${s.color}`}>{s.val || 0}</p>
                          <p className="text-xs text-gray-600">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Expand/collapse icon */}
                    <div className="flex-shrink-0 text-gray-500">
                      {isExpanded ? <IoChevronUp className="w-5 h-5" /> : <IoChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-white/5 animate-slide-up">
                      {/* Original prompt */}
                      {campaign.naturalLanguagePrompt && (
                        <div className="mt-4 mb-4 p-3 rounded-xl bg-surface-700/30 border border-white/5">
                          <p className="text-xs text-gray-500 mb-1">Original Prompt</p>
                          <p className="text-sm text-gray-300 italic">"{campaign.naturalLanguagePrompt}"</p>
                        </div>
                      )}

                      {/* Live Stats */}
                      <div className="mt-4 p-4 rounded-xl bg-surface-800/50 border border-white/5">
                        <CampaignStats
                          stats={campaign.stats}
                          audienceSize={campaign.audienceSize}
                          status={campaign.status}
                        />
                      </div>

                      {/* Message-level detail table */}
                      {expandedData?.messages && expandedData.messages.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Message Delivery Log ({expandedData.messages.length})
                          </h4>
                          <div className="rounded-xl border border-white/5 overflow-hidden">
                            <div className="overflow-x-auto custom-scrollbar max-h-[300px] overflow-y-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-surface-700/50 text-gray-500 uppercase tracking-wider">
                                    <th className="text-left px-4 py-2.5 font-medium">Recipient</th>
                                    <th className="text-left px-4 py-2.5 font-medium">Channel</th>
                                    <th className="text-left px-4 py-2.5 font-medium">Status</th>
                                    <th className="text-left px-4 py-2.5 font-medium">Last Updated</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {expandedData.messages.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-white/[0.02] transition-colors">
                                      <td className="px-4 py-2 text-gray-300">
                                        <div>
                                          <span className="font-medium text-white">
                                            {msg.customerId?.name || 'Unknown'}
                                          </span>
                                          <span className="ml-2 text-gray-600">{msg.recipient}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-2 text-gray-400">{msg.channel}</td>
                                      <td className="px-4 py-2">
                                        <span className="inline-flex items-center gap-1.5">
                                          {statusIcon(msg.status)}
                                          <span className={
                                            msg.status === 'delivered' ? 'text-emerald-400' :
                                            msg.status === 'failed' ? 'text-red-400' :
                                            msg.status === 'opened' ? 'text-blue-400' :
                                            msg.status === 'clicked' ? 'text-purple-400' :
                                            'text-gray-400'
                                          }>
                                            {msg.status}
                                          </span>
                                        </span>
                                      </td>
                                      <td className="px-4 py-2 text-gray-600">
                                        {msg.statusHistory?.length > 0
                                          ? formatDate(msg.statusHistory[msg.statusHistory.length - 1].timestamp)
                                          : '—'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Loading state for message data */}
                      {!expandedData && (
                        <div className="mt-4 flex items-center justify-center py-6">
                          <div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-400 rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
