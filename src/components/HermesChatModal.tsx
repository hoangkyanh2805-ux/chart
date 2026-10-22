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
} from 'lucide-react';
import { Candle, Overlay } from '../types/chart';

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
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

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

    // 2. Generate authentic candles & overlays
    clearAllCandles();
    const baseP = payload.basePrice || 4128.0;

    const candles: Candle[] = [
      { id: 'c-1', index: 0, open: baseP - 8.0, high: baseP + 4.0, low: baseP - 9.0, close: baseP + 2.0 },
      { id: 'c-2', index: 1, open: baseP + 2.0, high: baseP + 3.0, low: baseP - 5.0, close: baseP - 3.5 },
      { id: 'c-3', index: 2, open: baseP - 3.5, high: baseP + 14.0, low: baseP - 4.0, close: baseP + 12.0 },
      { id: 'c-4', index: 3, open: baseP + 12.0, high: baseP + 13.0, low: baseP, close: baseP + 1.0 },
      { id: 'c-5', index: 4, open: baseP + 1.0, high: baseP + 8.0, low: baseP - 2.0, close: baseP + 6.5 },
      { id: 'c-6', index: 5, open: baseP + 6.5, high: baseP + 20.0, low: baseP + 5.5, close: baseP + 18.0 },
    ];

    const overlays: Overlay[] = [
      {
        id: 'hermes-support',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: baseP,
        priceEnd: baseP,
        color: '#38BDF8',
        label: `Support: $${baseP.toFixed(2)} (SL: ${payload.slPips || 20}p)`,
      },
      {
        id: 'hermes-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: baseP,
        priceEnd: baseP + 7.0,
        color: '#00F5A0',
        label: `Budget $${payload.riskBudget} | Size: ${payload.lotSize} | 1:${payload.rrRatio} RR`,
      },
    ];

    candles.forEach((c) => addCandle(c));
    overlays.forEach((o) => addOverlay(o));

    // 3. Play video immediately
    useChartStore.setState({ duration: 12 });
    setCurrentTime(0);
    setIsPlaying(true);

    setAppliedNotice(`✅ Đã nạp thành công setup "${payload.title}" lên Canvas!`);
    setTimeout(() => setAppliedNotice(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[86vh] bg-[#0B0F19] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col text-slate-200 select-none overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-[#0E1422] border-b border-[#1E293B] px-5 flex items-center justify-between flex-shrink-0">
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
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300 flex items-center justify-between animate-in slide-in-from-top duration-150">
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                    : 'bg-[#131B2A] border border-[#1E293B] text-slate-200 rounded-bl-none'
                }`}
              >
                {/* Formatted Text */}
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* If Hermes generated a setup payload, render direct execute card */}
                {m.setupPayload && (
                  <div className="mt-3 bg-[#0B0F19] border border-amber-500/40 rounded-xl p-3 flex flex-col gap-2 shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Chỉ thị nạp Canvas từ Hermes:</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        READY
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white leading-tight">
                      {m.setupPayload.title}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
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
            <div className="flex items-center gap-2 text-xs text-amber-400 italic bg-[#131B2A] border border-[#1E293B] px-3.5 py-2.5 rounded-2xl rounded-bl-none max-w-[260px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Hermes đang suy luận chiến thuật...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Action Prompt Pills */}
        <div className="px-4 py-2 border-t border-[#1E293B] bg-[#0E1422] flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
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

        {/* Input Bar */}
        <div className="p-3 bg-[#0B0F19] border-t border-[#1E293B] flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Hỏi Hermes về kịch bản, pain point, hoặc yêu cầu setup nến..."
            disabled={isLoading}
            className="flex-1 bg-[#141B29] border border-[#1E293B] rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition font-sans"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold rounded-xl transition shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
