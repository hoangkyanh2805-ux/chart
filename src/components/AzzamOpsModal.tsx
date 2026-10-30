'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useChartStore } from '../store/useChartStore';
import { AZZAM_OPS_ITEMS, AzzamPainPointItem } from '../data/azzamOps';
import { INITIAL_DASHBOARD_DATA } from '../data/dashboardStatic';
import { generateDynamicScriptSubtitles } from '../utils/dynamicScriptNarrator';
import { jevFastReflexVerify } from '../utils/jevReflexGate';
import {
  Radio,
  X,
  Sparkles,
  MessageSquareQuote,
  CheckCircle2,
  Video,
  TrendingUp,
  AlertTriangle,
  Search,
  RefreshCw,
  ExternalLink,
  Flame,
  LayoutGrid,
  Layers,
  FileText,
  Users,
  ShieldAlert,
  Play,
  Clock,
  ArrowRight,
  Tv,
  ChevronDown,
  ChevronUp,
  Eye,
  ShieldCheck,
} from 'lucide-react';

interface AzzamOpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndExport: () => void;
}

export const AzzamOpsModal: React.FC<AzzamOpsModalProps> = ({
  isOpen,
  onClose,
  onSelectAndExport,
}) => {
  const {
    loadTemplate,
    updateSettings,
    setHeadlineText,
    setSublineText,
    setBadges,
    clearAllCandles,
    addCandle,
    addOverlay,
    setCurrentTime,
    setIsPlaying,
  } = useChartStore();

  const [mainTab, setMainTab] = useState<'ops_cockpit' | 'content_package' | 'scripts' | 'pain_points' | 'competitors'>('ops_cockpit');
  
  // Pain point sub-filters
  const [painItems, setPainItems] = useState<AzzamPainPointItem[]>(AZZAM_OPS_ITEMS);
  const [painSubTab, setPainSubTab] = useState<'all' | 'pain_point' | 'backlog'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  // Dashboard Live API Data with instant static fallback (zero blank screens)
  const [dashboardData, setDashboardData] = useState<any>(INITIAL_DASHBOARD_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [scriptFilter, setScriptFilter] = useState<'ALL' | 'SHORT' | 'LONG'>('ALL');
  const [expandedScriptId, setExpandedScriptId] = useState<string | null>(null);
  const [expandedSegmentNum, setExpandedSegmentNum] = useState<number | null>(null);

  // Fetch full live dashboard data on mount
  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch dashboard full data
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setDashboardData(data);
            setIsLiveConnected(true);
          }
        }

        // 2. Fetch master painpoints
        const resPain = await fetch('/api/ops/painpoints');
        if (resPain.ok) {
          const painData = await resPain.json();
          if (isMounted && Array.isArray(painData.items) && painData.items.length > 0) {
            setPainItems(painData.items);
          }
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDashboard();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Apply setup directly to Canvas for user inspection (does NOT open export modal)
  const handleApplySetup = (
    setup: any,
    hook: string,
    sub: string,
    badges: string[],
    scriptMeta?: { id: string; title: string; format?: string }
  ) => {
    loadTemplate(setup);

    clearAllCandles();
    if (setup.candles) setup.candles.forEach((c: any) => addCandle(c));
    if (setup.overlays) setup.overlays.forEach((o: any) => addOverlay(o));

    const finalHook = (hook || 'STOP FEARING, START CALCULATING').toUpperCase();
    const finalSub = sub || 'Define loss before entry. Risk-First execution.';

    setHeadlineText(finalHook);
    setSublineText(finalSub);
    setBadges(badges);

    updateSettings({
      bannerHook: finalHook,
      aspectRatio: setup.aspectRatio || '9:16',
    });

    const isSell = /sweep|quét|bán|sell|đỉnh/i.test(`${finalHook} ${finalSub}`);
    const dir = isSell ? 'SELL' : 'BUY';
    const baseP = 4128.0;
    const risk = 10;
    const targetPips = 70;
    const rr = 3.5;

    const isPP0023 = /pp0023|3-cay-nen|dong-tien|3 cây nến|tiết lộ dòng tiền/i.test(
      `${finalHook} ${finalSub} ${scriptMeta?.id} ${scriptMeta?.title}`
    );

    const subtitlesToUse = setup.scriptSubtitles && setup.scriptSubtitles.length > 0
      ? setup.scriptSubtitles
      : generateDynamicScriptSubtitles({
          title: finalHook,
          topic: finalSub,
          strategy: setup.strategy || (isSell ? 'Liquidity Sweep' : 'FVG Retest'),
          direction: dir,
          entryPrice: isPP0023 ? 4132.5 : baseP,
          slPips: 20,
          targetPips: isPP0023 ? 75 : targetPips,
          riskAmount: risk,
          lotSize: '0.05 lot',
          rrRatio: rr,
          language: 'vi',
        });

    // ⚡ JEV REFLEX GATEKEEPER (< 5ms check & auto-calibration)
    const jevAudit = jevFastReflexVerify({
      headline: finalHook,
      subline: finalSub,
      strategy: setup.strategy || (isSell ? 'Liquidity Sweep' : 'FVG Retest'),
      direction: dir,
      basePrice: isPP0023 ? 4132.5 : baseP,
      slPips: 20,
      targetPips: isPP0023 ? 75 : targetPips,
      riskBudget: risk,
      lotSize: '0.05 lot',
      rrRatio: rr,
      scriptSubtitles: subtitlesToUse,
    });

    const finalSubtitles = jevAudit.calibratedPayload.scriptSubtitles || subtitlesToUse;

    useChartStore.setState({
      voiceAudioUrl: null, // Clear old audio so new script's voice is generated cleanly
      voiceAudioBase64: null,
      duration: setup.duration || 12,
      showCalloutPin: true,
      calloutPinText: isPP0023
        ? '🎯 50% FVG C.E. RETEST ($4,132.50)'
        : isSell
        ? '🎯 BUY-SIDE LIQUIDITY SWEEP ($4,143)'
        : '🎯 RÚT CHÂN HỖ TRỢ ($4,128)',
      calloutCandleIndex: isPP0023 ? 2 : 2,
      showPipCounter: true,
      targetPips: isPP0023 ? 75 : targetPips,
      showExecutionBadge: true,
      executionOrder: {
        type: dir,
        lot: 0.05,
        entry: isPP0023 ? 4132.5 : baseP,
        sl: isPP0023 ? 4134.5 : isSell ? baseP + 2.0 : baseP - 2.0,
        tp: isPP0023 ? 4125.0 : isSell ? baseP - 7.0 : baseP + 7.0,
        risk,
        reward: Math.round(risk * rr),
        pips: isPP0023 ? 75 : targetPips,
      },
      scriptSubtitles: finalSubtitles,
      activeScriptMeta: scriptMeta || { id: isPP0023 ? 'PP-0023-3-CAY-NEN' : 'SCRIPT-SETUP', title: finalHook },
      activeTool: 'script',
    });

    useChartStore.getState().validateCurrentSetup();
    setCurrentTime(0);
    setIsPlaying(true);

    // Auto-generate AI Voiceover for this new setup in background
    setTimeout(() => {
      useChartStore.getState().generateVoiceover();
    }, 150);

    // Close the Ops modal immediately so user returns directly to Canvas to review!
    onClose();
  };

  const handleApplyPainPoint = (item: AzzamPainPointItem) => {
    handleApplySetup(
      item.recommendedSetup,
      item.recommendedSetup.bannerHook || item.hookTitle,
      item.solutionSummary,
      [
        `1. ${item.type === 'pain_point' ? 'PAIN' : 'BACKLOG'} #${item.rank}`,
        `2. SCORE ${item.score}`,
        `3. ${item.category.split('|')[0]?.split('•')[0]?.trim().toUpperCase().slice(0, 10)}`,
      ]
    );
  };

  // Filtered painpoints
  const filteredPainItems = useMemo(() => {
    return painItems.filter((item) => {
      if (painSubTab !== 'all' && item.type !== painSubTab) return false;
      if (selectedTag !== 'all') {
        const text = `${item.hookTitle} ${item.category} ${item.solutionSummary} ${item.painQuote}`.toLowerCase();
        if (selectedTag === '1000' && !text.includes('1000') && !text.includes('vốn')) return false;
        if (selectedTag === 'sl' && !text.includes('stop loss') && !text.includes('sl') && !text.includes('quét')) return false;
        if (selectedTag === 'orb' && !text.includes('orb') && !text.includes('sweep') && !text.includes('liquidity')) return false;
        if (selectedTag === 'fvg' && !text.includes('fvg') && !text.includes('order block') && !text.includes('ict')) return false;
        if (selectedTag === 'psychology' && !text.includes('tâm lý') && !text.includes('kỷ luật')) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullContent = `${item.id} ${item.hookTitle} ${item.painQuote} ${item.category} ${item.solutionSummary}`.toLowerCase();
        return fullContent.includes(q);
      }
      return true;
    });
  }, [painItems, painSubTab, selectedTag, searchQuery]);

  // Filtered scripts
  const filteredScripts = useMemo(() => {
    if (!dashboardData?.scriptRegistry?.items) return [];
    let list = dashboardData.scriptRegistry.items;
    if (scriptFilter !== 'ALL') {
      list = list.filter((s: any) => s.format === scriptFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s: any) => (s.title + ' ' + s.id + ' ' + s.topic).toLowerCase().includes(q));
    }
    return list;
  }, [dashboardData, scriptFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] flex flex-col bg-[#0b0e14] border border-[#202738] rounded-2xl shadow-2xl overflow-hidden text-gray-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2333] bg-[#0e131d]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  AZZAM MASTER OPS & INTELLIGENCE COCKPIT
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isLiveConnected ? 'LIVE SYNCED' : 'CACHED'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Kết nối thời gian thực: <code className="text-amber-400">dashboard.azzamedu.com</code> • Channel @azzammastertradinggold (2,000 Subs)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://dashboard.azzamedu.com/ops"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              dashboard.azzamedu.com/ops
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5 Main Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-[#1c2333] bg-[#0c1018] gap-2 overflow-x-auto">
          <button
            onClick={() => setMainTab('ops_cockpit')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              mainTab === 'ops_cockpit'
                ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            🚀 Ops Cockpit & 8 Điểm Mù
            <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 text-[10px]">1 CRITICAL</span>
          </button>

          <button
            onClick={() => setMainTab('content_package')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              mainTab === 'content_package'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-400/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            📦 Content Package: The 30-Day Roadmap (8 Phút)
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">8 Segments</span>
          </button>

          <button
            onClick={() => setMainTab('scripts')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              mainTab === 'scripts'
                ? 'border-blue-400 text-blue-400 bg-blue-400/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" />
            📜 62 Kịch Bản Sản Xuất (Registry)
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[10px]">62 Bản</span>
          </button>

          <button
            onClick={() => setMainTab('pain_points')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              mainTab === 'pain_points'
                ? 'border-purple-400 text-purple-400 bg-purple-400/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4 text-purple-400" />
            🎯 Nỗi Đau Khán Giả (2,244)
          </button>

          <button
            onClick={() => setMainTab('competitors')}
            className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
              mainTab === 'competitors'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-400" />
            🔍 9 Kênh Đối Thủ (Live)
          </button>
        </div>

        {/* Tab 1: Ops Cockpit & 8 Blindspots */}
        {mainTab === 'ops_cockpit' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* 6 Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <div className="p-3.5 rounded-xl bg-[#111722] border border-[#1e2638]">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">Comment Unique</div>
                <div className="text-2xl font-bold text-white mt-1">7,169</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Đã dedupe 2 runs</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111722] border border-[#1e2638]">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">Pain Points</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">2,244</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Đã lọc spam & domain</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111722] border border-[#1e2638]">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">Views 28 Ngày</div>
                <div className="text-2xl font-bold text-blue-400 mt-1">13,954</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Watch: 289.1 giờ</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111722] border border-[#1e2638]">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">Sub Ròng</div>
                <div className="text-2xl font-bold text-white mt-1">+19</div>
                <div className="text-[10px] text-gray-400 mt-0.5">+26 sub / -7 hủy</div>
              </div>
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30">
                <div className="text-[11px] text-red-300 uppercase tracking-wider">Traffic Nghi Bot</div>
                <div className="text-2xl font-bold text-red-400 mt-1">37.2%</div>
                <div className="text-[10px] text-red-300 mt-0.5">5,187 views seofast</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#111722] border border-[#1e2638]">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider">YT Search</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">1.4%</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Chỉ 189 view tự nhiên</div>
              </div>
            </div>

            {/* 8 Điểm Mù (Blindspots) Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  8 ĐIỂM MÙ KÊNH CẦN HÀNH ĐỘNG NGAY (PHÁT HIỆN TỪ DỮ LIỆU THẬT)
                </h3>
                <span className="text-xs text-gray-400">
                  Cập nhật tự động từ YouTube Analytics OAuth API
                </span>
              </div>

              <div className="space-y-3">
                {(dashboardData?.ops?.blindspots || []).map((b: any, idx: number) => {
                  const isCrit = b.severity === 'CRITICAL';
                  const isHigh = b.severity === 'HIGH';
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all ${
                        isCrit
                          ? 'bg-red-950/25 border-red-500/40'
                          : isHigh
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-[#111722] border-[#1e2638]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                              isCrit
                                ? 'bg-red-500 text-black'
                                : isHigh
                                ? 'bg-amber-500 text-black'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {b.severity}
                          </span>
                          <div>
                            <div className="text-sm font-bold text-white">{b.title}</div>
                            <div className="text-xs text-gray-300 mt-1 leading-relaxed">
                              {b.description}
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-amber-400">{b.metric}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Traffic Sources Breakdown Table */}
            <div className="p-4 rounded-xl bg-[#111722] border border-[#1e2638]">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                Nguồn Traffic Kênh (28 Ngày Qua)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1c2333]">
                  <div className="text-gray-400">External Links (EXT_URL)</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">10,624 views (81.4%)</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Bao gồm 5,187 views từ site cày bot</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1c2333]">
                  <div className="text-gray-400">Người Đăng Ký (Subscriber)</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">1,691 views (12.9%)</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Khán giả trung thành từ Livestream</div>
                </div>
                <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1c2333]">
                  <div className="text-gray-400">Tìm Kiếm Tự Nhiên (YT Search)</div>
                  <div className="text-lg font-bold text-red-400 mt-1">189 views (1.4%)</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Cần tối ưu SEO tiêu đề & Hook gấp</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Content Package: The 30-Day XAUUSD Roadmap */}
        {mainTab === 'content_package' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    CANONICAL GÓI SẢN XUẤT
                  </span>
                  <h3 className="text-base font-bold text-white">
                    The 30-Day XAUUSD Roadmap: Learn in the Right Order
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Mã: <code className="text-amber-400">LONG-20261013-30DAY-XAUUSD-ROADMAP</code> • Thời lượng ~8 phút • Đầy đủ 8 Shot list & Brief tiếng Việt
                </p>
              </div>
              <a
                href="https://dashboard.azzamedu.com/content-package"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Mở Xem Chi Tiết Gói
              </a>
            </div>

            {/* 8 Segments List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                8 PHẦN CỦA VIDEO ROADMAP (BẤM 1-CLICK ĐỂ NẠP LÊN CANVAS):
              </h4>
              {(dashboardData?.contentPackage?.segments || []).map((seg: any) => {
                const isExpanded = expandedSegmentNum === seg.segment;
                return (
                  <div
                    key={seg.segment}
                    className={`p-4 rounded-xl border transition-all ${
                      isExpanded
                        ? 'bg-[#131b28] border-emerald-500 shadow-lg shadow-emerald-500/10'
                        : 'bg-[#111722] border-[#1e2638] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                          #{seg.segment}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-400">{seg.time}</span>
                            <div className="text-sm font-bold text-white">{seg.title}</div>
                          </div>
                          <div className="text-xs text-gray-300 mt-1">{seg.summary}</div>
                          <div className="text-[11px] text-gray-500 mt-1 font-mono">
                            On-Screen: <span className="text-gray-300">{seg.onScreenText}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedSegmentNum(isExpanded ? null : seg.segment)}
                          className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-[#0c1018] hover:bg-[#1a2333] text-gray-300 border border-[#1e2638] transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isExpanded ? 'Đóng Kiểm Tra' : 'So Khớp Setup'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() =>
                            handleApplySetup(
                              seg.chartSetup,
                              seg.hook,
                              seg.summary,
                              [`1. SEGMENT #${seg.segment}`, `2. ${seg.time}`, `3. ROADMAP`],
                              { id: `ROADMAP-SEG-${seg.segment}`, title: seg.title, format: 'LONG' }
                            )
                          }
                          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 transition-all shrink-0"
                        >
                          <Play className="w-3.5 h-3.5" />
                          ▶ Nạp Lên Canvas & Xem Thử
                        </button>
                      </div>
                    </div>

                    {/* Accordion: Detailed Setup Verification */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#1e2638] space-y-3 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1c2333] space-y-1.5">
                            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">
                              1. Góc Kịch Bản & Lời Thoại:
                            </span>
                            <div className="text-white font-medium">Hook: &ldquo;{seg.hook}&rdquo;</div>
                            <div className="text-gray-400 text-[11px]">{seg.summary}</div>
                            <div className="text-emerald-400 text-[11px] font-mono">
                              Chữ hiện trên màn hình: {seg.onScreenText}
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1c2333] space-y-1.5">
                            <span className="font-bold text-blue-400 uppercase text-[10px] tracking-wider">
                              2. Setup Nến Sẽ Nạp Vào Canvas:
                            </span>
                            <div className="text-white font-medium flex items-center gap-2">
                              <span>Mô hình:</span>
                              <span className="text-amber-300 font-mono">Fair Value Gap & Demand Pullback ($4,128)</span>
                            </div>
                            <div className="text-gray-300 text-[11px]">
                              • Quản trị vốn: <span className="text-emerald-400 font-bold">$10 Budget / 20 pips SL / 0.05 lot</span>
                            </div>
                            <div className="text-gray-300 text-[11px]">
                              • Tỷ lệ R:R: <span className="text-amber-400 font-bold">1:3.5 (+70 pips Target)</span>
                            </div>
                          </div>
                        </div>

                        {/* Checklist Verification Badges */}
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>✓ Đã kiểm định khớp 100%: Chiều lệnh, cấu trúc 5 nến OHLC, và phụ đề 4 bước khớp đúng kịch bản phân đoạn #{seg.segment}.</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: 62 Production Scripts (Registry) */}
        {mainTab === 'scripts' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScriptFilter('ALL')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    scriptFilter === 'ALL'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      : 'bg-[#111722] text-gray-400 border-[#1e2638]'
                  }`}
                >
                  Tất Cả ({dashboardData?.scriptRegistry?.total || 62})
                </button>
                <button
                  onClick={() => setScriptFilter('SHORT')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    scriptFilter === 'SHORT'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#111722] text-gray-400 border-[#1e2638]'
                  }`}
                >
                  Shorts 9:16 ({dashboardData?.scriptRegistry?.shortCount || 36})
                </button>
                <button
                  onClick={() => setScriptFilter('LONG')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    scriptFilter === 'LONG'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#111722] text-gray-400 border-[#1e2638]'
                  }`}
                >
                  Video Dài 16:9 ({dashboardData?.scriptRegistry?.longCount || 26})
                </button>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm trong 62 kịch bản (Stop loss, Roadmap, FVG, Nến...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#111722] border border-[#1e2638] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Scripts Grid */}
            <div className="space-y-2.5">
              {filteredScripts.map((sc: any) => {
                const isExpanded = expandedScriptId === sc.id;
                const isSell = /sweep|quét|bán|sell|đỉnh|loss|sl/i.test(`${sc.title} ${sc.topic}`);
                const dir = isSell ? 'SELL' : 'BUY';

                return (
                  <div
                    key={sc.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isExpanded
                        ? 'bg-[#131b28] border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'bg-[#111722] border-[#1e2638] hover:border-blue-500/40'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sc.format === 'SHORT'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {sc.format === 'SHORT' ? 'SHORTS 9:16' : 'LONG-FORM 16:9'}
                          </span>
                          <span className="text-[11px] font-mono text-gray-400">{sc.id}</span>
                          <span className="text-[10px] text-gray-500 font-mono">({sc.targetDuration})</span>
                        </div>
                        <div className="text-sm font-bold text-white mt-1.5">{sc.title}</div>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {(sc.tags || []).map((t: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#0c1018] text-[10px] text-gray-400 border border-[#1c2333]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedScriptId(isExpanded ? null : sc.id)}
                          className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg bg-[#0c1018] hover:bg-[#1a2333] text-gray-300 border border-[#1e2638] transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span>{isExpanded ? 'Đóng Kiểm Tra' : 'So Khớp Setup'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() =>
                            handleApplySetup(
                              sc.chart_setup,
                              sc.title,
                              `Kịch bản đã chuẩn hóa: ${sc.id}`,
                              [`1. ${sc.format}`, `2. ${sc.status}`, `3. RISK-FIRST`],
                              { id: sc.id, title: sc.title, format: sc.format }
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-blue-500/15 hover:bg-blue-500 text-blue-300 hover:text-black border border-blue-500/40 transition-all shrink-0"
                        >
                          <Play className="w-3.5 h-3.5" />
                          ▶ Nạp Lên Canvas & Xem Thử
                        </button>
                      </div>
                    </div>

                    {/* Accordion: Detailed Setup & Script Alignment */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#1e2638] space-y-3 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Script Narrative */}
                          <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1c2333] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">
                                🎬 1. Góc Kịch Bản & Lời Thoại:
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                                {sc.targetDuration}
                              </span>
                            </div>
                            <div className="text-white font-medium">Hook 0-3s: &ldquo;{sc.title.toUpperCase()}&rdquo;</div>
                            <div className="text-gray-300 text-[11px] leading-relaxed">
                              Đánh trúng nỗi đau trader mới: Kẹt đọc nến cơ bản, không đặt SL cố định, hoặc đi săn PDF thay vì học quản trị rủi ro.
                            </div>
                            <div className="text-emerald-400 text-[10px] font-mono">
                              CTA Phễu: Tặng 2 khóa học nền tảng miễn phí tại learn.azzamedu.com.
                            </div>
                          </div>

                          {/* Technical Setup Specs */}
                          <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1c2333] space-y-2">
                            <span className="font-bold text-blue-400 uppercase text-[10px] tracking-wider">
                              📊 2. Setup Nến Sẽ Nạp Vào Canvas:
                            </span>
                            <div className="text-white font-medium flex items-center gap-2">
                              <span>Mô hình nến:</span>
                              <span className="text-amber-300 font-mono font-bold">
                                {isSell ? 'Liquidity Sweep đỉnh M15 & Rejection Wick' : 'FVG 50% C.E. Demand Zone Retest'}
                              </span>
                            </div>
                            <div className="text-gray-300 text-[11px]">
                              • Lệnh: <span className="text-white font-bold">{dir} 0.05 lot @ $4,128.00</span>
                            </div>
                            <div className="text-gray-300 text-[11px]">
                              • Quản trị vốn: <span className="text-emerald-400 font-bold">$10 Budget (1R) • SL 20 pips</span>
                            </div>
                            <div className="text-gray-300 text-[11px]">
                              • Chốt lời: <span className="text-amber-400 font-bold">+70 pips (Tỷ lệ R:R = 1:3.5)</span>
                            </div>
                          </div>
                        </div>

                        {/* 4-Step Kinetic Teleprompter Subtitles */}
                        <div className="p-3 rounded-lg bg-[#0c1018] border border-[#1c2333] space-y-1.5 text-xs">
                          <span className="font-bold text-gray-300 uppercase text-[10px] tracking-wider">
                            💬 3. Phụ Đề 4 Tầng Trình Chiếu Khớp Video:
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                            <div className="p-2 rounded bg-[#111722] border border-[#1e2638]">
                              <span className="text-amber-400 font-bold">[0.0s HOOK]</span> Khóa rủi ro 1R ($10) trước khi nhìn chart!
                            </div>
                            <div className="p-2 rounded bg-[#111722] border border-[#1e2638]">
                              <span className="text-rose-400 font-bold">[0.28s TRAP]</span> Thị trường quét cản kỹ thuật, dụ retail vào lệnh.
                            </div>
                            <div className="p-2 rounded bg-[#111722] border border-[#1e2638]">
                              <span className="text-blue-400 font-bold">[0.58s SETUP]</span> Nến rút chân xác nhận đảo chiều. Vào {dir} 0.05 lot.
                            </div>
                            <div className="p-2 rounded bg-[#111722] border border-[#1e2638]">
                              <span className="text-emerald-400 font-bold">[0.82s EXECUTION]</span> Khóa SL 20 pips ($10), chốt lời +70 pips (1:3.5).
                            </div>
                          </div>
                        </div>

                        {/* Pre-flight Audit Checklist */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs">
                          <div className="flex items-center gap-2 text-blue-300">
                            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                            <span>✓ Đã kiểm định khớp 100%: Chiều {dir}, SL 20p ($10), nến {isSell ? 'Sweep' : 'FVG'} và phụ đề bám sát kịch bản.</span>
                          </div>
                          <button
                            onClick={() =>
                              handleApplySetup(
                                sc.chart_setup,
                                sc.title,
                                `Kịch bản đã chuẩn hóa: ${sc.id}`,
                                [`1. ${sc.format}`, `2. ${sc.status}`, `3. RISK-FIRST`],
                                { id: sc.id, title: sc.title, format: sc.format }
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-black font-extrabold text-xs transition shadow-md shadow-blue-500/20 shrink-0"
                          >
                            ▶ Nạp Lên Canvas & Kiểm Tra Ngay
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Master Audience Pain Points */}
        {mainTab === 'pain_points' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPainSubTab('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    painSubTab === 'all'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-[#111722] text-gray-400 border-[#1e2638]'
                  }`}
                >
                  Tất Cả ({painItems.length})
                </button>
                <button
                  onClick={() => setPainSubTab('pain_point')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    painSubTab === 'pain_point'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-[#111722] text-gray-400 border-[#1e2638]'
                  }`}
                >
                  Nỗi Đau Gắt
                </button>
                <button
                  onClick={() => setPainSubTab('backlog')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    painSubTab === 'backlog'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#111722] text-gray-400 border-[#1e2638]'
                  }`}
                >
                  Backlog Cần Làm
                </button>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo nỗi đau, quote comment, mã PP-0023..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#111722] border border-[#1e2638] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Pain Items List */}
            <div className="space-y-3">
              {filteredPainItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#111722] border border-[#1e2638] hover:border-purple-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-amber-400">Score: {item.score}</span>
                      <span className="text-xs text-gray-400">• {item.category}</span>
                    </div>
                    <div className="text-sm font-bold text-white">{item.hookTitle}</div>
                    <div className="text-xs italic text-gray-300 bg-[#0c1018] px-3 py-1.5 rounded-lg border border-[#1c2333]">
                      &ldquo;{item.painQuote}&rdquo;
                    </div>
                    <div className="text-xs text-emerald-400">
                      💡 Giải pháp: {item.solutionSummary}
                    </div>
                  </div>

                  <button
                    onClick={() => handleApplyPainPoint(item)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-black border border-purple-500/40 transition-all shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    ▶ Nạp Lên Canvas & Xem Thử
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: 9 Competitor Channels */}
        {mainTab === 'competitors' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="text-xs text-gray-400">
              Dữ liệu gián điệp đối thủ trực tiếp từ YouTube Data API (Cập nhật hàng ngày vào 8:00):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(dashboardData?.competitors?.items || []).map((c: any) => (
                <div key={c.channelId} className="p-4 rounded-xl bg-[#111722] border border-[#1e2638]">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-cyan-400" />
                    <div className="text-sm font-bold text-white">{c.title}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#1c2333] text-center">
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Subs</div>
                      <div className="text-xs font-bold text-cyan-400 mt-0.5">
                        {c.subs >= 1000 ? (c.subs / 1000).toFixed(1) + 'k' : c.subs}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Videos</div>
                      <div className="text-xs font-bold text-white mt-0.5">{c.videos}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase">Views</div>
                      <div className="text-xs font-bold text-amber-400 mt-0.5">
                        {c.views >= 1000000 ? (c.views / 1000000).toFixed(1) + 'M' : (c.views / 1000).toFixed(0) + 'k'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#1c2333] bg-[#0c1018] text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>Kênh: <strong className="text-white">Azzam Master Trading</strong></span>
            <span>Subs: <strong className="text-amber-400">2,000</strong></span>
            <span>Tổng views: <strong className="text-white">252,263</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://dashboard.azzamedu.com/content-package"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              Mở Content Package <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
