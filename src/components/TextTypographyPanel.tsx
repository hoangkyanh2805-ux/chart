'use client';

import React from 'react';
import { useChartStore } from '../store/useChartStore';
import {
  Type,
  Sparkles,
  Palette,
  Sliders,
  AlignLeft,
  AlignCenter,
  Wand2,
  Zap,
  Bookmark,
  Check,
  Flame,
  ShieldCheck,
} from 'lucide-react';

const FONT_OPTIONS = [
  { id: 'Montserrat', name: 'Montserrat (Viral Shorts)', category: 'Sans-Serif' },
  { id: 'Inter', name: 'Inter (Clean Institutional)', category: 'Modern' },
  { id: 'Oswald', name: 'Oswald (Tall YouTube Punch)', category: 'Condensed' },
  { id: 'Space Grotesk', name: 'Space Grotesk (Fintech / Web3)', category: 'Display' },
  { id: 'Cinzel', name: 'Cinzel (Luxury Forex Gold)', category: 'Serif' },
  { id: 'monospace', name: 'JetBrains / Terminal Code', category: 'Mono' },
];

const HOOK_PRESETS = [
  {
    category: 'Risk-First',
    headline: 'THE STOP LOSS CAME FIRST',
    subline: 'The entry came second. That is why 90% fail.',
    color: '#00F5A0',
  },
  {
    category: 'PDF Trap',
    headline: "A PDF WON'T KEEP YOU ALIVE",
    subline: 'A predefined loss limit will. Stop collecting books.',
    color: '#F59E0B',
  },
  {
    category: 'FVG 50% CE',
    headline: 'THE 50% FVG ENTRY SECRET',
    subline: 'Never chase green candles. Wait for the 50% CE magnet.',
    color: '#38BDF8',
  },
  {
    category: 'BSL Sweep',
    headline: 'YOU STOP WATCHING THE SWEEP',
    subline: 'You start watching what institutions do after it.',
    color: '#FF3366',
  },
  {
    category: 'Break & Retest',
    headline: 'CLEAN BREAK & RETEST ONLY',
    subline: 'Patience pays the highest institutional reward.',
    color: '#A855F7',
  },
];

const COLOR_PRESETS = [
  { name: 'Pure White', hex: '#FFFFFF', glow: 'rgba(255,255,255,0.4)' },
  { name: 'Forex Gold', hex: '#FDE047', glow: 'rgba(253,224,71,0.4)' },
  { name: 'Cyber Cyan', hex: '#38BDF8', glow: 'rgba(56,189,248,0.4)' },
  { name: 'Emerald Bull', hex: '#00F5A0', glow: 'rgba(0,245,160,0.4)' },
  { name: 'Warning Rose', hex: '#FB7185', glow: 'rgba(251,113,133,0.4)' },
];

export const TextTypographyPanel: React.FC = () => {
  const {
    headlineText,
    setHeadlineText,
    sublineText,
    setSublineText,
    badges,
    setBadges,
    settings,
    updateSettings,
    stageTheme,
    setStageTheme,
  } = useChartStore();

  const handleApplyPreset = (preset: typeof HOOK_PRESETS[0]) => {
    setHeadlineText(preset.headline);
    setSublineText(preset.subline);
    updateSettings({ bannerTextColor: preset.color });
  };

  return (
    <div className="w-80 h-full bg-[#0D121D] border-r border-[#1E293B] flex flex-col text-slate-200 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#111726]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">
              Text & Typography Studio
            </h3>
            <p className="text-[10px] text-slate-400">Trình biên tập chữ & Hook trực tiếp</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          LIVE SYNC
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Section 1: Headline Hook & Subline Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <span>Tiêu Đề Hook (0 - 3s)</span>
              <span className="text-[9px] font-mono text-amber-400 font-normal">MAX 6 WORDS</span>
            </label>
            <span className="text-[10px] font-mono text-slate-500">
              {headlineText.length} chars
            </span>
          </div>

          <textarea
            value={headlineText}
            onChange={(e) => setHeadlineText(e.target.value.toUpperCase())}
            rows={2}
            placeholder="NHẬP TIÊU ĐỀ HOOK..."
            className="w-full bg-[#141B29] border border-[#1E293B] rounded-xl px-3 py-2 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition resize-none uppercase"
          />

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">Phụ Đề (Subline):</label>
            <input
              type="text"
              value={sublineText}
              onChange={(e) => setSublineText(e.target.value)}
              placeholder="Nhập giải thích ngắn gọn..."
              className="w-full bg-[#141B29] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Section 2: 1-Click Viral Hook Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Mẫu Hook Giữ Chân Thực Chiến</span>
          </label>
          <div className="space-y-1.5">
            {HOOK_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="w-full p-2 rounded-xl bg-[#141B29] hover:bg-[#1A2335] border border-[#1E293B] hover:border-amber-500/40 text-left transition group flex flex-col gap-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-1 rounded bg-black/40 text-slate-400 font-bold">
                    {p.category}
                  </span>
                  <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition">
                    Dùng mẫu →
                  </span>
                </div>
                <div className="font-bold text-white text-[11px] truncate">
                  "{p.headline}"
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Font Family Picker */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-indigo-400" />
            <span>Phông Chữ Video (Typography)</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {FONT_OPTIONS.map((f) => {
              const isSelected = (settings.fontFamily || 'Montserrat') === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateSettings({ fontFamily: f.id })}
                  className={`p-2 rounded-xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                      : 'bg-[#141B29] border-[#1E293B] text-slate-400 hover:text-white hover:bg-[#1A2335]'
                  }`}
                >
                  <span style={{ fontFamily: f.id }} className="text-xs">
                    {f.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Color Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>Màu Chữ & Ánh Sáng (Text Glow)</span>
          </label>
          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => updateSettings({ bannerTextColor: c.hex })}
                title={c.name}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition hover:scale-110"
                style={{ backgroundColor: c.hex }}
              >
                {settings.bannerTextColor === c.hex && (
                  <Check className="w-4 h-4 text-black drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: Stepper Badges Editor */}
        <div className="space-y-2 border-t border-[#1E293B] pt-4">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>3 Bước Stepper Badges Dưới Đáy</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">Bước 1 (Đỏ - Rủi Ro):</span>
              <input
                type="text"
                value={badges[0] || '1. LOSS $30'}
                onChange={(e) => setBadges([e.target.value, badges[1], badges[2]])}
                className="w-full bg-[#141B29] border border-rose-500/30 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 font-mono font-bold focus:outline-none focus:border-rose-400"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">Bước 2 (Xanh Dương - Cắt Lỗ):</span>
              <input
                type="text"
                value={badges[1] || '2. ENTRY SL 20p'}
                onChange={(e) => setBadges([badges[0], e.target.value, badges[2]])}
                className="w-full bg-[#141B29] border border-sky-500/30 rounded-lg px-2.5 py-1.5 text-xs text-sky-300 font-mono font-bold focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono block">Bước 3 (Xanh Lá - Khối Lượng):</span>
              <input
                type="text"
                value={badges[2] || '3. SIZE $1.5'}
                onChange={(e) => setBadges([badges[0], badges[1], e.target.value])}
                className="w-full bg-[#141B29] border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
