'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Search, Plus, Sparkles, Play, Clock, Flame, FileText, BookOpen } from 'lucide-react';
import { BriefImporterModal } from './BriefImporterModal';
import { CoursePainpointModal } from './CoursePainpointModal';
import { COURSE_PAINPOINT_PRESETS } from '../data/coursePainpointMatrix';

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  access: 'PRO' | 'CREATOR' | 'FREE';
  duration: number; // in seconds
  headline?: string;
  subline?: string;
  courseTag?: string;
  candleSetup?: {
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
}

const REAL_TEMPLATES: TemplateItem[] = [
  // 3 Dedicated Hexagold TikTok Viral Setups
  {
    id: 'hexagold-asia-sweep',
    title: '📱 [TikTok] Hexagold: Bẫy Quét Đỉnh Á XAUUSD',
    category: 'Top',
    access: 'CREATOR',
    duration: 6,
    headline: 'TẠI SAO BẠN THUA LỖ KHI BUY GOLD TẠI ĐỈNH?',
    subline: 'Bẫy Liquidity Sweep M15 & Điểm vào lệnh chuẩn SMC',
    courseTag: 'Hexagold TikTok',
  },
  {
    id: 'hexagold-cpi-dump',
    title: '📱 [TikTok] Hexagold: Cú Giật Râu Nến CPI',
    category: 'Top',
    access: 'PRO',
    duration: 6,
    headline: 'ĐỪNG GIAO DỊCH KHI TIN CPI VỪA RA!',
    subline: 'Chờ Judas Swing quét sạch thanh khoản rồi Retest FVG',
    courseTag: 'Hexagold TikTok',
  },
  {
    id: 'hexagold-risk-first-30',
    title: '📱 [TikTok] Hexagold: Bí Quyết Đặt SL $30',
    category: 'Top',
    access: 'CREATOR',
    duration: 6,
    headline: 'THE STOP LOSS CAME FIRST',
    subline: 'Quy tắc vàng sống còn: Risk Budget trước Entry',
    courseTag: 'Hexagold TikTok',
  },
  // Presets from Course + Pain Point Matrix
  ...COURSE_PAINPOINT_PRESETS.map((p) => ({
    id: p.id,
    title: `⚡ ${p.courseId}: ${p.hookHeadline}`,
    category: 'Course',
    access: 'CREATOR' as const,
    duration: p.duration,
    headline: p.hookHeadline,
    subline: p.hookSubline,
    courseTag: p.painPointId,
  })),
  {
    id: 'brief-risk-first-20261019',
    title: '🔥 Define Loss First (Brief A01)',
    category: 'Top',
    access: 'PRO',
    duration: 12,
    headline: 'THE STOP LOSS CAME FIRST',
    subline: 'The entry came second. That order is the whole video.',
  },
  {
    id: 't-1',
    title: 'Entry Checklist',
    category: 'ICT',
    access: 'PRO',
    duration: 10,
    headline: 'YOU STOP WATCHING THE SWEEP',
    subline: 'You start watching what happens after it',
  },
  {
    id: 't-2',
    title: 'ICT Reversal Pattern',
    category: 'ICT',
    access: 'CREATOR',
    duration: 12,
    headline: 'HOW BANKS MANIPULATE HIGHS',
    subline: 'Identify the displacement and wait for retest',
  },
  {
    id: 't-3',
    title: 'SMT Imbalance / FVG',
    category: 'ICT',
    access: 'PRO',
    duration: 8,
    headline: 'THE 50% C.E. SECRET ENTRY',
    subline: 'Fair Value Gaps are institutional magnets',
  },
  {
    id: 't-4',
    title: 'Break & Retest Model',
    category: 'Top',
    access: 'PRO',
    duration: 10,
    headline: 'CLEAN BREAK & RETEST ONLY',
    subline: 'Patience pays 1:3.5 Risk-to-Reward',
  },
  {
    id: 't-5',
    title: 'ICT Entry Trigger (CISD)',
    category: 'ICT',
    access: 'CREATOR',
    duration: 15,
    headline: 'CHANGE IN STATE OF DELIVERY',
    subline: 'The exact trigger high frequency funds use',
  },
  {
    id: 't-6',
    title: 'Failure To Displace Set Up',
    category: 'ICT',
    access: 'CREATOR',
    duration: 10,
    headline: 'FAILED BREAKOUT TRAP',
    subline: 'When retail buys breakouts, smart money dumps',
  },
  {
    id: 't-7',
    title: 'The Only 3 Order Blocks',
    category: 'Top',
    access: 'PRO',
    duration: 12,
    headline: 'STOP TRADING RANDOM BOXES',
    subline: 'Only valid with displacement & fair value gap',
  },
  {
    id: 't-8',
    title: 'SMC Liquidity Sweep',
    category: 'Crypto',
    access: 'PRO',
    duration: 8,
    headline: 'ASIAN RANGE LIQUIDITY PURGE',
    subline: 'London takes liquidity, NY delivers trend',
  },
  {
    id: 't-9',
    title: '2024 Trap Model',
    category: 'Top',
    access: 'CREATOR',
    duration: 14,
    headline: 'THE ULTIMATE INDUCEMENT TRAP',
    subline: 'Where stop losses become liquidity fuel',
  },
  {
    id: 't-10',
    title: 'Triple Tap Pattern',
    category: 'Forex',
    access: 'PRO',
    duration: 10,
    headline: '3-DRIVE LIQUIDITY SWEEP',
    subline: 'Classic smart money accumulation exhaustion',
  },
  {
    id: 't-11',
    title: 'ODZ Set Up (Discount Zone)',
    category: 'ICT',
    access: 'CREATOR',
    duration: 12,
    headline: 'BUY IN DEEP DISCOUNT',
    subline: 'Below 50% equilibrium Fibonacci level',
  },
  {
    id: 't-12',
    title: 'Double Bottom Liquidity Run',
    category: 'Crypto',
    access: 'FREE',
    duration: 8,
    headline: 'EQUAL LOWS ARE BAIT',
    subline: 'Never buy retail double bottoms blindly',
  },
  {
    id: 't-13',
    title: 'BOS Long Expansion',
    category: 'Top',
    access: 'PRO',
    duration: 10,
    headline: 'BREAK OF STRUCTURE RALLY',
    subline: 'Ride the institutional momentum wave',
  },
  {
    id: 't-14',
    title: 'Candle Mastery: OHLC',
    category: 'Forex',
    access: 'FREE',
    duration: 8,
    headline: 'READING EVERY TICK LIKE A PRO',
    subline: 'How wick rejection reveals institutional footprints',
  },
];

export const TemplateSidebar: React.FC = () => {
  const {
    setCandles,
    setOverlays,
    setBadges,
    setHeadlineText,
    setSublineText,
    setCurrentTime,
    setIsPlaying,
    addCandle,
    clearAllCandles,
    addOverlay,
  } = useChartStore();

  const [activeTab, setActiveTab] = useState<'library' | 'my_projects'>('library');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isBriefModalOpen, setIsBriefModalOpen] = useState<boolean>(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState<boolean>(false);

  const categories = ['All', 'Course', 'Top', 'ICT', 'Crypto', 'Forex'];

  const filtered = REAL_TEMPLATES.filter((t) => {
    const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleApplyTemplate = (t: TemplateItem) => {
    // 1. Check if matching in core TEMPLATES (including Hexagold TikTok Viral Templates)
    const { TEMPLATES } = require('../data/templates');
    const matchedCore = TEMPLATES?.find((tpl: any) => tpl.id === t.id);
    if (matchedCore) {
      useChartStore.getState().loadTemplate(matchedCore);
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    // 2. Check if this is a Course + Pain Point Preset
    const preset = COURSE_PAINPOINT_PRESETS.find((p) => p.id === t.id);
    if (preset) {
      setCandles(preset.candles);
      setOverlays(preset.overlays);
      setHeadlineText(preset.hookHeadline);
      setSublineText(preset.hookSubline);
      setBadges(preset.badges);
      useChartStore.setState({ duration: preset.duration || 10 });
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    if (t.headline) setHeadlineText(t.headline);
    if (t.subline) setSublineText(t.subline);

    // Apply template duration
    useChartStore.setState({ duration: t.duration || 10 });

    clearAllCandles();

    if (t.id === 'brief-risk-first-20261019') {
      // Setup from Google Drive Brief: Risk-First 3-Step Setup
      addCandle({ open: 4120.0, high: 4132.0, low: 4119.0, close: 4130.0 });
      addCandle({ open: 4130.0, high: 4131.0, low: 4123.0, close: 4124.5 });
      addCandle({ open: 4124.5, high: 4142.0, low: 4124.0, close: 4140.0 });
      addCandle({ open: 4140.0, high: 4141.0, low: 4128.0, close: 4129.0 }); // Pullback to support
      addCandle({ open: 4129.0, high: 4136.0, low: 4126.0, close: 4134.5 }); // Rejection entry
      addCandle({ open: 4134.5, high: 4148.0, low: 4133.5, close: 4146.0 }); // Target expansion

      addOverlay({
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 5,
        priceStart: 4128.0,
        priceEnd: 4128.0,
        color: '#38BDF8',
        label: 'Previous High Support ($4,128.00)',
      });

      addOverlay({
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: 4134.5,
        priceEnd: 4148.0,
        color: '#00F5A0',
        label: 'Risk Budget: $30 | Size: $1.50/pip',
      });
    } else {
      // Standard illustrative liquidity sweep candles
      addCandle({ open: 4125.0, high: 4134.0, low: 4124.0, close: 4133.0 });
      addCandle({ open: 4133.0, high: 4145.0, low: 4132.0, close: 4143.5 }); // Push High
      addCandle({ open: 4143.5, high: 4149.0, low: 4128.0, close: 4130.0 }); // SWEEP Wick & Sharp Rejection!
      addCandle({ open: 4130.0, high: 4132.0, low: 4118.0, close: 4120.0 }); // Displacement Down

      addOverlay({
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 2,
        priceStart: 4145.0,
        priceEnd: 4145.0,
        color: '#F59E0B',
        label: 'BSL Sweep Level ($4,145.00)',
      });
    }

    // Reset and start playing immediately!
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className="w-[300px] bg-[#0E1422] border-r border-[#1E293B] flex flex-col h-full text-slate-200 select-none flex-shrink-0 z-20">
      {/* Top Header & Tabs */}
      <div className="p-3 border-b border-[#1E293B] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-[#131B2A] p-0.5 rounded-lg border border-[#1E293B]">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                activeTab === 'library'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('my_projects')}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                activeTab === 'my_projects'
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Projects
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsCourseModalOpen(true)}
              title="Tạo video từ Khóa học Live & Nỗi đau khán giả"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>KHÓA HỌC</span>
            </button>
            <button
              onClick={() => setIsBriefModalOpen(true)}
              title="Dán Brief tạo Video tự động cho Editor"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition shadow-sm"
            >
              <FileText className="w-3 h-3 text-emerald-400" />
              <span>+ BRIEF</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-[#121927] border border-[#1E293B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 transition ${
                selectedCategory === c
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-[#141C2B] text-slate-400 hover:text-white border border-[#1E293B]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Template Grid */}
      <div className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1E293B]">
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="group bg-[#121927] hover:bg-[#162032] border border-[#1E293B] hover:border-indigo-500/50 rounded-xl p-2 flex flex-col justify-between transition-all shadow-sm hover:shadow-indigo-500/10 cursor-pointer"
            >
              {/* Graphic Thumbnail Placeholder */}
              <div className="relative w-full h-16 bg-[#090D16] rounded-lg border border-[#1E293B] flex items-center justify-center overflow-hidden mb-2">
                {/* Mini Candlestick Graphic Representation */}
                <div className="flex items-end gap-1.5 h-10">
                  <div className="w-2 h-6 bg-emerald-500 rounded-sm relative">
                    <div className="w-[1px] h-9 bg-emerald-500 absolute -top-1.5 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="w-2 h-8 bg-emerald-500 rounded-sm relative">
                    <div className="w-[1px] h-11 bg-emerald-500 absolute -top-1.5 left-1/2 -translate-x-1/2" />
                  </div>
                  <div className="w-2.5 h-5 bg-rose-500 rounded-sm relative shadow-sm">
                    {/* Sweep Wick */}
                    <div className="w-[1.5px] h-12 bg-amber-400 absolute -top-4 left-1/2 -translate-x-1/2" />
                  </div>
                </div>

                {/* Badge Tag */}
                <span
                  className={`absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.2 rounded-full border ${
                    t.access === 'CREATOR'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : t.access === 'PRO'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {t.access}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[11px] font-bold text-slate-200 line-clamp-1 group-hover:text-white transition">
                {t.title}
              </h3>

              {/* Actions Row: USE Button & Duration */}
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#1E293B]/60">
                <button
                  onClick={() => handleApplyTemplate(t)}
                  className="px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white flex items-center gap-1 shadow-sm transition active:scale-95"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>USE</span>
                </button>

                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{t.duration}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brief-to-Video Modal */}
      <BriefImporterModal
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
      />

      {/* Course & Pain Point Video Generator Modal */}
      <CoursePainpointModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
      />
    </div>
  );
};
