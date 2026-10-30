'use client';

import React, { useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Monitor,
  Smartphone,
  Sparkles,
  Mic,
  Volume2,
  VolumeX,
  Loader2,
  Volume1,
} from 'lucide-react';

interface NleTimelineProps {
  onOpenExport: () => void;
}

export const NleTimeline: React.FC<NleTimelineProps> = ({ onOpenExport }) => {
  const {
    currentTime,
    duration,
    isPlaying,
    setCurrentTime,
    setIsPlaying,
    settings,
    updateSettings,
    headlineText,
    sublineText,
    scriptSubtitles,
    voiceAudioUrl,
    selectedVoice,
    isAudioMuted,
    setIsAudioMuted,
    generateVoiceover,
    isVoiceGenerating,
    hasTtsQuotaExceeded,
  } = useChartStore();

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // High-performance 60 FPS Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const currentStoreTime = useChartStore.getState().currentTime;
      const storeDuration = useChartStore.getState().duration;
      const nextTime = currentStoreTime + deltaSec;

      if (nextTime >= storeDuration) {
        setCurrentTime(storeDuration);
        setIsPlaying(false);
      } else {
        setCurrentTime(nextTime);
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, setCurrentTime, setIsPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newTime = (x / rect.width) * (duration || 12);
    setCurrentTime(Math.round(newTime * 100) / 100);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format time as 0:12.00
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = (sec % 60).toFixed(2);
    return `${mins}:${Number(remainder) < 10 ? '0' : ''}${remainder}`;
  };

  // Generate dynamic time ruler ticks based on real duration
  const safeDuration = duration > 0 ? duration : 12;
  const tickCount = 6;
  const timeTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const sec = (i / tickCount) * safeDuration;
    const mins = Math.floor(sec / 60);
    const rem = (sec % 60).toFixed(0);
    const label = mins > 0 ? `${mins}m${rem !== '0' ? rem + 's' : ''}` : `${rem}s`;
    return {
      percent: (i / tickCount) * 100,
      label,
    };
  });

  // Preview Voice Action (Web Speech or Cloud Audio)
  const handleQuickPreviewSpeech = () => {
    if (voiceAudioUrl) {
      const audio = new Audio(voiceAudioUrl);
      audio.play().catch(console.warn);
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const firstSub = scriptSubtitles?.[0];
      const textToSpeak = (typeof firstSub === 'string' ? firstSub : firstSub?.text || headlineText || 'Khóa rủi ro 10 đô trước khi nhìn chart!').replace(/^HOOK:\s*/i, '');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(textToSpeak);
      utterance.lang = isVietnamese ? 'vi-VN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-44 bg-[#090D16] border-t border-[#1E293B] flex flex-col text-slate-200 select-none z-30 flex-shrink-0">
      {/* Top Transport & Action Controls Bar */}
      <div className="h-10 px-6 bg-[#0D121F] border-b border-[#1E293B] flex items-center justify-between">
        {/* Playback Transport */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 1))}
            className="p-1 text-slate-400 hover:text-white transition"
            title="Lùi 1s"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (currentTime >= duration) setCurrentTime(0);
              setIsPlaying(!isPlaying);
            }}
            className="w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition shadow-md shadow-indigo-600/30"
            title={isPlaying ? 'Tạm Dừng' : 'Phát Video (Kèm Giọng Đọc)'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 1))}
            className="p-1 text-slate-400 hover:text-white transition"
            title="Tiến 1s"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Timecode 0:12.00 / 0:12.00 */}
          <div className="text-xs font-mono font-bold tracking-wider text-slate-300 ml-2">
            <span className="text-white">{formatTime(currentTime)}</span>
            <span className="text-slate-500"> / {formatTime(duration)}</span>
          </div>

          {/* Dual-Engine Audio Status & Controls */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 bg-[#121927] border border-[#1E293B] rounded-lg px-2.5 py-1">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono font-bold text-amber-300">
              {voiceAudioUrl ? `Gemini: ${selectedVoice}` : 'Web Speech Engine'}
            </span>

            {/* Quick Test Voice Button */}
            <button
              onClick={handleQuickPreviewSpeech}
              title="Bấm để nghe thử giọng đọc ngay"
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30 hover:bg-blue-600/50 transition ml-1"
            >
              <Volume1 className="w-3 h-3 text-blue-400" />
              <span>Thử Giọng</span>
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              title={isAudioMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-1 hover:bg-emerald-500/30 transition"
            >
              {isAudioMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
              <span>{isAudioMuted ? 'Muted' : 'Audio On'}</span>
            </button>

            {/* Gemini Cloud TTS Generator */}
            {!voiceAudioUrl && (
              <button
                onClick={() => generateVoiceover()}
                disabled={isVoiceGenerating}
                title={hasTtsQuotaExceeded ? 'Gemini Free Tier (10 req/ngày) đang tạm khóa quota, Web Speech đã tự kích hoạt' : 'Tạo file âm thanh từ Gemini Cloud'}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 ml-1 transition shadow-sm"
              >
                {isVoiceGenerating ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                <span>{isVoiceGenerating ? 'Đang Tạo...' : 'Gemini Cloud TTS'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Aspect Ratio & Glowing Purple EXPORT Button */}
        <div className="flex items-center gap-3">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1 bg-[#121927] p-0.5 rounded-lg border border-[#1E293B]">
            <button
              onClick={() => updateSettings({ aspectRatio: '9:16' })}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                settings.aspectRatio === '9:16'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => updateSettings({ aspectRatio: '16:9' })}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                settings.aspectRatio === '16:9'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>16:9</span>
            </button>
          </div>

          {/* EXPORT Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white text-xs font-black tracking-wider shadow-lg shadow-purple-600/30 border border-purple-400/40 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>EXPORT</span>
            <span className="text-[9px] bg-purple-900/60 text-purple-200 px-1 py-0.2 rounded font-mono">
              PRO
            </span>
          </button>
        </div>
      </div>

      {/* Multi-Track Sequencer Container */}
      <div className="flex-1 flex flex-col px-6 py-2 overflow-hidden relative">
        {/* Dynamic Time Ruler - EXACT MATCH WITH VIDEO DURATION */}
        <div
          onClick={handleSeek}
          className="relative h-5 cursor-pointer flex justify-between text-[10px] font-mono text-slate-500 border-b border-[#1E293B]/70 select-none"
        >
          {timeTicks.map((t) => (
            <span key={t.percent} className="flex flex-col items-center">
              <span>{t.label}</span>
              <span className="w-[1px] h-1.5 bg-slate-700 mt-0.5" />
            </span>
          ))}

          {/* Playhead Scrubbing Pin */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-indigo-400 z-30 pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="w-3 h-3 bg-indigo-500 rounded-full -ml-[5px] -mt-0.5 border border-white shadow-md shadow-indigo-500/80" />
          </div>
        </div>

        {/* Tracks Sequencer Rows - 100% FULL WIDTH (No Dead Space at Start or End) */}
        <div
          onClick={handleSeek}
          className="flex-1 flex flex-col justify-center gap-1.5 relative cursor-pointer pt-1"
        >
          {/* Vertical Playhead Cursor Line Spanning Across All Tracks */}
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-indigo-400/90 z-20 pointer-events-none shadow-[0_0_8px_#818CF8]"
            style={{ left: `${progressPercent}%` }}
          />

          {/* Row 1: Subtitle Stages Sequencer Track (Hook -> Trap -> Setup -> Execution) */}
          <div className="relative h-6 bg-[#121927] rounded-md border border-[#1E293B] overflow-hidden flex items-center">
            {scriptSubtitles && scriptSubtitles.length > 0 ? (
              <div className="w-full h-full flex">
                {scriptSubtitles.map((sub, idx) => {
                  const stageColors = [
                    'from-sky-600/80 to-blue-600/80 border-sky-400/60',
                    'from-amber-600/80 to-orange-600/80 border-amber-400/60',
                    'from-purple-600/80 to-indigo-600/80 border-purple-400/60',
                    'from-emerald-600/80 to-teal-600/80 border-emerald-400/60',
                  ];
                  const colorClass = stageColors[idx % stageColors.length];
                  const widthPercent = (100 / scriptSubtitles.length).toFixed(1);

                  return (
                    <div
                      key={idx}
                      style={{ width: `${widthPercent}%` }}
                      className={`h-full border-r border-[#090D16] bg-gradient-to-r ${colorClass} flex items-center px-2 text-[10px] font-bold text-white shadow-sm truncate`}
                    >
                      <span className="truncate">
                        {sub.stageName ? `${idx + 1}. ${sub.stageName}` : `B${idx + 1}`}: {sub.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full h-full rounded bg-gradient-to-r from-sky-600/80 to-blue-600/80 border border-sky-400/50 flex items-center px-2 text-[10px] font-bold text-white shadow-sm truncate">
                <span>Txt #1: {headlineText || 'CƠ CHẾ GIÁ XAUUSD CHUẨN TỔ CHỨC'}</span>
              </div>
            )}
          </div>

          {/* Row 2: Subtext / Narrative Strategy Track (Spans 100% Full Width) */}
          <div className="relative h-6 bg-[#121927] rounded-md border border-[#1E293B] overflow-hidden flex items-center">
            <div className="w-full h-full rounded bg-gradient-to-r from-teal-700/70 to-emerald-700/70 border border-teal-400/40 flex items-center px-2 text-[10px] font-bold text-white shadow-sm truncate">
              <span>Kịch bản: {sublineText || 'Quản trị rủi ro cố định $10/$30 trước khi nhìn biểu đồ'}</span>
            </div>
          </div>

          {/* Row 3: Candlestick Sweep Animation Graphic Track (Spans 100% Full Width) */}
          <div className="relative h-6 bg-[#121927] rounded-md border border-[#1E293B] overflow-hidden flex items-center">
            <div className="w-full h-full rounded bg-gradient-to-r from-indigo-700/70 to-purple-700/70 border border-indigo-400/40 flex items-center px-2 text-[10px] font-bold text-white shadow-sm truncate">
              <span>Chart: Candlestick Liquidity Sweep & Institutional Orderflow Animation</span>
            </div>
          </div>

          {/* Row 4: Dual-Engine Audio Track (Gemini Cloud TTS or Web Speech Engine) */}
          <div className="relative h-6 bg-[#121927] rounded-md border border-[#1E293B] overflow-hidden flex items-center">
            {voiceAudioUrl ? (
              <div className="w-full h-full rounded bg-gradient-to-r from-amber-600/80 via-yellow-600/80 to-amber-500/80 border border-amber-400/60 flex items-center justify-between px-2 text-[10px] font-bold text-black shadow-sm">
                <div className="flex items-center gap-1.5 truncate">
                  <Mic className="w-3 h-3 shrink-0" />
                  <span className="truncate">🎙️ Gemini 3.8 Flash TTS: Giọng {selectedVoice} (Sẵn Sàng)</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] opacity-90 shrink-0 ml-2">
                  <span>ılılılllıılıl</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded bg-gradient-to-r from-emerald-950/80 to-[#121927] border border-emerald-500/40 flex items-center justify-between px-2.5 text-[10px] text-emerald-300 font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />
                  <span className="truncate">
                    🎙️ Voice Engine: <strong className="text-white">Web Speech Tự Nhiên</strong> (Tự phát khi bấm Play)
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[9px] text-emerald-400/80 font-bold hidden sm:inline">
                    ✓ Không Giới Hạn Quota
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateVoiceover();
                    }}
                    disabled={isVoiceGenerating}
                    className="text-amber-400 hover:text-amber-300 font-bold text-[10px] hover:underline"
                  >
                    {isVoiceGenerating ? 'Đang tạo...' : '+ Thử Gemini Cloud'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
