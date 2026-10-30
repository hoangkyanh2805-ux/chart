'use client';

import React, { useState, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import {
  Youtube,
  X,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Play,
  Video,
  Radio,
  Flame,
  Clock,
  Eye,
  ThumbsUp,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { generateStrategySetup } from '../utils/hermesEngine';

interface YouTubeAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YouTubeAuditModal: React.FC<YouTubeAuditModalProps> = ({ isOpen, onClose }) => {
  const {
    setHeadlineText,
    setSublineText,
    setBadges,
    clearAllCandles,
    addCandle,
    addOverlay,
    setCurrentTime,
    setIsPlaying,
  } = useChartStore();

  const [activeTab, setActiveTab] = useState<'diagnosis' | 'proposals' | 'videos'>('diagnosis');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoading(true);
    setError('');

    fetch('/api/youtube/channel')
      .then((r) => r.json())
      .then((res) => {
        if (!isMounted) return;
        if (res.error) {
          setError(res.error);
        } else {
          setData(res);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Lỗi tải dữ liệu YouTube');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApplyProposal = (prop: any) => {
    setHeadlineText(prop.hookHeadline);
    setSublineText(prop.hookSubline);
    setBadges(prop.badges as [string, string, string]);

    const dir: 'BUY' | 'SELL' = /sweep|trap|orb/i.test(prop.strategy) ? 'SELL' : 'BUY';
    const baseP = prop.basePrice || 4128.0;
    const slPips = prop.slPips || 20;
    const rrRatio = prop.rrRatio || 3.5;
    const riskBudget = prop.riskBudget || 10;
    const slDistance = slPips * 0.1;
    const tpDistance = slPips * rrRatio * 0.1;
    const slPrice = dir === 'BUY' ? baseP - slDistance : baseP + slDistance;
    const tpPrice = dir === 'BUY' ? baseP + tpDistance : baseP - tpDistance;
    const targetPips = Math.round(slPips * rrRatio);
    const lotNum = parseFloat((prop.lotSize || '0.05 lot').replace(/[^0-9.]/g, '')) || 0.05;

    clearAllCandles();
    const { candles, overlays } = generateStrategySetup(
      prop.strategy,
      baseP,
      riskBudget,
      slPips,
      prop.lotSize || `${lotNum} lot`,
      rrRatio
    );

    candles.forEach((c) => addCandle(c));
    overlays.forEach((o) => addOverlay(o));

    useChartStore.setState({
      duration: 12,
      executionOrder: {
        type: dir,
        lot: lotNum,
        entry: parseFloat(baseP.toFixed(1)),
        sl: parseFloat(slPrice.toFixed(1)),
        tp: parseFloat(tpPrice.toFixed(1)),
        risk: riskBudget,
        reward: Math.round(riskBudget * rrRatio),
        pips: targetPips,
      },
      targetPips,
      showPipCounter: true,
      showExecutionBadge: true,
      calloutPinText: dir === 'BUY' ? `🎯 RÚT CHÂN HỖ TRỢ ($${baseP.toFixed(0)})` : `🎯 BẪY DỤ BUY QUÉT ĐỈNH ($${baseP.toFixed(0)})`,
      calloutCandleIndex: 4,
      showCalloutPin: true,
      beforeAfterMode: 'off',
      scriptSubtitles: [
        { timePercent: 0.0, text: `Khóa rủi ro 1R ($${riskBudget}) trước khi nhìn chart!`, stageName: 'Hook' },
        { timePercent: 0.28, text: `Thị trường test lại cản kỹ thuật, dụ đám đông vào lệnh cảm xúc.`, stageName: 'Trap' },
        { timePercent: 0.58, text: `Nến rút chân xác nhận đảo chiều. Vào ${dir} ${lotNum} lot.`, stageName: 'Setup' },
        { timePercent: 0.82, text: `Khóa SL ${slPips} pips ($${riskBudget}), chốt lời +${targetPips} pips (1:${rrRatio} R:R).`, stageName: 'Execution' },
      ],
    });

    useChartStore.getState().validateCurrentSetup();
    setCurrentTime(0);
    setIsPlaying(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0D1117] border border-[#21262D] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-[#21262D] flex items-center justify-between bg-[#161B22]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/25">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">Khám Kênh YouTube Live</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  YOUTUBE DATA API V3
                </span>
                {data?.channel && (
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {data.channel.title} ({data.channel.customUrl})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Đọc dữ liệu thời gian thực Shorts, Video Dài & Livestream để chẩn đoán kênh và đề xuất kịch bản nến
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262D] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel Highlights Bar */}
        {data?.channel && (
          <div className="px-6 py-3 bg-[#111620] border-b border-[#21262D] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Subscribers:</span>
                <span className="text-white font-bold">{data.channel.subscribers.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Tổng Video:</span>
                <span className="text-white font-bold">{data.channel.totalVideos.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Tổng Lượt Xem:</span>
                <span className="text-emerald-400 font-bold">{data.channel.totalViews.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Đã phân tích: <span className="text-amber-400 font-bold">{data.summary?.totalAnalyzed || 0}</span> video gần nhất
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 border-b border-[#21262D] flex items-center gap-2 bg-[#0A0D12]">
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'diagnosis'
                ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Chẩn Đoán & Khám Bệnh Kênh
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'proposals'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> 3 Đề Xuất Dựng Ngay (1-Click)
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'videos'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Video Thực Tế ({data?.summary?.totalAnalyzed || 0})
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
              <p className="text-sm">Đang kết nối YouTube Data API v3 để đọc dữ liệu kênh...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : activeTab === 'diagnosis' ? (
            /* TAB 1: DIAGNOSIS */
            <div className="flex flex-col gap-5">
              {/* Overall health badge */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#161B22] to-[#1C2128] border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1 font-mono">
                    ĐÁNH GIÁ TỔNG QUAN TỪ HERMES DIRECTOR:
                  </div>
                  <div className="text-base font-bold text-white">{data?.diagnosis?.overallHealth}</div>
                </div>
                <div className="text-right font-mono text-xs text-slate-400">
                  Top Livestream: <span className="text-emerald-400 font-bold">{data?.diagnosis?.keyMetrics?.topLiveSession?.toLocaleString()} views</span>
                </div>
              </div>

              {/* Strengths */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 1. ĐIỂM MẠNH HIỆN TẠI (STRENGTHS)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {data?.diagnosis?.strengths?.map((str: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#161B22] border border-[#21262D] text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottlenecks */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> 2. LỖ HỔNG CẦN KHẮC PHỤC (BOTTLENECKS)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {data?.diagnosis?.bottlenecks?.map((bot: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#161B22] border border-[#21262D] text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">!</span>
                      <span>{bot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Plan */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> 3. ĐƠN THUỐC HÀNH ĐỘNG TỪ HERMES (ACTION PLAN)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {data?.diagnosis?.actionPlan?.map((act: string, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#161B22] border border-[#21262D] text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-sky-400 font-bold">➔</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'proposals' ? (
            /* TAB 2: PROPOSED VIDEOS */
            <div className="flex flex-col gap-4">
              <div className="text-xs text-slate-400">
                Hermes đã tính toán sẵn cấu trúc nến, điểm cắt lỗ 20 pips, và Hook 0-3s bám sát dữ liệu kênh. Bấm nút màu vàng để **nạp thẳng lên Canvas**!
              </div>

              {data?.proposedVideos?.map((prop: any) => (
                <div
                  key={prop.id}
                  className="p-5 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-amber-500/50 transition flex flex-col gap-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase">
                      {prop.format} • {prop.strategy}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Target +{prop.targetPips} Pips (1:{prop.rrRatio} R:R)
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-white">{prop.title}</h4>
                    <div className="text-xs font-bold text-amber-400 uppercase">
                      Hook: &quot;{prop.hookHeadline}&quot;
                    </div>
                    <div className="text-xs text-slate-300 italic">
                      Subline: &quot;{prop.hookSubline}&quot;
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      <span className="text-slate-300 font-semibold">Căn cứ:</span> {prop.rationale}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#21262D] flex items-center justify-between">
                    <div className="text-[11px] font-mono text-slate-400">
                      Vốn: <span className="text-amber-300 font-bold">${prop.riskBudget} Risk</span> • SL 20p • Size {prop.lotSize}
                    </div>

                    <button
                      onClick={() => handleApplyProposal(prop)}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition active:scale-[0.98]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Áp Dụng Lên Canvas (1-Click)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* TAB 3: REAL VIDEOS LIST */
            <div className="flex flex-col gap-4">
              {/* Shorts */}
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-red-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" /> SHORTS GẦN ĐÂY ({data?.videos?.shorts?.length || 0})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data?.videos?.shorts?.map((vid: any) => (
                    <div key={vid.id} className="p-3 rounded-lg bg-[#161B22] border border-[#21262D] flex items-center justify-between text-xs">
                      <div className="flex flex-col gap-0.5 truncate pr-2">
                        <span className="text-white font-medium truncate">{vid.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{vid.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-500" /> {vid.views}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long & Livestream */}
              <div className="flex flex-col gap-2 pt-3 border-t border-[#21262D]">
                <h4 className="text-xs font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> LIVESTREAMS & VIDEO DÀI ({((data?.videos?.longVideos?.length || 0) + (data?.videos?.liveStreams?.length || 0))})
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[...(data?.videos?.longVideos || []), ...(data?.videos?.liveStreams || [])].map((vid: any) => (
                    <div key={vid.id} className="p-3 rounded-lg bg-[#161B22] border border-[#21262D] flex items-center justify-between text-xs">
                      <div className="flex flex-col gap-0.5 truncate pr-2">
                        <span className="text-white font-medium truncate">{vid.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{vid.duration}</span>
                      </div>
                      <div className="flex items-center gap-4 font-mono text-xs shrink-0">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3 text-emerald-500" /> {vid.views.toLocaleString()}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-slate-500" /> {vid.likes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

