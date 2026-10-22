'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import {
  Bot,
  Zap,
  Send,
  X,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Layers,
  Flame,
  ShieldCheck,
  RefreshCw,
  Loader2,
  DollarSign,
  Play,
  Copy,
  Check,
  ClipboardPaste,
} from 'lucide-react';
import { Candle, Overlay } from '../types/chart';
import { generateStrategySetup } from '../utils/hermesEngine';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  setupPayload?: {
    title: string;
    headline: string;
    subline: string;
    strategy: string;
    basePrice: number;
    riskBudget: number;
    slPips: number;
    lotSize: string;
    rrRatio: number;
    badges: [string, string, string];
  };
}

interface HermesChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  '⚡ Lên setup nến FVG M15 hồi 50% CE tối nay',
  '💡 Pain point nào đang nhiều comment nhất?',
  '🛡️ Công thức tính $10 Risk Budget hoạt động ntn?',
  '🚀 Setup Quét thanh khoản BSL $4,154',
];

function extractSetupPayload(text: string) {
  const match = text.match(/```chart_setup\s*([\s\S]*?)```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {
      return null;
    }
  }
  return null;
}

export const HermesChatModal: React.FC<HermesChatModalProps> = ({ isOpen, onClose }) => {
  const { setHeadlineText, setSublineText, setBadges, clearAllCandles, addCandle, addOverlay, setCurrentTime, setIsPlaying } =
    useChartStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Chào Alan! Tôi là **Hermes Agent** — Tổng Đạo Diễn & Cố Vấn Trading của kênh @azzammastertradinggold.

Tôi nắm toàn bộ dữ liệu 20 kịch bản thực chiến, master pain point của khán giả, và quy tắc **Risk-First** ($10 / $30 Budget, 20 pips SL, giờ vàng 00:00 VN).

Bạn muốn tôi phân tích góc kịch bản nào hoặc yêu cầu tôi tạo setup nến nào cho video tiếp theo?`,
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput((prev) => (prev ? `${prev}\n${text}` : text));
      }
    } catch (err) {
      console.warn('Clipboard read error', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/hermes/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const payload = extractSetupPayload(data.reply);

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply.replace(/```chart_setup[\s\S]*?```/g, '').trim(),
        setupPayload: payload,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Có lỗi kết nối tới Hermes Agent (${err.message}). Vui lòng thử lại!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteSetup = (payload: NonNullable<ChatMessage['setupPayload']>) => {
    // 1. Set text & badges
    setHeadlineText(payload.headline);
    setSublineText(payload.subline);
    if (payload.badges) {
      setBadges(payload.badges);
    }

    // 2. Generate authentic strategy-specific candles & overlays
    clearAllCandles();
    const baseP = payload.basePrice || 4128.0;
    const { candles, overlays } = generateStrategySetup(
      payload.strategy,
      baseP,
      payload.riskBudget || 10,
      payload.slPips || 20,
      payload.lotSize || '0.05 lot',
      payload.rrRatio || 3.5
    );

    candles.forEach((c) => addCandle(c));
    overlays.forEach((o) => addOverlay(o));

    // 3. Play video immediately
    useChartStore.setState({ duration: 12 });
    setCurrentTime(0);
    setIsPlaying(true);

    setAppliedNotice(`✅ Đã nạp thành công setup "${payload.title}" lên Canvas!`);
    setTimeout(() => setAppliedNotice(''), 2000);

    // Auto-close modal so user immediately sees the animated canvas
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[88vh] bg-[#0B0F19] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col text-slate-200 select-text overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-[#0E1422] border-b border-[#1E293B] px-5 flex items-center justify-between flex-shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 border border-amber-500/30 rounded-xl text-amber-400">
              <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Hermes Agent • Trading Master Copilot</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tổng Đạo Diễn & Cố Vấn Trading Kênh @azzammastertradinggold (20 Kịch Bản Sẵn)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Applied Notification Banner */}
        {appliedNotice && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300 flex items-center justify-between animate-in slide-in-from-top duration-150 select-none">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{appliedNotice}</span>
            </span>
            <button
              onClick={onClose}
              className="text-[10px] underline hover:text-white font-mono"
            >
              Xem Canvas →
            </button>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm select-text cursor-text ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                    : 'bg-[#131B2A] border border-[#1E293B] text-slate-200 rounded-bl-none'
                }`}
              >
                {/* Message Header with Role & 1-Click Copy */}
                <div className="flex items-center justify-between gap-3 mb-1.5 select-none border-b border-white/10 pb-1">
                  <span className="text-[10px] font-bold tracking-wide uppercase opacity-75 font-mono">
                    {m.role === 'user' ? '👤 BẠN' : '🤖 HERMES AGENT'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(m.id, m.content)}
                    title="Sao chép toàn bộ tin nhắn này"
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/30 hover:bg-black/50 text-[10px] text-slate-300 hover:text-white transition active:scale-95"
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 text-[9px] font-medium">Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[9px] font-medium">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Formatted Text (Selectable, Copyable, Multi-line) */}
                <div className="whitespace-pre-wrap select-text selection:bg-amber-500/40 selection:text-white font-sans text-slate-100">
                  {m.content}
                </div>

                {/* If Hermes generated a setup payload, render direct execute card */}
                {m.setupPayload && (
                  <div className="mt-3 bg-[#0B0F19] border border-amber-500/40 rounded-xl p-3 flex flex-col gap-2 shadow-inner select-none">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Chỉ thị nạp Canvas từ Hermes:</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        READY
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white leading-tight select-text">
                      {m.setupPayload.title}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 select-text">
                      <div>
                        <span className="text-slate-500 block text-[9px]">Hook 9:16:</span>
                        <span className="font-mono text-amber-300 font-bold">"{m.setupPayload.headline}"</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">Quản lý vốn:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          ${m.setupPayload.riskBudget} | {m.setupPayload.slPips}p SL | {m.setupPayload.lotSize}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExecuteSetup(m.setupPayload!)}
                      className="mt-1 w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition active:scale-[0.98]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>⚡ Áp Dụng Lên Canvas & Chạy Video Ngay (1-Click)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 italic bg-[#131B2A] border border-[#1E293B] px-3.5 py-2.5 rounded-2xl rounded-bl-none max-w-[260px] select-none">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Hermes đang suy luận chiến thuật...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Action Prompt Pills */}
        <div className="px-4 py-2 border-t border-[#1E293B] bg-[#0E1422] flex items-center gap-1.5 overflow-x-auto flex-shrink-0 select-none">
          <span className="text-[10px] text-slate-500 font-bold flex-shrink-0">Gợi ý:</span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-[#141B29] hover:bg-[#1E293B] border border-[#1E293B] hover:border-amber-500/40 text-[10px] text-slate-300 hover:text-amber-300 transition whitespace-nowrap disabled:opacity-50"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar with Paste Button & Multiline Textarea */}
        <div className="p-3 bg-[#0B0F19] border-t border-[#1E293B] flex items-end gap-2 flex-shrink-0 select-text">
          <div className="relative flex-1 flex flex-col">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={Math.min(4, Math.max(1, input.split('\n').length))}
              placeholder="Gõ hoặc dán (Ctrl+V) kịch bản, pain point, hoặc yêu cầu setup nến... (Enter gửi, Shift+Enter xuống dòng)"
              disabled={isLoading}
              className="w-full bg-[#141B29] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition font-sans resize-none max-h-32 select-text selection:bg-amber-500/40"
            />
          </div>

          <button
            type="button"
            onClick={handlePasteFromClipboard}
            title="Dán nhanh nội dung từ Clipboard (Paste)"
            className="p-2.5 bg-[#141B29] hover:bg-[#1E293B] border border-[#1E293B] hover:border-amber-500/40 text-slate-300 hover:text-amber-400 font-bold rounded-xl transition flex items-center gap-1 text-xs select-none h-[38px]"
          >
            <ClipboardPaste className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">Dán</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            title="Gửi tin nhắn (Enter)"
            className="p-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold rounded-xl transition shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center select-none h-[38px] px-3.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
