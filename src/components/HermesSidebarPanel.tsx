'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import {
  Zap,
  Send,
  X,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Play,
  Copy,
  Check,
  ClipboardPaste,
  Sparkles,
  Radio,
  Youtube,
} from 'lucide-react';
import { generateStrategySetup } from '../utils/hermesEngine';
import { YouTubeAuditModal } from './YouTubeAuditModal';
import { generateDynamicScriptSubtitles } from '../utils/dynamicScriptNarrator';
import { jevFastReflexVerify } from '../utils/jevReflexGate';

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
    beforeAfterMode?: 'auto' | 'before' | 'after' | 'off';
    scriptSubtitles?: Array<{ timePercent: number; text: string; stageName?: string }>;
  };
}

interface SuggestionItem {
  id: string;
  label: string;
  prompt: string;
  category: 'scripts' | 'painpoints' | 'courses' | 'live';
  badge?: string;
}

interface HermesSuggestionsResponse {
  timestamp: string;
  activeCounts: {
    scripts: number;
    painpoints: number;
    courses: number;
    live: number;
  };
  categories: {
    scripts: SuggestionItem[];
    painpoints: SuggestionItem[];
    courses: SuggestionItem[];
    live: SuggestionItem[];
  };
}

function extractSubtitlesFromMessageText(text: string): ScriptSubtitle[] | null {
  const lines = text.split('\n');
  let hook = '';
  let trap = '';
  let setup = '';
  let execution = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (/hook/i.test(trimmed) && !hook) {
      const match = trimmed.match(/hook[^:]*:\s*(?:["“']?(.*?)[”"']?$)/i);
      if (match && match[1]) hook = match[1].replace(/[*_#]/g, '').trim();
    } else if (/(trap|nỗi đau|bẫy)/i.test(trimmed) && !trap) {
      const match = trimmed.match(/(?:trap|nỗi đau|bẫy)[^:]*:\s*(?:["“']?(.*?)[”"']?$)/i);
      if (match && match[1]) trap = match[1].replace(/[*_#]/g, '').trim();
    } else if (/(setup|dấu chân|kích hoạt|trigger)/i.test(trimmed) && !setup) {
      const match = trimmed.match(/(?:setup|dấu chân|kích hoạt|trigger)[^:]*:\s*(?:["“']?(.*?)[”"']?$)/i);
      if (match && match[1]) setup = match[1].replace(/[*_#]/g, '').trim();
    } else if (/(execution|vào lệnh|quản trị|chốt lời|sl|target)/i.test(trimmed) && !execution) {
      const match = trimmed.match(/(?:execution|vào lệnh|quản trị|chốt lời|sl|target)[^:]*:\s*(?:["“']?(.*?)[”"']?$)/i);
      if (match && match[1]) execution = match[1].replace(/[*_#]/g, '').trim();
    }
  }

  if (hook && (trap || setup)) {
    return [
      { timePercent: 0.0, text: hook, stageName: 'Hook' },
      { timePercent: 0.28, text: trap || 'Đám đông nhảy vào theo cảm tính và trở thành thanh khoản!', stageName: 'Trap' },
      { timePercent: 0.58, text: setup || 'Xác nhận nến rút râu và FVG đảo chiều chuẩn SMC.', stageName: 'Setup' },
      { timePercent: 0.82, text: execution || 'Khóa rủi ro cố định, kỷ luật tuyệt đối trước khi nhìn chart.', stageName: 'Execution' },
    ];
  }
  return null;
}

function extractSetupPayload(text: string) {
  const match = text.match(/```chart_setup\s*([\s\S]*?)```/);
  let payload: any = null;
  if (match && match[1]) {
    try {
      payload = JSON.parse(match[1].trim());
    } catch {
      payload = null;
    }
  }

  if (payload) {
    if (!payload.scriptSubtitles || payload.scriptSubtitles.length === 0) {
      const parsedSubs = extractSubtitlesFromMessageText(text);
      if (parsedSubs) {
        payload.scriptSubtitles = parsedSubs;
      }
    }
  }
  return payload;
}

export const HermesSidebarPanel: React.FC = () => {
  const {
    setActiveTool,
    setIsHermesChatOpen,
    setIsAzzamOpsOpen,
    setHeadlineText,
    setSublineText,
    setBadges,
    clearAllCandles,
    addCandle,
    addOverlay,
    setCurrentTime,
    setIsPlaying,
  } = useChartStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Chào Alan! Tôi là **Hermes Copilot** — Tổng Đạo Diễn & Cố Vấn Trading kênh @azzammastertradinggold.

Tôi đã đồng bộ toàn bộ dữ liệu 20 kịch bản thực chiến, master pain point của khán giả, và quy tắc **Risk-First** ($10 / $30 Budget, 20 pips SL, giờ vàng 00:00 VN).

Bạn muốn tôi phân tích góc kịch bản nào hoặc yêu cầu tôi tạo setup nến nào cho video tiếp theo?`,
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'scripts' | 'painpoints' | 'courses' | 'live'>('scripts');
  const [suggestions, setSuggestions] = useState<HermesSuggestionsResponse | null>(null);
  const [isYouTubeAuditOpen, setIsYouTubeAuditOpen] = useState<boolean>(false);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const chipsContainerRef = useRef<HTMLDivElement | null>(null);

  // Load live suggestions from API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/hermes/suggestions')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.categories) {
          setSuggestions(data);
        }
      })
      .catch((err) => console.warn('Failed loading suggestions:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollChips = (direction: 'left' | 'right') => {
    if (chipsContainerRef.current) {
      const scrollAmount = 260;
      chipsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          content: `⚠️ Có lỗi kết nối (${err.message}). Vui lòng thử lại!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteSetup = (payload: NonNullable<ChatMessage['setupPayload']>) => {
    const isPP0023 = /pp-0023|3 cây nến|cấu trúc nến|đọc nến|institutional candle|488/i.test(
      `${payload.title} ${payload.headline} ${payload.strategy} ${payload.subline}`
    );

    const finalHeadline = isPP0023 ? '3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN' : payload.headline;
    const finalSubline = isPP0023
      ? 'Dừng đọc chart kiểu đoán mò. Bắt bài dấu chân Big Boys.'
      : payload.subline;

    setHeadlineText(finalHeadline);
    setSublineText(finalSubline);
    if (payload.badges) {
      setBadges(payload.badges);
    }

    const dir: 'BUY' | 'SELL' = isPP0023 ? 'SELL' : /sweep|supply|bearish/i.test(payload.strategy) ? 'SELL' : 'BUY';
    const baseP = isPP0023 ? 4132.5 : payload.basePrice || 4128.0;
    const slPips = payload.slPips || 20;
    const rrRatio = payload.rrRatio || 3.5;
    const riskBudget = payload.riskBudget || 10;
    const slDistance = slPips * 0.1;
    const tpDistance = slPips * rrRatio * 0.1;
    const slPrice = dir === 'BUY' ? baseP - slDistance : baseP + slDistance;
    const tpPrice = dir === 'BUY' ? baseP + tpDistance : baseP - tpDistance;
    const targetPips = isPP0023 ? 75 : Math.round(slPips * rrRatio);
    const lotNum = parseFloat((payload.lotSize || '0.05 lot').replace(/[^0-9.]/g, '')) || 0.05;

    clearAllCandles();

    if (isPP0023) {
      // 3 Institutional Candles from script_2026-10-27_xauusd-pp0023-institutional-candle-reading.md
      addCandle({ open: 4130.0, high: 4138.0, low: 4129.0, close: 4134.0 }); // Cây 1: Quét đỉnh 4138 rút râu
      addCandle({ open: 4134.0, high: 4134.5, low: 4127.0, close: 4128.0 }); // Cây 2: Displacement FVG dump
      addCandle({ open: 4128.0, high: 4132.5, low: 4124.0, close: 4125.0 }); // Cây 3: Retest 50% FVG C.E.

      clearAllCandles();
      setCandles([
        { id: 'pp1', index: 0, open: 4130.0, high: 4138.0, low: 4129.0, close: 4134.0 },
        { id: 'pp2', index: 1, open: 4134.0, high: 4134.5, low: 4127.0, close: 4128.0 },
        { id: 'pp3', index: 2, open: 4128.0, high: 4132.5, low: 4124.0, close: 4125.0 },
      ]);

      setOverlays([
        {
          id: 'ov-sweep-peak',
          type: 'LIQUIDITY_LINE',
          startCandleIndex: 0,
          endCandleIndex: 2,
          priceStart: 4138.0,
          priceEnd: 4138.0,
          color: '#F43F5E',
          label: 'BSL Sweep Peak ($4,138.00)',
        },
        {
          id: 'ov-fvg-ce',
          type: 'FVG',
          startCandleIndex: 1,
          endCandleIndex: 2,
          priceStart: 4129.0,
          priceEnd: 4134.0,
          color: '#F59E0B',
          label: 'Bearish FVG 50% C.E. ($4,132.50)',
        },
        {
          id: 'ov-rr-pp0023',
          type: 'LONG_SHORT',
          startCandleIndex: 2,
          endCandleIndex: 2,
          priceStart: 4132.5,
          priceEnd: 4125.0,
          color: '#00F5A0',
          label: 'SELL 0.05 lot @ $4,132.50 (1:3.75 RR)',
        },
      ]);
    } else {
      const { candles, overlays } = generateStrategySetup(
        payload.strategy,
        baseP,
        riskBudget,
        slPips,
        payload.lotSize || `${lotNum} lot`,
        rrRatio
      );
      candles.forEach((c) => addCandle(c));
      overlays.forEach((o) => addOverlay(o));
    }

    const subtitlesToUse = (payload as any).scriptSubtitles && (payload as any).scriptSubtitles.length > 0
      ? (payload as any).scriptSubtitles
      : generateDynamicScriptSubtitles({
          title: finalHeadline,
          topic: finalSubline,
          strategy: payload.strategy,
          direction: dir,
          entryPrice: baseP,
          slPips,
          targetPips,
          riskAmount: riskBudget,
          lotSize: payload.lotSize || `${lotNum} lot`,
          rrRatio,
        });

    // ⚡ JEV REFLEX GATEKEEPER (< 5ms check & auto-calibration)
    const jevAudit = jevFastReflexVerify({
      headline: finalHeadline,
      subline: finalSubline,
      strategy: payload.strategy,
      direction: dir,
      basePrice: baseP,
      slPips,
      targetPips,
      riskBudget,
      lotSize: payload.lotSize || `${lotNum} lot`,
      rrRatio,
      scriptSubtitles: subtitlesToUse,
    });

    const finalSubtitles = jevAudit.calibratedPayload.scriptSubtitles || subtitlesToUse;
    const finalSlPips = jevAudit.calibratedPayload.slPips || slPips;
    const finalRisk = jevAudit.calibratedPayload.riskBudget || riskBudget;
    const finalRr = jevAudit.calibratedPayload.rrRatio || rrRatio;
    const finalTarget = jevAudit.calibratedPayload.targetPips || targetPips;

    useChartStore.setState({
      voiceAudioUrl: null, // Clear old audio so new voice is generated fresh
      voiceAudioBase64: null,
      duration: 12,
      executionOrder: {
        type: dir,
        lot: lotNum,
        entry: parseFloat(baseP.toFixed(1)),
        sl: isPP0023 ? 4134.5 : parseFloat((dir === 'BUY' ? baseP - finalSlPips * 0.1 : baseP + finalSlPips * 0.1).toFixed(1)),
        tp: isPP0023 ? 4125.0 : parseFloat((dir === 'BUY' ? baseP + finalSlPips * finalRr * 0.1 : baseP - finalSlPips * finalRr * 0.1).toFixed(1)),
        risk: finalRisk,
        reward: Math.round(finalRisk * finalRr),
        pips: finalTarget,
      },
      targetPips: finalTarget,
      showPipCounter: true,
      showExecutionBadge: true,
      calloutPinText: isPP0023
        ? '🎯 50% FVG C.E. RETEST ($4,132.50)'
        : dir === 'BUY'
        ? `🎯 RÚT CHÂN HỖ TRỢ ($${baseP.toFixed(0)})`
        : `🎯 BUY-SIDE LIQUIDITY SWEEP ($${baseP.toFixed(0)})`,
      calloutCandleIndex: isPP0023 ? 2 : 4,
      showCalloutPin: true,
      beforeAfterMode: /overcomplicating|tối giản|pp-0009|indicator|chỉ báo/i.test(`${payload.headline} ${payload.title} ${payload.subline}`)
        ? 'auto'
        : 'off',
      scriptSubtitles: finalSubtitles,
      activeScriptMeta: {
        id: isPP0023 ? 'PP0023-INSTITUTIONAL-3-CANDLES' : payload.title,
        title: isPP0023 ? '3 Cây Nến Tiết Lộ Dòng Tiền Lớn' : payload.headline,
      },
      activeTool: 'script',
    });

    useChartStore.getState().validateCurrentSetup();
    setCurrentTime(0);
    setIsPlaying(true);

    // Auto-generate AI Voiceover for this new setup in background
    setTimeout(() => {
      useChartStore.getState().generateVoiceover();
    }, 150);

    const reflexNotice = jevAudit.interventions.length > 0 ? ` (⚡ Jev Reflex: ${jevAudit.reflexTimeMs}ms)` : '';
    setAppliedNotice(`${payload.title}${reflexNotice}`);
    setTimeout(() => setAppliedNotice(''), 4000);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput((prev) => (prev ? `${prev}\n${text}` : text));
      }
    } catch (err) {
      console.warn('Clipboard read error', err);
    }
  };

  const currentCategoryList = suggestions?.categories?.[activeCategory] || [];

  return (
    <div className="w-[430px] max-w-[460px] bg-[#0D1117] border-r border-[#1E293B] flex flex-col h-full overflow-hidden text-slate-200 select-text">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#21262D] flex items-center justify-between bg-[#161B22]/95 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">Hermes Copilot</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                9ROUTER
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Đạo diễn AI & Huấn luyện viên Trading</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAzzamOpsOpen(true)}
            title="Mở Azzam Ops & Live Dashboard (8 Điểm Mù, Content Package, 62 Kịch Bản)"
            className="p-1.5 rounded-lg text-sky-400 hover:text-white hover:bg-sky-500/20 transition flex items-center gap-1 text-[11px] font-bold border border-sky-500/30 bg-sky-950/30 px-2"
          >
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Ops & Data</span>
          </button>
          <button
            onClick={() => setIsYouTubeAuditOpen(true)}
            title="Khám Kênh YouTube Live"
            className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition flex items-center gap-1"
          >
            <Youtube className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={() => setIsHermesChatOpen(true)}
            title="Mở rộng thành cửa sổ lớn (Modal)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262D] transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTool('templates')}
            title="Đóng thanh bên"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262D] transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Applied Banner Notification */}
      {appliedNotice && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400 font-medium flex items-center justify-between animate-in fade-in">
          <span>⚡ Đã nạp thành công lên điện thoại Canvas!</span>
          <button onClick={() => setAppliedNotice('')} className="text-emerald-300 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-3 min-h-0 text-xs">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono px-1">
                <span>{isUser ? '👤 Bạn' : '⚡ Hermes Agent'}</span>
              </div>

              <div
                className={`max-w-[94%] rounded-xl px-3 py-2 leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                    : 'bg-[#161B22] border border-[#30363D] text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Setup Action Card */}
                {m.setupPayload && (
                  <div className="mt-2.5 pt-2 border-t border-[#30363D] flex flex-col gap-2">
                    <div className="bg-[#0D1117] p-2.5 rounded-lg border border-amber-500/30 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-400 font-mono flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          CHỈ THỊ NẠP CANVAS
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {m.setupPayload.riskBudget ? `$${m.setupPayload.riskBudget} Risk` : 'Risk-First'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-white uppercase">
                        {m.setupPayload.headline}
                      </div>

                      <div className="text-[11px] text-slate-400 line-clamp-2">
                        {m.setupPayload.subline}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                        <span>SL: {m.setupPayload.slPips}p</span>
                        <span>•</span>
                        <span>Lot: {m.setupPayload.lotSize}</span>
                        <span>•</span>
                        <span>R:R 1:{m.setupPayload.rrRatio}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecuteSetup(m.setupPayload!)}
                      className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition active:scale-[0.98]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Áp Dụng Lên Canvas (1-Click)
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic px-2 py-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Hermes đang phân tích kịch bản & tính toán nến...
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggestion Chips & Category Tabs */}
      <div className="border-t border-[#21262D] bg-[#0A0D12] flex flex-col shrink-0">
        <div className="px-3 pt-2 pb-1 flex items-center gap-1 border-b border-[#1E293B] text-[10px] font-semibold overflow-x-auto scrollbar-none">
          {[
            { id: 'scripts' as const, label: '🎬 Kịch Bản' },
            { id: 'painpoints' as const, label: '📊 Nỗi Đau' },
            { id: 'courses' as const, label: '🎓 Khóa Học' },
            { id: 'live' as const, label: '🔴 Live Market' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2 py-0.5 rounded transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Suggestion Chips */}
        <div className="relative flex items-center px-2 py-1.5">
          <button
            onClick={() => scrollChips('left')}
            className="p-1 rounded bg-[#161B22] text-slate-400 hover:text-white shrink-0 mr-1"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          <div
            ref={chipsContainerRef}
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 scroll-smooth"
          >
            {currentCategoryList.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleSendMessage(chip.prompt)}
                className="px-2.5 py-1 rounded-lg bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] hover:border-amber-400/40 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition shrink-0 max-w-[280px] truncate text-left"
                title={chip.label}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollChips('right')}
            className="p-1 rounded bg-[#161B22] text-slate-400 hover:text-white shrink-0 ml-1"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-[#21262D] bg-[#161B22]/90 flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ra lệnh kịch bản, pain point, vốn $1000..."
            rows={2}
            className="flex-1 bg-[#0D1117] border border-[#30363D] focus:border-amber-400 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 outline-none resize-none transition"
          />

          <div className="flex flex-col gap-1.5">
            <button
              onClick={handlePasteClipboard}
              title="Dán từ Clipboard"
              className="p-2 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-slate-400 hover:text-white transition"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold disabled:opacity-40 transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* YouTube Live Channel Audit Modal */}
      <YouTubeAuditModal isOpen={isYouTubeAuditOpen} onClose={() => setIsYouTubeAuditOpen(false)} />
    </div>
  );
};

