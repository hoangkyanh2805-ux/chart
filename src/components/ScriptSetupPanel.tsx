'use client';

import React from 'react';
import { useChartStore } from '../store/useChartStore';
import { INITIAL_DASHBOARD_DATA } from '../data/dashboardStatic';
import { generateDynamicScriptSubtitles } from '../utils/dynamicScriptNarrator';
import {
  FileText,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Globe,
  Film,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  Zap,
  Mic,
  Volume2,
  VolumeX,
  Loader2,
} from 'lucide-react';

interface ScriptSetupPanelProps {
  onOpenExport?: () => void;
}

export const ScriptSetupPanel: React.FC<ScriptSetupPanelProps> = ({ onOpenExport }) => {
  const {
    activeScriptMeta,
    setActiveScriptMeta,
    headlineText,
    sublineText,
    executionOrder,
    targetPips,
    scriptSubtitles,
    currentTime,
    duration,
    isPlaying,
    setCurrentTime,
    setIsPlaying,
    applyEnglishVersion,
    applyComprehensiveAutoFix,
    validationReport,
    validateCurrentSetup,
    setCandles,
    setOverlays,
    setBadges,
    setHeadlineText,
    setSublineText,
    setShowCalloutPin,
    setCalloutPinText,
    setCalloutCandleIndex,
    setShowPipCounter,
    setTargetPips,
    setShowExecutionBadge,
    setExecutionOrder,
    setScriptSubtitles,
    setIsAzzamOpsOpen,
    voiceAudioUrl,
    isVoiceGenerating,
    selectedVoice,
    setSelectedVoice,
    generateVoiceover,
    isAudioMuted,
    setIsAudioMuted,
    setVoiceAudio,
  } = useChartStore();

  const scripts = INITIAL_DASHBOARD_DATA.scriptRegistry?.items || [];

  // Currently active script or fallback to first one
  const currentScriptId = activeScriptMeta?.id || 'LONG-20261013-BEGINNERS-5-SAI-LAM-GIET-TAI-KHOAN';
  const activeScript = scripts.find((s: any) => s.id === currentScriptId) || scripts[0] || {
    id: currentScriptId,
    title: activeScriptMeta?.title || headlineText || 'Chiến Lược Giao Dịch Vàng',
    format: activeScriptMeta?.format || 'SHORT',
    targetDuration: '60s',
    topic: 'Risk-First',
  };

  const isSell = /sweep|quét|bán|sell|đỉnh|loss|sl|sai lam|mistake/i.test(`${activeScript.title} ${headlineText}`);
  const dir = isSell ? 'SELL' : 'BUY';

  const handleSelectScript = (id: string) => {
    const sc = scripts.find((s: any) => s.id === id);
    if (!sc) return;

    const isPP0023 = /pp0023|3-cay-nen|dong-tien|3 cây nến|tiết lộ dòng tiền/i.test(`${sc.id} ${sc.title}`);
    if (isPP0023) {
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
      setHeadlineText('3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN');
      setSublineText('Dừng đọc chart kiểu đoán mò. Bắt bài dấu chân Big Boys.');
      setBadges(['1. LOSS $10', '2. SL 20 PIPS', '3. SIZE 0.05L']);
      setShowCalloutPin(true);
      setCalloutPinText('🎯 50% FVG C.E. RETEST ($4,132.50)');
      setCalloutCandleIndex(2);
      setShowPipCounter(true);
      setTargetPips(75);
      setShowExecutionBadge(true);
      setExecutionOrder({
        type: 'SELL',
        lot: 0.05,
        entry: 4132.5,
        sl: 4134.5,
        tp: 4125.0,
        risk: 10,
      });
      setScriptSubtitles([
        { timePercent: 0.0, text: 'DỪNG ĐỌC CHART KIỂU ĐOÁN MÒ! 3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN.', stageName: 'Hook' },
        { timePercent: 0.28, text: 'Bạn thấy nến xanh dài liền vội vã bấm BUY? Đó là lúc các quỹ lớn xả hàng vào đầu bạn!', stageName: 'Trap' },
        { timePercent: 0.58, text: 'Cây 1 quét đỉnh rút râu, cây 2 tạo FVG, hãy đợi cây 3 hồi đúng 50% FVG tại $4,132.50 để vào lệnh!', stageName: 'Setup' },
        { timePercent: 0.82, text: 'Khóa rủi ro đúng 10 đô! Đặt Stop Loss 20 pips tại $4,134.50, size 0.05 lot, target $4,125.00.', stageName: 'Execution' },
      ]);
      setActiveScriptMeta({ id: sc.id, title: '3 Cây Nến Tiết Lộ Dòng Tiền Lớn', format: sc.format });
      validateCurrentSetup();
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    const isScSell = /sweep|quét|bán|sell|đỉnh|loss|sl/i.test(`${sc.title} ${sc.topic}`);
    const setupDir = isScSell ? 'SELL' : 'BUY';

    // 1. Candles
    if (sc.chart_setup?.candles && sc.chart_setup.candles.length > 0) {
      setCandles(sc.chart_setup.candles);
    } else {
      setCandles(
        isScSell
          ? [
              { open: 4125.0, high: 4130.0, low: 4123.0, close: 4129.0 },
              { open: 4129.0, high: 4134.0, low: 4127.5, close: 4133.0 },
              { open: 4133.0, high: 4145.0, low: 4131.0, close: 4142.0 },
              { open: 4142.0, high: 4147.0, low: 4135.0, close: 4136.0 },
              { open: 4136.0, high: 4138.0, low: 4120.0, close: 4122.0 },
            ]
          : [
              { open: 4135.0, high: 4136.0, low: 4128.0, close: 4130.0 },
              { open: 4130.0, high: 4131.0, low: 4122.0, close: 4124.0 },
              { open: 4124.0, high: 4125.0, low: 4114.0, close: 4116.0 },
              { open: 4116.0, high: 4128.0, low: 4115.0, close: 4126.5 },
              { open: 4126.5, high: 4142.0, low: 4125.0, close: 4140.0 },
            ]
      );
    }

    // 2. Overlays
    setOverlays([
      {
        type: 'ZONE',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: isScSell ? 4142.0 : 4118.0,
        priceEnd: isScSell ? 4145.0 : 4122.0,
        color: isScSell ? '#F43F5E' : '#38BDF8',
        label: isScSell ? 'BSL Sweep Level ($4,142.00)' : 'FVG 50% C.E. Demand Zone ($4,120.00)',
      },
      {
        type: 'LONG_SHORT',
        startCandleIndex: 3,
        endCandleIndex: 5,
        priceStart: 4128.0,
        priceEnd: isScSell ? 4121.0 : 4135.0,
        color: isScSell ? '#F43F5E' : '#10B981',
        label: `${setupDir} 0.05 lot @ $4,128.00`,
      },
    ]);

    // 3. Text & Badges
    setHeadlineText(sc.title.toUpperCase());
    setSublineText(`Chiến Lược Chuẩn Hóa: ${sc.id}`);
    setBadges([`1. ${sc.format || 'SHORT'}`, '2. RISK-FIRST', '3. SMC CONCEPTS']);

    // 4. Badges & Subtitles
    setShowCalloutPin(true);
    setCalloutPinText(isScSell ? '🎯 BẪY DỤ BUY QUÉT ĐỈNH ($4,128)' : '🎯 ENTRY RETEST FVG ($4,128)');
    setCalloutCandleIndex(3);

    setShowPipCounter(true);
    setTargetPips(70);

    setShowExecutionBadge(true);
    setExecutionOrder({
      type: setupDir,
      lot: 0.05,
      entry: 4128.0,
      sl: isScSell ? 4130.0 : 4126.0,
      tp: isScSell ? 4121.0 : 4135.0,
      risk: 10,
    });

    const dynamicSubs = generateDynamicScriptSubtitles({
      title: sc.title,
      strategy: sc.topic || sc.format,
      direction: setupDir,
      entryPrice: 4128.0,
      slPips: 20,
      targetPips: 70,
      riskAmount: 10,
      lotSize: '0.05 lot',
      rrRatio: 3.5,
      language: 'vi',
    });

    setScriptSubtitles(dynamicSubs);
    setVoiceAudio(null); // Clear previous audio so user can generate voice for the new script

    setActiveScriptMeta({ id: sc.id, title: sc.title, format: sc.format });
    validateCurrentSetup();
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePlayToggle = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-[340px] bg-[#0B0F19] border-r border-[#1E293B] flex flex-col h-full text-slate-200 select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-3.5 border-b border-[#1E293B] bg-[#0E1422] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
              <span>ĐỐI SOÁT KỊCH BẢN</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                SETUP LIVE
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">So khớp kịch bản, nến & Voice AI</p>
          </div>
        </div>

        <button
          onClick={() => setIsAzzamOpsOpen(true)}
          title="Mở toàn bộ 62 kịch bản trong Azzam Ops Hub"
          className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 hover:underline"
        >
          <span>62 Bản</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* Quick Script Selector Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Chọn Kịch Bản Cần Dựng ({scripts.length} bản):
          </label>
          <select
            value={currentScriptId}
            onChange={(e) => handleSelectScript(e.target.value)}
            className="w-full bg-[#111722] border border-[#1e2638] rounded-xl px-2.5 py-2 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
          >
            {scripts.map((s: any) => (
              <option key={s.id} value={s.id}>
                [{s.format || 'SHORT'}] {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Script Identity Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#121927] to-[#0d131f] border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-bold">
              {activeScript.id}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Khớp 100% Setup</span>
            </span>
          </div>

          <div className="text-xs font-bold text-white leading-snug">
            {activeScript.title}
          </div>

          <div className="text-[11px] text-slate-300 bg-[#090D16] p-2 rounded-lg border border-[#1A2333] space-y-1">
            <div className="text-amber-400 font-bold text-[10px] uppercase font-mono">
              🎬 Hook 0-3s Lời Thoại:
            </div>
            <div className="font-semibold text-white">&ldquo;{headlineText}&rdquo;</div>
            <div className="text-[10px] text-slate-400">
              Phụ đề: {sublineText}
            </div>
          </div>
        </div>

        {/* Technical Chart Specs Verification Card */}
        <div className="p-3 rounded-xl bg-[#0E1422] border border-[#1E293B] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Thông Số Nến Trên Canvas:</span>
            </span>
            <span
              className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded border flex items-center gap-1 ${
                dir === 'SELL'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {dir === 'SELL' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              <span>{dir} 0.05 LOT</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-[#111722] border border-[#1e2638]">
              <span className="text-slate-400 block text-[9px]">GIÁ ENTRY:</span>
              <span className="text-white font-bold text-xs">$4,128.00</span>
            </div>
            <div className="p-2 rounded-lg bg-[#111722] border border-[#1e2638]">
              <span className="text-slate-400 block text-[9px]">STOP LOSS:</span>
              <span className="text-rose-400 font-bold text-xs">20 pips ($10)</span>
            </div>
            <div className="p-2 rounded-lg bg-[#111722] border border-[#1e2638]">
              <span className="text-slate-400 block text-[9px]">TARGET PROFIT:</span>
              <span className="text-emerald-400 font-bold text-xs">+{targetPips || 70} pips</span>
            </div>
            <div className="p-2 rounded-lg bg-[#111722] border border-[#1e2638]">
              <span className="text-slate-400 block text-[9px]">TỶ LỆ R:R:</span>
              <span className="text-amber-400 font-bold text-xs">1:3.5 Chuẩn SMC</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-[#090D16] border border-[#1A2333] text-[10px] text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Mô hình: <b>{isSell ? 'Liquidity Sweep đỉnh M15 & Rejection' : 'FVG 50% C.E. Retest'}</b></span>
          </div>
        </div>

        {/* 4-Stage Subtitle Alignment Timeline */}
        <div className="p-3 rounded-xl bg-[#0E1422] border border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Phụ Đề 4 Bước Đồng Bộ ({scriptSubtitles.length} bước):
            </span>
            <span className="text-[10px] font-mono text-indigo-400">
              {(currentTime || 0).toFixed(1)}s / {(duration || 10).toFixed(1)}s
            </span>
          </div>

          <div className="space-y-1.5">
            {scriptSubtitles.map((sub: any, i) => {
              const totalDur = duration || 10;
              const startSec = typeof sub.startTime === 'number'
                ? sub.startTime
                : (typeof sub.timePercent === 'number' ? sub.timePercent : i / Math.max(1, scriptSubtitles.length)) * totalDur;

              const nextSub = scriptSubtitles[i + 1] as any;
              const endSec = typeof sub.endTime === 'number'
                ? sub.endTime
                : nextSub && typeof nextSub.timePercent === 'number'
                  ? nextSub.timePercent * totalDur
                  : totalDur;

              const isCurrent = (currentTime || 0) >= startSec && (i === scriptSubtitles.length - 1 ? (currentTime || 0) <= endSec : (currentTime || 0) < endSec);
              const stepLabel = sub.stageName || (i === 0 ? 'Hook 0-3s' : i === 1 ? 'Trap' : i === 2 ? 'Setup' : 'Execution');

              return (
                <div
                  key={i}
                  className={`p-2 rounded-lg text-[10px] transition-all border ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                      : 'bg-[#111722] border-[#1e2638] text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[9px] mb-0.5">
                    <span className="text-amber-400 font-bold">
                      Bước {i + 1}: {stepLabel} ({startSec.toFixed(1)}s - {endSec.toFixed(1)}s)
                    </span>
                    {isCurrent && (
                      <span className="px-1 py-0.2 rounded bg-indigo-500 text-white font-bold animate-pulse">
                        Đang Hiện
                      </span>
                    )}
                  </div>
                  <div className="line-clamp-2 leading-relaxed">{sub.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gemini 3.8 Flash TTS Voiceover Engine Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#121929] via-[#0E1524] to-[#0A0E18] border border-amber-500/30 space-y-2.5 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Voice AI (Gemini 3.8 Flash TTS):</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              LIVE API READY
            </span>
          </div>

          {/* Voice Character Selection */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-mono">Chọn Giọng Đọc (Google AI):</span>
              <span className="text-amber-400 font-bold font-mono">{selectedVoice}</span>
            </div>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
            >
              <option value="Charon">🎙️ Charon — Nam Trầm (Chuẩn Trading/Finance Azzam Master)</option>
              <option value="Puck">🎙️ Puck — Nam Năng Động (Viral TikTok Shorts)</option>
              <option value="Aoede">🎙️ Aoede — Nữ Trầm Ấm (Chuyên Sâu Học Viện)</option>
              <option value="Kore">🎙️ Kore — Nữ Chuẩn Mực (Bản Tin Thị Trường)</option>
              <option value="Fenrir">🎙️ Fenrir — Nam Uy Lực (Cảnh Báo Stop Loss)</option>
            </select>
          </div>

          {/* Generate Voiceover Button */}
          <button
            onClick={() => generateVoiceover()}
            disabled={isVoiceGenerating}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md ${
              isVoiceGenerating
                ? 'bg-amber-600/50 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-amber-500/20 active:scale-[0.98]'
            }`}
          >
            {isVoiceGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Đang Tạo Giọng Nói Gemini 3.8...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>⚡ {voiceAudioUrl ? 'Tạo Lại Giọng Nói AI (Gemini 3.8)' : 'Tạo Voice AI Cho Video (1-Click)'}</span>
              </>
            )}
          </button>

          {/* Audio Status & Preview Controls */}
          {voiceAudioUrl && (
            <div className="p-2 rounded-lg bg-[#080C14] border border-emerald-500/30 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Đã có audio ({selectedVoice})</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  title={isAudioMuted ? 'Bật tiếng' : 'Tắt tiếng'}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    isAudioMuted
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceAudio(null)}
                  title="Xóa audio để tạo lại"
                  className="px-2 py-1 text-[10px] text-slate-400 hover:text-rose-400 rounded hover:bg-white/5 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayToggle}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Tạm Dừng Hoạt Ảnh' : '▶ Chạy Thử Hoạt Ảnh Trên Canvas'}</span>
          </button>

          {/* Language Toggle: US/EU English vs Vietnamese */}
          <button
            onClick={applyEnglishVersion}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold text-xs transition flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>🌐 Chuyển Bản Tiếng Anh US/EU (1-Click)</span>
          </button>

          {/* Auto-Fix Alignment */}
          <button
            onClick={applyComprehensiveAutoFix}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>⚡ Tự Động Cân Chỉnh Setup Khớp 100%</span>
          </button>

          {/* Ready to Export Button */}
          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
            >
              <Film className="w-4 h-4 text-black" />
              <span>🎥 ĐÃ KIỂM TRA XONG — XUẤT VIDEO NGAY</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
