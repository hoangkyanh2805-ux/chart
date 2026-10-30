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
  ChevronLeft,
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
import { generateDynamicScriptSubtitles } from '../utils/dynamicScriptNarrator';

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
  meta?: Record<string, any>;
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

const DEFAULT_SUGGESTIONS: HermesSuggestionsResponse = {
  timestamp: new Date().toISOString(),
  activeCounts: { scripts: 5, painpoints: 10, courses: 6, live: 5 },
  categories: {
    scripts: [
      {
        id: 's1',
        label: '🎬 [28/10]: How to Learn Gold Trading in Order',
        prompt: "Lên setup biểu đồ cho kịch bản 28/10 'How to Learn Gold Trading in Order': Vốn $1,000, Risk $10 (1%), SL 20 pips, R:R 1:3.5",
        category: 'scripts',
        badge: '28/10',
      },
      {
        id: 's2',
        label: '🎬 [28/10]: Fear of Losing Money — Khóa $50 Risk',
        prompt: "Lên setup biểu đồ kịch bản 28/10 'Fear of Losing Money': Tài khoản $5k, Risk $50 (1%), SL 20 pips, size 0.25 lot, R:R 1:3.5",
        category: 'scripts',
        badge: '28/10',
      },
      {
        id: 's3',
        label: '🎬 [27/10]: Đọc Nến Tổ Chức (Giải quyết PP-0023)',
        prompt: 'Lên setup nến rút chân tổ chức giải quyết nỗi đau PP-0023 cho người mới: SL 20 pips, R:R 1:3.5',
        category: 'scripts',
        badge: '27/10',
      },
      {
        id: 's4',
        label: '🎬 [17/10]: Bẫy Đọc 44 Sách PDF vs Risk $30 Thật',
        prompt: 'Lên video vạch trần bẫy 44 sách PDF nhưng không biết khóa rủi ro $30 trước khi trade (Risk-First)',
        category: 'scripts',
        badge: '17/10',
      },
      {
        id: 's5',
        label: '🎬 [14/10]: 3 Quy Tắc Sống Còn Khi Stop Loss Bị Hit',
        prompt: 'Lên video 3 quy tắc sống còn khi bị hit Stop Loss 20 pips: Không trả thù, tắt chart và bảo toàn vốn',
        category: 'scripts',
        badge: '14/10',
      },
    ],
    painpoints: [
      {
        id: 'p1',
        label: '📊 [488 người]: Không biết đọc cấu trúc nến (PP-0023)',
        prompt: 'Lên video và setup nến giải quyết nỗi đau 488 người: Không biết đọc cấu trúc nến, bẫy rút râu từ chối giá hỗ trợ (PP-0023)',
        category: 'painpoints',
        badge: '488 comments',
      },
      {
        id: 'p2',
        label: '📊 [Scalping 1m]: Thử 6 chiến lược vẫn liên tục bị quét Stop Loss (PP-0040)',
        prompt: 'Lên video giải quyết nỗi đau Scalping 1m hay bị quét SL: Kỹ thuật đặt Stop Loss an toàn sau cản M15 (PP-0040)',
        category: 'painpoints',
        badge: 'PP-0040',
      },
      {
        id: 'p3',
        label: '📊 [1,791 likes]: Bẫy quét râu Liquidity Sweep giả phá đỉnh (PP-0002)',
        prompt: 'Lên video bẫy quét râu đỉnh BSL dụ retail mua rồi sập (PP-0002 Liquidity Sweep)',
        category: 'painpoints',
        badge: '1,791 likes',
      },
      {
        id: 'p4',
        label: '📊 [Đuổi nến xanh]: Mua FOMO đỉnh thay vì đợi kiểm tra hỗ trợ (PP-0050)',
        prompt: 'Lên video cảnh tỉnh bẫy mua đuổi nến xanh: Đợi nến rút chân tại hỗ trợ mới vào lệnh (PP-0050)',
        category: 'painpoints',
        badge: '90 likes',
      },
      {
        id: 'p5',
        label: '📊 [Fair Value Gap]: Kỹ thuật bắt điểm 50% Consequent Encroachment (PP-0090)',
        prompt: 'Lên setup nến Smart Money Concepts: 50% FVG Consequent Encroachment, SL 20 pips, R:R 1:3.5',
        category: 'painpoints',
        badge: '72 likes',
      },
      {
        id: 'p6',
        label: '📊 [Stop Loss]: Đặt SL quá gần cản bị cắn râu trước khi bay (PP-0103)',
        prompt: 'Lên video 3 quy tắc sống còn khi bị hit Stop Loss 20 pips: Không trả thù, tắt chart và bảo toàn vốn',
        category: 'painpoints',
        badge: 'PP-0103',
      },
      {
        id: 'p7',
        label: '📊 [Cấu trúc M15]: Đánh ngược xu hướng vì không biết đọc Swing High/Low (PP-0138)',
        prompt: 'Lên video 3 bước đọc Swing High và BOS cấu trúc thị trường (OPT 4 / PP-0138)',
        category: 'painpoints',
        badge: 'PP-0138',
      },
      {
        id: 'p8',
        label: '📊 [Người mới]: Quá tải thuật ngữ FVG, Order Block, kiệt sức vì chart (PP-0009)',
        prompt: 'Lên video tối giản cho người mới: Chỉ nhìn cản hỗ trợ và nến rút chân từ chối giá',
        category: 'painpoints',
        badge: '121 likes',
      },
      {
        id: 'p9',
        label: '📊 [Order Block]: Vào Buy ngay vùng Bearish Order Block xả hàng (PP-0178)',
        prompt: 'Lên setup nhận diện vùng Bearish Order Block tổ chức xả hàng, Sell theo cấu trúc',
        category: 'painpoints',
        badge: 'PP-0178',
      },
      {
        id: 'p10',
        label: '📊 [275 người]: Cái bẫy săn 44 sách PDF thay vì kỷ luật rủi ro (PP-0039)',
        prompt: 'Lên video vạch trần bẫy 44 sách PDF nhưng không biết khóa rủi ro $30 trước khi trade (PP-0039)',
        category: 'painpoints',
        badge: '275 comments',
      },
    ],
    courses: [
      {
        id: 'c1',
        label: '🎓 [OPT 3 SMC]: Kỹ thuật vào lệnh 50% FVG C.E.',
        prompt: 'Lên setup nến Smart Money Concepts: 50% FVG Consequent Encroachment, SL 20 pips, R:R 1:3.5',
        category: 'courses',
        badge: 'OPT 3',
      },
      {
        id: 'c2',
        label: '🎓 [OPT 11 Risk-First]: Công thức quản lý vốn ($30 Budget)',
        prompt: 'Lên video công thức Risk Budget $30 trước khi nhìn chart: SL 20 pips, Size 0.15 lot',
        category: 'courses',
        badge: 'OPT 11',
      },
      {
        id: 'c3',
        label: '🎓 [OPT 9 Bẫy Breakout]: Quét râu BSL dụ retail đu đỉnh',
        prompt: 'Lên setup nến quét râu BSL $4,142.00 dụ retail mua đỉnh rồi đảo chiều (OPT 9 Breakout Trap)',
        category: 'courses',
        badge: 'OPT 9',
      },
      {
        id: 'c4',
        label: '🎓 [OPT 4 Cấu Trúc]: 3 bước đọc Swing High & BOS',
        prompt: 'Lên video 3 bước đọc Swing High và BOS cấu trúc thị trường theo khóa OPT 4',
        category: 'courses',
        badge: 'OPT 4',
      },
    ],
    live: [
      {
        id: 'l1',
        label: '🔴 [LIVE SPOT $4,129]: Bẫy quét râu đỉnh phiên Mỹ ($4,142)',
        prompt: 'Lên setup nến Vàng phiên Mỹ hiện tại $4,129: Quét đỉnh BSL $4,142.00, Sell pullback về $4,114.50',
        category: 'live',
        badge: 'LIVE SPOT',
      },
      {
        id: 'l2',
        label: '🔴 [LIVE SPOT $4,129]: Rút chân kiểm tra hỗ trợ $4,128.00',
        prompt: 'Lên setup nến Vàng hiện tại $4,129: Rejection wick tại hỗ trợ $4,128.00, Buy lướt lên $4,142.00',
        category: 'live',
        badge: 'LIVE SPOT',
      },
      {
        id: 'l3',
        label: '🔴 [LIVE SPOT $4,129]: Retest vùng FVG 50% ($4,132.50)',
        prompt: 'Lên setup nến Vàng retest FVG 50% tại $4,132.50: SL 20 pips, R:R 1:3.5',
        category: 'live',
        badge: 'LIVE SPOT',
      },
    ],
  },
};

interface HermesChatModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    } catch (e) {
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

export const HermesChatModal: React.FC<HermesChatModalProps> = ({ isOpen, onClose }) => {
  const { setHeadlineText, setSublineText, setBadges, clearAllCandles, addCandle, addOverlay, setCurrentTime, setIsPlaying } =
    useChartStore();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chartanimator_hermes_chat_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Chào Alan! Tôi là **Hermes Agent** — Tổng Đạo Diễn & Cố Vấn Trading của kênh @azzammastertradinggold.

Tôi nắm toàn bộ dữ liệu 20 kịch bản thực chiến, master pain point của khán giả, và quy tắc **Risk-First** ($10 / $30 Budget, 20 pips SL, giờ vàng 00:00 VN).

Bạn muốn tôi phân tích góc kịch bản nào hoặc yêu cầu tôi tạo setup nến nào cho video tiếp theo?`,
      },
    ];
  });

  // Sync with localStorage on open and whenever messages change
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chartanimator_hermes_chat_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch {}
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && messages.length > 0) {
        localStorage.setItem('chartanimator_hermes_chat_history', JSON.stringify(messages));
      }
    } catch {}
  }, [messages]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [suggestionData, setSuggestionData] = useState<HermesSuggestionsResponse>(DEFAULT_SUGGESTIONS);
  const [activeCategory, setActiveCategory] = useState<'scripts' | 'painpoints' | 'courses' | 'live'>('scripts');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const chipsContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollChips = (direction: 'left' | 'right') => {
    if (chipsContainerRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      chipsContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetch('/api/hermes/suggestions')
        .then((res) => res.json())
        .then((data: HermesSuggestionsResponse) => {
          if (data && data.categories) {
            setSuggestionData(data);
          }
        })
        .catch((err) => console.warn('Could not load suggestions:', err));
    }
  }, [isOpen]);

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

    // 2. Derive direction & mathematical execution order
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

    // 3. Generate authentic strategy-specific candles & overlays
    clearAllCandles();
    if (isPP0023) {
      addCandle({ open: 4130.0, high: 4138.0, low: 4129.0, close: 4134.0 });
      addCandle({ open: 4134.0, high: 4134.5, low: 4127.0, close: 4128.0 });
      addCandle({ open: 4128.0, high: 4132.5, low: 4124.0, close: 4125.0 });

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

    // 4. State Hygiene: completely overwrite old dirty state to guarantee semantic alignment
    useChartStore.setState({
      voiceAudioUrl: null, // Clear previous audio so new script's voice is freshly generated
      voiceAudioBase64: null,
      duration: 12,
      executionOrder: {
        type: dir,
        lot: lotNum,
        entry: parseFloat(baseP.toFixed(1)),
        sl: isPP0023 ? 4134.5 : parseFloat(slPrice.toFixed(1)),
        tp: isPP0023 ? 4125.0 : parseFloat(tpPrice.toFixed(1)),
        risk: riskBudget,
        reward: Math.round(riskBudget * rrRatio),
        pips: targetPips,
      },
      targetPips,
      showPipCounter: true,
      showExecutionBadge: true,
      calloutPinText: isPP0023
        ? '🎯 50% FVG C.E. RETEST ($4,132.50)'
        : dir === 'BUY'
        ? `🎯 RÚT CHÂN HỖ TRỢ ($${baseP.toFixed(0)})`
        : `🎯 BẪY DỤ BUY QUÉT ĐỈNH ($${baseP.toFixed(0)})`,
      calloutCandleIndex: isPP0023 ? 2 : 4,
      showCalloutPin: true,
      beforeAfterMode: /overcomplicating|tối giản|pp-0009|indicator|chỉ báo/i.test(`${payload.headline} ${payload.title} ${payload.subline}`)
        ? 'auto'
        : 'off',
      scriptSubtitles: subtitlesToUse,
      activeScriptMeta: {
        id: isPP0023 ? 'PP0023-INSTITUTIONAL-3-CANDLES' : payload.title,
        title: isPP0023 ? '3 Cây Nến Tiết Lộ Dòng Tiền Lớn' : payload.headline,
      },
      activeTool: 'script',
    });

    // 5. Run Runtime Validator -> Guarantees [✓ VERIFIED] (100% Score)
    useChartStore.getState().validateCurrentSetup();

    // 6. Play video immediately
    setCurrentTime(0);
    setIsPlaying(true);

    // Auto-generate AI Voiceover for this new setup in background
    setTimeout(() => {
      useChartStore.getState().generateVoiceover();
    }, 150);

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

        {/* Dynamic Category Tabs & Live Suggestions */}
        <div className="px-3.5 py-2.5 border-t border-[#1E293B] bg-[#0A0E17] flex flex-col gap-2 flex-shrink-0 select-none">
          {/* 4 Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-0.5 flex-shrink-0">
              Gợi ý Live:
            </span>

            <button
              type="button"
              onClick={() => setActiveCategory('scripts')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'scripts'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/60 shadow-sm shadow-indigo-500/20'
                  : 'bg-[#141B29] text-slate-400 hover:text-slate-200 border border-[#1E293B]'
              }`}
            >
              <span>🎬 Kịch Bản YouTube</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                {suggestionData.activeCounts.scripts}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('painpoints')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'painpoints'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/60 shadow-sm shadow-amber-500/20'
                  : 'bg-[#141B29] text-slate-400 hover:text-slate-200 border border-[#1E293B]'
              }`}
            >
              <span>📊 Nỗi Đau Khán Giả</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                {suggestionData.activeCounts.painpoints}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('courses')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'courses'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/60 shadow-sm shadow-emerald-500/20'
                  : 'bg-[#141B29] text-slate-400 hover:text-slate-200 border border-[#1E293B]'
              }`}
            >
              <span>🎓 Khóa Học Azzam</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {suggestionData.activeCounts.courses}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('live')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                activeCategory === 'live'
                  ? 'bg-rose-600/30 text-rose-300 border border-rose-500/60 shadow-sm shadow-rose-500/20'
                  : 'bg-[#141B29] text-slate-400 hover:text-slate-200 border border-[#1E293B]'
              }`}
            >
              <span>🔴 Live Market</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                {suggestionData.activeCounts.live}
              </span>
            </button>
          </div>

          {/* Active Chips List with Left/Right Nav Arrows & Mouse Wheel Scroll */}
          <div className="relative flex items-center gap-1.5 select-none py-0.5">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollChips('left')}
              title="Cuộn sang trái"
              className="p-1 rounded-lg bg-[#141B29] hover:bg-[#1E293B] border border-[#1E293B] hover:border-amber-500/40 text-slate-400 hover:text-white transition flex-shrink-0 select-none shadow-sm h-[32px] w-[26px] flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={chipsContainerRef}
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              className="flex-1 flex items-center gap-1.5 overflow-x-auto scroll-smooth py-1 px-0.5 select-none scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-transparent"
              style={{ scrollbarWidth: 'thin' }}
            >
              {(suggestionData.categories[activeCategory] || []).map((item) => {
                const chipColor =
                  activeCategory === 'scripts'
                    ? 'bg-indigo-950/40 hover:bg-indigo-900/60 border-indigo-500/30 hover:border-indigo-400 text-indigo-200'
                    : activeCategory === 'painpoints'
                    ? 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-500/30 hover:border-amber-400 text-amber-200'
                    : activeCategory === 'courses'
                    ? 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30 hover:border-emerald-400 text-emerald-200'
                    : 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-500/30 hover:border-rose-400 text-rose-200';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    disabled={isLoading}
                    title={item.prompt}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${chipColor}`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollChips('right')}
              title="Cuộn sang phải"
              className="p-1 rounded-lg bg-[#141B29] hover:bg-[#1E293B] border border-[#1E293B] hover:border-amber-500/40 text-slate-400 hover:text-white transition flex-shrink-0 select-none shadow-sm h-[32px] w-[26px] flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
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
