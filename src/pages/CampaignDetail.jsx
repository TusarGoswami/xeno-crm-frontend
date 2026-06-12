import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  IoArrowBack, IoSparkles, IoCheckmarkCircle, IoCloseCircle,
  IoEye, IoHandRight, IoCalendar, IoPeople, IoSend,
} from 'react-icons/io5';
import CampaignStats from '../components/CampaignStats';
import { SkeletonCard } from '../components/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * CampaignDetail Page
 * Full-screen view for a single campaign with:
 * - Visual funnel: Sent → Delivered → Opened → Clicked
 * - Live-updating stats (polls every 3s if sending)
 * - Message-level delivery table
 * - Original prompt display
 */
export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef(null);

  useEffect(() => {
    fetchDetail();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/campaigns/${id}`);
      setCampaign(res.data.campaign);
      setMessages(res.data.messages || []);

      // Start polling if campaign is still sending
      if (res.data.campaign.status === 'sending') {
        pollRef.current = setInterval(async () => {
          try {
            const pollRes = await axios.get(`${API_URL}/api/campaigns/${id}`);
            setCampaign(pollRes.data.campaign);
            setMessages(pollRes.data.messages || []);
            if (pollRes.data.campaign.status === 'completed') {
              clearInterval(pollRef.current);
            }
          } catch (e) { /* ignore */ }
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const channelConfig = {
    whatsapp: { label: 'WhatsApp', color: 'bg-green-500/15 text-green-400' },
    sms: { label: 'SMS', color: 'bg-blue-500/15 text-blue-400' },
    email: { label: 'Email', color: 'bg-brand-500/15 text-brand-400' },
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

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[60vh]">
        <p className="text-gray-400 mb-4">Campaign not found</p>
        <button onClick={() => navigate('/campaigns')} className="text-brand-400 text-sm hover:text-brand-300">
          ← Back to Campaigns
        </button>
      </div>
    );
  }

  const stats = campaign.stats || {};
  const chConfig = channelConfig[campaign.channel] || channelConfig.whatsapp;

  // Funnel data
  const funnelSteps = [
    { label: 'Sent', count: stats.sent || 0, color: 'from-gray-500 to-gray-400', icon: IoSend },
    { label: 'Delivered', count: stats.delivered || 0, color: 'from-emerald-500 to-emerald-400', icon: IoCheckmarkCircle },
    { label: 'Opened', count: stats.opened || 0, color: 'from-blue-500 to-blue-400', icon: IoEye },
    { label: 'Clicked', count: stats.clicked || 0, color: 'from-brand-600 to-brand-400', icon: IoHandRight },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/campaigns')}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 
                     text-gray-400 hover:text-white transition-all"
          id="back-to-campaigns"
        >
          <IoArrowBack className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-slate-800">{campaign.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${chConfig.color}`}>
              {chConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1 font-medium">
              <IoCalendar className="w-3 h-3" />
              {new Date(campaign.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <IoPeople className="w-3 h-3" />
              {campaign.audienceSize} recipients
            </span>
          </div>
        </div>
      </div>

      {/* Original Prompt */}
      {campaign.naturalLanguagePrompt && (
        <div className="premium-card rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <IoSparkles className="w-4 h-4 text-[#FF6B6B]" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Original Prompt</span>
          </div>
          <p className="text-sm text-slate-600 font-medium italic">"{campaign.naturalLanguagePrompt}"</p>
        </div>
      )}

      {/* Visual Funnel */}
      <div className="premium-card rounded-2xl p-6 mb-6">
        <h3 className="text-sm font-bold text-slate-800 mb-5">Delivery Funnel</h3>
        <div className="flex items-end justify-between gap-4">
          {funnelSteps.map((step, i) => {
            const Icon = step.icon;
            const maxCount = funnelSteps[0].count || 1;
            const heightPct = maxCount > 0 ? Math.max(8, (step.count / maxCount) * 100) : 8;

            return (
              <div key={step.label} className="flex-1 flex flex-col items-center">
                {/* Count */}
                <span className="text-2xl font-extrabold text-slate-800 mb-2">{step.count}</span>

                {/* Bar */}
                <div className="w-full max-w-[80px] bg-slate-100 rounded-xl overflow-hidden"
                     style={{ height: '140px' }}>
                  <div className="w-full flex items-end h-full">
                    <div
                      className={`w-full rounded-xl bg-gradient-to-t ${step.color} animate-funnel`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </div>

                {/* Label */}
                <div className="flex items-center gap-1.5 mt-3">
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-500 font-semibold">{step.label}</span>
                </div>

                {/* Conversion rate */}
                {i > 0 && funnelSteps[i - 1].count > 0 && (
                  <span className="text-[10px] text-gray-600 mt-1">
                    {((step.count / funnelSteps[i - 1].count) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Failed count */}
        {stats.failed > 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-red-400/70">
            <IoCloseCircle className="w-3.5 h-3.5" />
            {stats.failed} messages failed
          </div>
        )}
      </div>

      {/* Detailed Stats */}
      <div className="premium-card rounded-2xl p-6 mb-6">
        <CampaignStats
          stats={campaign.stats}
          audienceSize={campaign.audienceSize}
          status={campaign.status}
        />
      </div>

      {/* Message Delivery Log */}
      {messages.length > 0 && (
        <div className="premium-card rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Message Delivery Log ({messages.length})
          </h3>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar max-h-[400px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-brand-500/5 text-brand-800 uppercase tracking-wider border-b border-slate-200">
                    <th className="text-left px-4 py-2.5 font-bold">Recipient</th>
                    <th className="text-left px-4 py-2.5 font-bold">Channel</th>
                    <th className="text-left px-4 py-2.5 font-bold">Status</th>
                    <th className="text-left px-4 py-2.5 font-bold">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {messages.map((msg) => (
                    <tr key={msg._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 text-slate-700">
                        <div>
                          <span className="font-bold text-slate-800">
                            {msg.customerId?.name || 'Unknown'}
                          </span>
                          <span className="ml-2 text-slate-400 font-medium">{msg.recipient}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-600 font-medium">{msg.channel}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center gap-1.5 font-semibold">
                          {statusIcon(msg.status)}
                          <span className={
                            msg.status === 'delivered' ? 'text-emerald-600' :
                            msg.status === 'failed' ? 'text-red-500' :
                            msg.status === 'opened' ? 'text-blue-600' :
                            msg.status === 'clicked' ? 'text-brand-500' :
                            'text-slate-500'
                          }>
                            {msg.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-400 font-medium">
                        {msg.statusHistory?.length > 0
                          ? new Date(msg.statusHistory[msg.statusHistory.length - 1].timestamp).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            })
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
    </div>
  );
}
