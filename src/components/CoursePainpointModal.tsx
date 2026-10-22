'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { COURSE_PAINPOINT_PRESETS, CoursePainPointPreset } from '../data/coursePainpointMatrix';
import {
  Sparkles,
  BookOpen,
  AlertTriangle,
  Play,
  X,
  CheckCircle,
  Copy,
  Layers,
  Flame,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CoursePainpointModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    setCandles,
    setOverlays,
    setHeadlineText,
    setSublineText,
    setBadges,
    setCurrentTime,
    setIsPlaying,
  } = useChartStore();

  const [selectedPreset, setSelectedPreset] = useState<CoursePainPointPreset>(
    COURSE_PAINPOINT_PRESETS[0]
  );
  const [activeTab, setActiveTab] = useState<'presets' | 'custom_builder'>('presets');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Custom Builder State
  const [customCourse, setCustomCourse] = useState<string>('OPT 3');
  const [customPainPoint, setCustomPainPoint] = useState<string>('PP-PDF-TRAP');

  if (!isOpen) return null;

  const handleApplyPreset = (preset: CoursePainPointPreset) => {
    // 1. Update Candles
    setCandles(preset.candles);

    // 2. Update Overlays
    setOverlays(preset.overlays);

    // 3. Update Text and Badges
    setHeadlineText(preset.hookHeadline);
    setSublineText(preset.hookSubline);
    setBadges(preset.badges);

    // 4. Reset Timeline & Start Playing
    setCurrentTime(0);
    setIsPlaying(true);

    onClose();
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0E1422] border border-[#1E293B] rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#121927]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/30 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Ma Trận Nội Dung: Khóa Học + Nỗi Đau Khán Giả</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Hermes Matrix Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Chuyển hóa 11 Khóa học Live (Azzam Academy) và Master Pain Points thành biểu đồ nến & kịch bản Video Viral
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Switcher */}
            <div className="flex items-center bg-[#090D16] p-1 rounded-xl border border-[#1E293B]">
              <button
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'presets'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mẫu Thực Chiến (Presets)
              </button>
              <button
                onClick={() => setActiveTab('custom_builder')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  activeTab === 'custom_builder'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Phối Hợp Tự Do (Builder)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        {activeTab === 'presets' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column: Preset List */}
            <div className="w-[380px] border-r border-[#1E293B] overflow-y-auto p-4 flex flex-col gap-3 bg-[#0B0F19]">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                Chọn Chiến Thuật Khóa Học & Nỗi Đau:
              </div>

              {COURSE_PAINPOINT_PRESETS.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#151D2E] border-amber-500/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                        : 'bg-[#101624] border-[#1E293B] hover:border-slate-600 hover:bg-[#131B2B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {preset.courseId}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{preset.painPointId}</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 line-clamp-1 mb-1">
                      {preset.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 italic line-clamp-1 mb-2">
                      "{preset.painPointQuote}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5">
                      <span className="font-mono text-amber-400/90 font-bold">
                        {preset.strategy}
                      </span>
                      <span className="text-slate-400">{preset.duration}s Short</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Detail View & Script */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between bg-[#0E1422]">
              <div className="flex flex-col gap-5">
                {/* Header of selected preset */}
                <div className="p-4 rounded-xl bg-[#121927] border border-[#1E293B] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-300">
                        {selectedPreset.courseTitle}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Bài học: {selectedPreset.lessonFocus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <Flame className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-rose-300">
                      Giải quyết nỗi đau: {selectedPreset.painPointName}
                    </span>
                  </div>
                </div>

                {/* Banner & Badges Preview */}
                <div className="flex flex-col gap-2">
                  <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Banner Hook & Subline Hiển Thị Trên Video (0 - 3s):
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 flex flex-col gap-1.5">
                    <div className="text-sm font-black text-amber-300 tracking-wide uppercase">
                      {selectedPreset.hookHeadline}
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {selectedPreset.hookSubline}
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                      {selectedPreset.badges.map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white border border-white/15"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Video Script Breakdown */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                      Kịch Bản Lời Thoại Video (Voiceover Script):
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `HOOK (0-3s): ${selectedPreset.script.hook}\n\nTENSION (3-15s): ${selectedPreset.script.tension}\n\nPAYOFF (15-25s): ${selectedPreset.script.payoff}\n\nCTA (25-30s): ${selectedPreset.script.cta}`,
                          'full_script'
                        )
                      }
                      className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      {copiedSection === 'full_script' ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Chép Kịch Bản</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Hook 0-3s */}
                    <div className="p-3 rounded-xl bg-[#141C2B] border border-amber-500/30 flex flex-col gap-1">
                      <div className="text-[10px] font-mono text-amber-400 font-bold flex items-center justify-between">
                        <span>1. HOOK TẠO TENSION (0 - 3s) — Tỉ lệ giữ chân quyết định ở đây:</span>
                        <span>0:00 - 0:03</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                        "{selectedPreset.script.hook}"
                      </p>
                    </div>

                    {/* Tension 3-15s */}
                    <div className="p-3 rounded-xl bg-[#141C2B] border border-slate-700/60 flex flex-col gap-1">
                      <div className="text-[10px] font-mono text-sky-400 font-bold flex items-center justify-between">
                        <span>2. BUILD TENSION & VẠCH TRẦN NỖI ĐAU (3 - 15s):</span>
                        <span>0:03 - 0:15</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {selectedPreset.script.tension}
                      </p>
                    </div>

                    {/* Payoff 15-25s */}
                    <div className="p-3 rounded-xl bg-[#141C2B] border border-emerald-500/30 flex flex-col gap-1">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold flex items-center justify-between">
                        <span>3. PAYOFF VÀ BẰNG CHỨNG BIỂU ĐỒ (15 - 25s):</span>
                        <span>0:15 - 0:25</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {selectedPreset.script.payoff}
                      </p>
                    </div>

                    {/* CTA 25-30s */}
                    <div className="p-3 rounded-xl bg-[#141C2B] border border-indigo-500/30 flex flex-col gap-1">
                      <div className="text-[10px] font-mono text-indigo-400 font-bold flex items-center justify-between">
                        <span>4. LỜI KÊU GỌI HÀNH ĐỘNG KỶ LUẬT (25 - 30s):</span>
                        <span>0:25 - 0:30</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {selectedPreset.script.cta}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>
                    Bao gồm {selectedPreset.candles.length} nến OHLC + {selectedPreset.overlays.length} chỉ báo cấu trúc thị trường
                  </span>
                </div>

                <button
                  onClick={() => handleApplyPreset(selectedPreset)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Nạp Toàn Bộ Nến & Kịch Bản Lên Canvas</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Custom Builder Tab */
          <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center bg-[#090D16]">
            <div className="max-w-xl w-full bg-[#121927] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col gap-5">
              <div className="text-center">
                <h3 className="text-base font-extrabold text-white mb-1">
                  Phối Hợp Tùy Biến: Khóa Học + Nỗi Đau
                </h3>
                <p className="text-xs text-slate-400">
                  Chọn 1 khóa học bất kỳ từ Azzam Academy và 1 nỗi đau khán giả để Hermes tự động ghép nối
                </p>
              </div>

              {/* Course Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  1. CHỌN KHÓA HỌC AZZAM ACADEMY:
                </label>
                <select
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  className="w-full bg-[#1A2333] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="OPT 3">OPT 3: Advanced SMC — Fair Value Gap & Liquidity (Jayce Pham)</option>
                  <option value="OPT 11">OPT 11: The Complete Foundation FOREX — Risk Budget & SL</option>
                  <option value="OPT 4">OPT 4: Market Structure Bootcamp 2026 — BOS & CHoCH</option>
                  <option value="OPT 9">OPT 9: Key Level Strategy 2026 — Liquidity Sweep</option>
                  <option value="OPT 1">OPT 1: Multiple Timeframe Theory — Top-Down Analysis</option>
                  <option value="OPT 8">OPT 8: Day Trading Scalping — Low Risk High Return</option>
                </select>
              </div>

              {/* Pain Point Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-bold text-slate-300">
                  2. CHỌN NỖI ĐAU KHÁN GIẢ (AUDIENCE PAIN POINT):
                </label>
                <select
                  value={customPainPoint}
                  onChange={(e) => setCustomPainPoint(e.target.value)}
                  className="w-full bg-[#1A2333] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="PP-PDF-TRAP">PP-PDF-TRAP: Cái bẫy sưu tầm 44 PDF nhưng không dám cắt lỗ</option>
                  <option value="PP-0039">PP-0039: Mất $62,000 vì gồng lỗ và vào lot bừa bãi</option>
                  <option value="PP-0023">PP-0023: Không biết đọc biểu đồ nến, thấy nến nhảy loạn xạ</option>
                  <option value="PP-FOMO-BREAKOUT">PP-FOMO: Đu nến xanh Breakout bị quét râu cắt lỗ</option>
                  <option value="PP-0020">PP-0020: "Nhìn chart quá khứ thì nói gì chả đúng"</option>
                </select>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    // Match closest preset or generate
                    const match =
                      COURSE_PAINPOINT_PRESETS.find(
                        (p) => p.courseId === customCourse || p.painPointId === customPainPoint
                      ) || COURSE_PAINPOINT_PRESETS[0];
                    handleApplyPreset(match);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo Video & Biểu Đồ Nến Ngay Lập Tức</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
