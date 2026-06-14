import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoSparkles, IoRocket, IoCheckmarkCircle, IoChevronForward } from 'react-icons/io5';
import { useToast } from '../components/Toast';
import ChatInput from '../components/ChatInput';
import SegmentPreview from '../components/SegmentPreview';
import MessageDraftEditor from '../components/MessageDraftEditor';
import CampaignStats from '../components/CampaignStats';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Copilot Page — The AI Chat Interface
 *
 * This is the primary page where marketers interact with the CRM.
 * The flow is conversational:
 *   1. User types a campaign description in natural language
 *   2. AI parses → shows reasoning + filters
 *   3. Segment preview → shows matching customers
 *   4. Message draft → editable AI-written message
 *   5. Launch → creates campaign and shows success
 */

// Chat message types for rendering different UI blocks
const MSG_TYPES = {
  USER: 'user',
  AI_THINKING: 'ai_thinking',
  AI_FILTERS: 'ai_filters',
  SEGMENT_PREVIEW: 'segment_preview',
  MESSAGE_DRAFT: 'message_draft',
  LAUNCH_READY: 'launch_ready',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function Copilot() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDraft, setCurrentDraft] = useState('');
  const [currentData, setCurrentData] = useState(null);
  const [liveCampaignId, setLiveCampaignId] = useState(null);
  const chatEndRef = useRef(null);
  const msgIdRef = useRef(0);
  const pollRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll live stats for the most recently launched campaign
  useEffect(() => {
    if (liveCampaignId) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await axios.get(`${API_URL}/api/campaigns/${liveCampaignId}`);
          const campaign = res.data.campaign;
          // Update the success message with latest stats
          setMessages((prev) =>
            prev.map((m) =>
              m.type === MSG_TYPES.SUCCESS && m.campaignId === liveCampaignId
                ? { ...m, stats: campaign.stats, campaignStatus: campaign.status }
                : m
            )
          );
          // Stop polling when campaign completes
          if (campaign.status === 'completed') {
            clearInterval(pollRef.current);
            setLiveCampaignId(null);
          }
        } catch (err) {
          // silently ignore poll errors
        }
      }, 3000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [liveCampaignId]);

  /** Add a message to the chat feed */
  const addMessage = (type, data = {}) => {
    msgIdRef.current += 1;
    setMessages((prev) => [...prev, { id: `msg-${msgIdRef.current}`, type, ...data }]);
  };

  /** Main flow — triggered when user submits a prompt */
  const handlePromptSubmit = async (prompt) => {
    setCurrentDraft('');
    setCurrentData(null);
    setIsLoading(true);

    addMessage(MSG_TYPES.USER, { text: prompt });
    addMessage(MSG_TYPES.AI_THINKING, { text: 'Analysing your request...' });

    try {
      const parseRes = await axios.post(`${API_URL}/api/ai/parse`, { prompt });
      const parsed = parseRes.data.data;

      setMessages((prev) => prev.filter((m) => m.type !== MSG_TYPES.AI_THINKING));
      addMessage(MSG_TYPES.AI_FILTERS, {
        reasoning: parsed.reasoning,
        campaignName: parsed.campaignName,
        filters: parsed.segmentFilters,
      });

      const segmentRes = await axios.post(`${API_URL}/api/segments/preview`, {
        segmentFilters: parsed.segmentFilters,
      });
      const { customers, count } = segmentRes.data;

      addMessage(MSG_TYPES.SEGMENT_PREVIEW, {
        filters: parsed.segmentFilters,
        customers,
        count,
        reasoning: parsed.reasoning,
      });

      setCurrentDraft(parsed.suggestedMessage);
      const channel = parsed.segmentFilters.channel || 'whatsapp';

      setCurrentData({
        campaignName: parsed.campaignName,
        prompt,
        segmentFilters: parsed.segmentFilters,
        customers,
        count,
        channel,
        messageTemplate: parsed.suggestedMessage,
      });

      addMessage(MSG_TYPES.MESSAGE_DRAFT, {
        message: parsed.suggestedMessage,
        channel,
      });

      addMessage(MSG_TYPES.LAUNCH_READY, {
        campaignName: parsed.campaignName,
        audienceSize: count,
        channel,
      });
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.type !== MSG_TYPES.AI_THINKING));
      addMessage(MSG_TYPES.ERROR, {
        text: error.response?.data?.error || error.message || 'Something went wrong',
      });
      showToast('Failed to parse campaign prompt', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /** Launch the campaign */
  const handleLaunch = async () => {
    if (!currentData) return;
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/campaigns/create`, {
        name: currentData.campaignName,
        prompt: currentData.prompt,
        segmentFilters: currentData.segmentFilters,
        messageTemplate: currentDraft || currentData.messageTemplate,
        channel: currentData.channel,
        customerIds: currentData.customers.map((c) => c._id),
      });

      const campaign = res.data.campaign;

      setMessages((prev) => prev.filter((m) => m.type !== MSG_TYPES.LAUNCH_READY));

      addMessage(MSG_TYPES.SUCCESS, {
        campaignName: campaign.name,
        campaignId: campaign._id,
        audienceSize: campaign.audienceSize,
        stats: campaign.stats,
        campaignStatus: campaign.status,
      });

      // Start live-polling stats
      setLiveCampaignId(campaign._id);

      showToast(`Campaign "${campaign.name}" launched! 🚀`, 'success');

      setCurrentData(null);
      setCurrentDraft('');
    } catch (error) {
      addMessage(MSG_TYPES.ERROR, {
        text: error.response?.data?.error || 'Failed to launch campaign',
      });
      showToast('Failed to launch campaign', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /** Render a single chat message based on its type */
  const renderMessage = (msg) => {
    switch (msg.type) {
      case MSG_TYPES.USER:
        return (
          <div key={msg.id} className="flex justify-end animate-fade-in">
            <div className="max-w-[90%] sm:max-w-[80%] bg-gradient-to-r from-brand-500 to-[#FF6B6B] 
                            rounded-2xl rounded-br-md px-4 sm:px-5 py-3 shadow-md shadow-brand-500/10">
              <p className="text-sm text-white leading-relaxed">{msg.text}</p>
            </div>
          </div>
        );

      case MSG_TYPES.AI_THINKING:
        return (
          <div key={msg.id} className="flex justify-start animate-fade-in">
            <div className="premium-card rounded-2xl rounded-bl-md px-4 sm:px-5 py-3 max-w-[90%] sm:max-w-[80%]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="typing-dot w-2 h-2 rounded-full bg-[#FF6B6B]" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-[#FF6B6B]" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-[#FF6B6B]" />
                </div>
                <span className="text-sm text-slate-500 font-medium">{msg.text}</span>
              </div>
            </div>
          </div>
        );

      case MSG_TYPES.AI_FILTERS:
        return (
          <div key={msg.id} className="flex justify-start animate-slide-up">
            <div className="premium-card rounded-2xl rounded-bl-md p-4 sm:p-5 max-w-[95%] sm:max-w-[90%] w-full">
              <div className="flex items-center gap-2 mb-3">
                <IoSparkles className="w-4 h-4 text-[#FF6B6B]" />
                <h3 className="text-sm font-bold text-slate-800">AI Analysis</h3>
              </div>
              {msg.campaignName && (
                <div className="mb-2 px-3 py-1.5 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 inline-block">
                  <span className="text-xs text-[#FF6B6B] font-bold">Campaign: </span>
                  <span className="text-sm text-[#FF6B6B] font-bold">{msg.campaignName}</span>
                </div>
              )}
              {msg.reasoning && (
                <p className="text-sm text-slate-600 leading-relaxed mt-2">{msg.reasoning}</p>
              )}
            </div>
          </div>
        );

      case MSG_TYPES.SEGMENT_PREVIEW:
        return (
          <div key={msg.id} className="flex justify-start w-full">
            <div className="premium-card rounded-2xl rounded-bl-md p-4 sm:p-5 max-w-full sm:max-w-[95%] w-full">
              <SegmentPreview
                filters={msg.filters}
                customers={msg.customers}
                count={msg.count}
                reasoning={msg.reasoning}
              />
            </div>
          </div>
        );

      case MSG_TYPES.MESSAGE_DRAFT:
        return (
          <div key={msg.id} className="flex justify-start w-full">
            <div className="premium-card rounded-2xl rounded-bl-md p-4 sm:p-5 max-w-full sm:max-w-[90%] w-full">
              <MessageDraftEditor
                message={currentDraft || msg.message}
                onChange={setCurrentDraft}
                channel={msg.channel}
              />
            </div>
          </div>
        );

      case MSG_TYPES.LAUNCH_READY:
        return (
          <div key={msg.id} className="flex justify-center animate-slide-up">
            <button
              onClick={handleLaunch}
              disabled={isLoading}
              id="launch-campaign-btn"
              className="group flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 rounded-2xl
                         bg-gradient-to-r from-[#0F4C5C] via-[#1B5E73] to-[#FF6B6B]
                         text-white font-bold text-sm sm:text-base
                         shadow-md shadow-brand-500/10
                         hover:shadow-[0_6px_20px_rgba(255,107,107,0.35)]
                         hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoRocket className="w-5 h-5 group-hover:animate-bounce" />
              Launch Campaign — {msg.audienceSize} recipients
              <IoChevronForward className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );

      case MSG_TYPES.SUCCESS:
        return (
          <div key={msg.id} className="flex justify-start animate-slide-up">
            <div className="premium-card rounded-2xl rounded-bl-md p-4 sm:p-5 max-w-full sm:max-w-[90%] w-full 
                            border-emerald-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <IoCheckmarkCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-600">Campaign Launched! 🎉</h3>
                  <p className="text-xs text-slate-500 font-medium">{msg.campaignName}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4 font-medium">
                {msg.audienceSize} messages are being delivered. Stats update live below.
              </p>
              <CampaignStats
                stats={msg.stats}
                audienceSize={msg.audienceSize}
                status={msg.campaignStatus || 'sending'}
              />
              <button
                onClick={() => navigate(`/campaigns/${msg.campaignId}`)}
                id="view-campaign-detail-btn"
                className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold
                           bg-slate-100 hover:bg-slate-200 text-brand-500 hover:text-brand-600
                           transition-all duration-200 border border-slate-200/50"
              >
                View Campaign Details →
              </button>
            </div>
          </div>
        );

      case MSG_TYPES.ERROR:
        return (
          <div key={msg.id} className="flex justify-start animate-fade-in">
            <div className="rounded-2xl rounded-bl-md p-4 max-w-[80%] 
                            bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-300">❌ {msg.text}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
          {/* Welcome message when chat is empty */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[55vh] sm:h-[60vh] text-center animate-fade-in px-2">
              <div className="w-16 h-16 rounded-2xl bg-[#092D37] border border-teal-500/30
                              flex items-center justify-center mb-6 shadow-xl p-2.5">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                  <defs>
                    <linearGradient id="glowGradLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B6B" />
                      <stop offset="50%" stopColor="#FFA69E" />
                      <stop offset="100%" stopColor="#FF8E53" />
                    </linearGradient>
                    <linearGradient id="glassGradLarge" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#1B5E73" stopOpacity="0.2" />
                    </linearGradient>
                    <filter id="neonGlowLarge" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <path d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" stroke="url(#glowGradLarge)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
                  <path d="M25 25 L45 50 L25 75" stroke="url(#glowGradLarge)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M75 25 L55 50 L75 75" stroke="url(#glowGradLarge)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M50 20 L68 50 L50 80 L32 50 Z" fill="url(#glassGradLarge)" stroke="url(#glowGradLarge)" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" filter="url(#neonGlowLarge)" />
                  <path d="M50 38 L50 62 M38 50 L62 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" filter="url(#neonGlowLarge)" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-2">What campaign would you like to create?</h2>
              <p className="text-slate-500 max-w-md text-xs sm:text-sm leading-relaxed font-medium">
                Describe your target audience and message in plain English. 
                I'll handle the segmentation, draft a message, and get it ready to send.
              </p>

              {/* Example prompts */}
              <div className="mt-8 space-y-2 w-full max-w-lg">
                {[
                  "Find customers who haven't bought in 60 days but spent over ₹1500 and send them a win-back offer on WhatsApp",
                  "Send a Diwali sale announcement to all Mumbai customers via SMS",
                  "Target high-value customers with 10+ orders for an exclusive loyalty reward email",
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptSubmit(example)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-700 font-semibold
                               bg-white hover:bg-slate-50 border border-slate-200
                               hover:border-[#FF6B6B]/45 hover:text-brand-500
                               transition-all duration-200 disabled:opacity-50 shadow-sm"
                  >
                    <span className="text-[#FF6B6B] mr-2">→</span>
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(renderMessage)}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Chat Input (pinned to bottom) */}
      <footer className="flex-shrink-0 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <ChatInput onSubmit={handlePromptSubmit} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}
