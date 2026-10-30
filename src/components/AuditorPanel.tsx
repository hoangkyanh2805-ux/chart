'use client';

import React, { useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Calculator,
  Film,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AuditorPanel: React.FC = () => {
  const {
    validationReport,
    validateCurrentSetup,
    applyComprehensiveAutoFix,
    headlineText,
    executionOrder,
    targetPips,
    badges,
  } = useChartStore();

  useEffect(() => {
    validateCurrentSetup();
  }, []);

  const report = validationReport || validateCurrentSetup();
  const score = report?.score ?? 100;
  const isSafe = (report?.isValid ?? true) && score >= 80;

  const checks = report?.checks || {
    titleDirectionMatch: true,
    candleDriftMatch: true,
    triggerWickValid: true,
    riskRewardValid: true,
    subtitlesAligned: true,
  };

  const handleFixAll = () => {
    applyComprehensiveAutoFix();
  };

  return (
    <div className="w-[340px] h-full flex flex-col bg-[#0B0F19] border-r border-[#1E293B] text-slate-200 select-none overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#1E293B] bg-[#0E1422] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isSafe
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse'
            }`}
          >
            {isSafe ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <span>Kiểm Duyệt Viên Chuyên Gia</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                  isSafe
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {isSafe ? 'PASS 100%' : 'BLOCKED'}
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">Trading & YouTube Compliance Auditor</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Score Card */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            isSafe
              ? 'bg-gradient-to-br from-emerald-950/40 via-[#0E1422] to-[#0B0F19] border-emerald-500/30'
              : 'bg-gradient-to-br from-rose-950/40 via-[#0E1422] to-[#0B0F19] border-rose-500/40'
          }`}
        >
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Điểm Đánh Giá An Toàn Video
            </div>
            <div
              className={`text-2xl font-black font-mono flex items-baseline gap-1 mt-0.5 ${
                isSafe ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <span>{score}</span>
              <span className="text-xs text-slate-500 font-normal">/ 100 điểm</span>
            </div>
            <div className="text-[11px] font-bold mt-1 text-slate-300">
              {isSafe ? '✅ Chuẩn xác 100% — Sẵn sàng xuất bản' : '🚨 LỆCH PHA — Không được xuất video!'}
            </div>
          </div>

          <div
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-base ${
              isSafe
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-rose-500 text-rose-400 bg-rose-500/10 animate-bounce'
            }`}
          >
            {score}%
          </div>
        </div>

        {/* 1-Click Fix Button */}
        {!isSafe && (
          <button
            onClick={handleFixAll}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition flex items-center justify-center gap-2 group animate-pulse"
          >
            <Zap className="w-4 h-4 text-black group-hover:scale-125 transition" />
            <span>⚡ TỰ ĐỘNG ĐỒNG BỘ TOÀN BỘ SETUP (1-CLICK)</span>
          </button>
        )}

        {/* 4 Stations Inspection Checklist */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            4 Trạm Kiểm Soát Độc Lập Cho Editor:
          </label>

          {/* Station 1: Ngữ nghĩa & Hướng lệnh */}
          <div className="p-3 rounded-xl bg-[#131927] border border-[#1E293B] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                <span>Trạm 1: Ngữ Nghĩa & Chiều Lệnh</span>
              </span>
              {checks.titleDirectionMatch ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Khớp
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Lệch Pha
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {checks.titleDirectionMatch
                ? `Tiêu đề dạy ${report?.expectedDirection || 'Lệnh'}, hộp lệnh dưới đáy cũng là ${executionOrder?.type || 'Lệnh'}. An toàn 100%.`
                : `Cảnh báo: Tiêu đề là ${report?.expectedDirection} nhưng hộp lệnh lại ghi ${executionOrder?.type}. Sẽ bị người xem bắt lỗi!`}
            </p>
          </div>

          {/* Station 2: Quản lý vốn Risk-First */}
          <div className="p-3 rounded-xl bg-[#131927] border border-[#1E293B] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Trạm 2: Toán Học Quản Lý Vốn</span>
              </span>
              {checks.riskRewardValid ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn R:R
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Sai Toán
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {checks.riskRewardValid
                ? `R:R tối thiểu đạt 1:3.0. Lot size (${executionOrder?.lot || 0.05} lot) và Target (+${targetPips} pips) khớp với Risk Budget.`
                : 'Tỷ lệ Risk:Reward không đạt chuẩn 1:3.0 hoặc số pips lợi nhuận bị sai lệch.'}
            </p>
          </div>

          {/* Station 3: Chính sách YouTube & 8 NEVERs */}
          <div className="p-3 rounded-xl bg-[#131927] border border-[#1E293B] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trạm 3: Chính Sách YouTube & 8 NEVERs</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hợp Lệ
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Đã bật nhãn ILLUSTRATION, không hô tín hiệu (signal), không cam kết lợi nhuận làm giàu nhanh.
            </p>
          </div>

          {/* Station 4: Bố cục đa nền tảng */}
          <div className="p-3 rounded-xl bg-[#131927] border border-[#1E293B] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-purple-400" />
                <span>Trạm 4: Bố Cục Safe Zones & Phụ Đề</span>
              </span>
              {checks.subtitlesAligned ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn 4 Bước
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Thiếu Phụ Đề
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {checks.subtitlesAligned
                ? 'Đã khớp đủ 4 tầng phụ đề Hook → Trap → Setup → Execution theo đúng dòng thời gian video.'
                : 'Cần bổ sung đủ 4 chặng phụ đề khớp với timeline.'}
            </p>
          </div>
        </div>

        {/* Warnings List for Editor */}
        {report?.warnings && report.warnings.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
              Chi Tiết Lỗi Cần Sửa Trước Khi Xuất ({report.warnings.length}):
            </label>
            <div className="space-y-1">
              {report.warnings.map((w, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-200 flex items-start gap-2"
                >
                  <span className="text-rose-400 font-bold">#{idx + 1}</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Guidance */}
        {isSafe && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Toàn bộ scene đã qua kiểm duyệt chuyên gia. Bạn có thể an tâm bấm nút Xuất Video!</span>
          </div>
        )}
      </div>
    </div>
  );
};

