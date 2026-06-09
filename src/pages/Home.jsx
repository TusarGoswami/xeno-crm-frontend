import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoSparkles, IoRocket, IoCheckmarkCircle, IoChevronForward } from 'react-icons/io5';
import ChatInput from '../components/ChatInput';
import SegmentPreview from '../components/SegmentPreview';
import MessageDraftEditor from '../components/MessageDraftEditor';
import CampaignStats from '../components/CampaignStats';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Home Page — The AI Chat Interface
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

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDraft, setCurrentDraft] = useState('');
  const [currentData, setCurrentData] = useState(null); // holds parsed AI data + segment results
  const chatEndRef = useRef(null);
  const msgIdRef = useRef(0); // unique message ID counter
  const navigate = useNavigate();

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /** Add a message to the chat feed */
  const addMessage = (type, data = {}) => {
    msgIdRef.current += 1;
    setMessages((prev) => [...prev, { id: `msg-${msgIdRef.current}`, type, ...data }]);
  };

  /** Main flow — triggered when user submits a prompt */
  const handlePromptSubmit = async (prompt) => {
    // Reset state for a new flow
    setCurrentDraft('');
    setCurrentData(null);
    setIsLoading(true);

    // Step 0: Show user's message
    addMessage(MSG_TYPES.USER, { text: prompt });

    // Step 1: Show "Analysing..." state
    addMessage(MSG_TYPES.AI_THINKING, { text: 'Analysing your request...' });

    try {
      // Step 2: Call Gemini to parse the prompt
      const parseRes = await axios.post(`${API_URL}/api/ai/parse`, { prompt });
      const parsed = parseRes.data.data;

      // Remove the "thinking" message and show filters
      setMessages((prev) => prev.filter((m) => m.type !== MSG_TYPES.AI_THINKING));
      addMessage(MSG_TYPES.AI_FILTERS, {
        reasoning: parsed.reasoning,
        campaignName: parsed.campaignName,
        filters: parsed.segmentFilters,
      });

      // Step 3: Query segment preview
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

      // Step 4: Show message draft
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

      // Step 5: Show launch button
      addMessage(MSG_TYPES.LAUNCH_READY, {
        campaignName: parsed.campaignName,
        audienceSize: count,
        channel,
      });

    } catch (error) {
      // Remove thinking message on error
      setMessages((prev) => prev.filter((m) => m.type !== MSG_TYPES.AI_THINKING));
      addMessage(MSG_TYPES.ERROR, {
        text: error.response?.data?.error || error.message || 'Something went wrong',
      });
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

      // Remove the launch-ready message
      setMessages((prev) => prev.filter((m) => m.type !== MSG_TYPES.LAUNCH_READY));

      addMessage(MSG_TYPES.SUCCESS, {
        campaignName: campaign.name,
        campaignId: campaign._id,
        audienceSize: campaign.audienceSize,
        stats: campaign.stats,
      });

      setCurrentData(null);
      setCurrentDraft('');
    } catch (error) {
      addMessage(MSG_TYPES.ERROR, {
        text: error.response?.data?.error || 'Failed to launch campaign',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /** Render a single chat message based on its type */
  const renderMessage = (msg) => {
    switch (msg.type) {
      // ── User message bubble ──
      case MSG_TYPES.USER:
        return (
          <div key={msg.id} className="flex justify-end animate-fade-in">
            <div className="max-w-[80%] bg-gradient-to-r from-brand-600 to-brand-500 
                            rounded-2xl rounded-br-md px-5 py-3 shadow-lg shadow-brand-500/20">
              <p className="text-sm text-white leading-relaxed">{msg.text}</p>
            </div>
          </div>
        );

      // ── AI thinking indicator ──
      case MSG_TYPES.AI_THINKING:
        return (
          <div key={msg.id} className="flex justify-start animate-fade-in">
            <div className="glass rounded-2xl rounded-bl-md px-5 py-3 max-w-[80%]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="typing-dot w-2 h-2 rounded-full bg-brand-400" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-brand-400" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-brand-400" />
                </div>
                <span className="text-sm text-gray-400">{msg.text}</span>
              </div>
            </div>
          </div>
        );

      // ── AI extracted filters ──
      case MSG_TYPES.AI_FILTERS:
        return (
          <div key={msg.id} className="flex justify-start animate-slide-up">
            <div className="glass rounded-2xl rounded-bl-md p-5 max-w-[90%] w-full">
              <div className="flex items-center gap-2 mb-3">
                <IoSparkles className="w-4 h-4 text-brand-400" />
                <h3 className="text-sm font-semibold text-white">AI Analysis</h3>
              </div>
              {msg.campaignName && (
                <div className="mb-2 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 inline-block">
                  <span className="text-xs text-brand-300 font-medium">Campaign: </span>
                  <span className="text-sm text-white font-semibold">{msg.campaignName}</span>
                </div>
              )}
              {msg.reasoning && (
                <p className="text-sm text-gray-300 leading-relaxed mt-2">{msg.reasoning}</p>
              )}
            </div>
          </div>
        );

      // ── Segment preview ──
      case MSG_TYPES.SEGMENT_PREVIEW:
        return (
          <div key={msg.id} className="flex justify-start w-full">
            <div className="glass rounded-2xl rounded-bl-md p-5 max-w-[95%] w-full">
              <SegmentPreview
                filters={msg.filters}
                customers={msg.customers}
                count={msg.count}
                reasoning={msg.reasoning}
              />
            </div>
          </div>
        );

      // ── Message draft ──
      case MSG_TYPES.MESSAGE_DRAFT:
        return (
          <div key={msg.id} className="flex justify-start w-full">
            <div className="glass rounded-2xl rounded-bl-md p-5 max-w-[90%] w-full">
              <MessageDraftEditor
                message={currentDraft || msg.message}
                onChange={setCurrentDraft}
                channel={msg.channel}
              />
            </div>
          </div>
        );

      // ── Launch button ──
      case MSG_TYPES.LAUNCH_READY:
        return (
          <div key={msg.id} className="flex justify-center animate-slide-up">
            <button
              onClick={handleLaunch}
              disabled={isLoading}
              id="launch-campaign-btn"
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl
                         bg-gradient-to-r from-brand-600 via-brand-500 to-purple-500
                         text-white font-semibold text-base
                         shadow-lg shadow-brand-500/25
                         hover:shadow-xl hover:shadow-brand-500/40
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

      // ── Success state ──
      case MSG_TYPES.SUCCESS:
        return (
          <div key={msg.id} className="flex justify-start animate-slide-up">
            <div className="glass rounded-2xl rounded-bl-md p-5 max-w-[90%] w-full 
                            border-emerald-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <IoCheckmarkCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400">Campaign Launched! 🎉</h3>
                  <p className="text-xs text-gray-400">{msg.campaignName}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {msg.audienceSize} messages are being delivered. Track live stats on the dashboard.
              </p>
              <CampaignStats
                stats={msg.stats}
                audienceSize={msg.audienceSize}
                status="sending"
              />
              <button
                onClick={() => navigate(`/campaigns`)}
                id="view-campaign-stats-btn"
                className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium
                           bg-white/5 hover:bg-white/10 text-brand-300 hover:text-white
                           transition-all duration-200 border border-white/5"
              >
                View Campaign Dashboard →
              </button>
            </div>
          </div>
        );

      // ── Error state ──
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
    <div className="flex flex-col h-screen bg-surface-900">
      {/* ── Header ── */}
      <header className="flex-shrink-0 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 
                            flex items-center justify-center shadow-lg shadow-brand-500/20">
              <IoSparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Campaign Copilot</h1>
              <p className="text-xs text-gray-500">AI-powered campaign manager</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/campaigns')}
            id="nav-campaigns-btn"
            className="px-4 py-2 rounded-xl text-sm font-medium
                       bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white
                       transition-all duration-200 border border-white/5"
          >
            Campaigns
          </button>
        </div>
      </header>

      {/* ── Chat Messages Area ── */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
          {/* Welcome message when chat is empty */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 
                              flex items-center justify-center mb-6 shadow-xl shadow-brand-500/20">
                <IoSparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">What campaign would you like to create?</h2>
              <p className="text-gray-500 max-w-md text-sm leading-relaxed">
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
                    className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-400
                               bg-white/[0.02] hover:bg-white/[0.05] border border-white/5
                               hover:border-brand-500/20 hover:text-gray-300
                               transition-all duration-200 disabled:opacity-50"
                  >
                    <span className="text-brand-400 mr-2">→</span>
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render all chat messages */}
          {messages.map(renderMessage)}

          {/* Scroll anchor */}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* ── Chat Input (pinned to bottom) ── */}
      <footer className="flex-shrink-0 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <ChatInput onSubmit={handlePromptSubmit} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}
