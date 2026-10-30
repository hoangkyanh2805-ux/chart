'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { exportCanvasVideo } from '../utils/recorder';
import { Video, X, CheckCircle2, Loader2, Sparkles, Film, ShieldAlert, ShieldCheck, Zap, Lock, Globe } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const {
    duration,
    setCurrentTime,
    setIsPlaying,
    settings,
    validationReport,
    validateCurrentSetup,
    applyComprehensiveAutoFix,
    applyEnglishVersion,
    headlineText,
    sublineText,
    calloutPinText,
  } = useChartStore();

  const [fps, setFps] = useState<number>(30);
  const [exportLanguage, setExportLanguage] = useState<'en' | 'vi'>('en');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');

  const report = validationReport || (isOpen ? validateCurrentSetup() : null);
  const score = report?.score ?? 100;
  const isSafe = (report?.isValid ?? true) && score >= 80;

  if (!isOpen) return null;

  const handleStartExport = () => {
    // If English version is chosen, ensure current canvas state is translated to English
    if (exportLanguage === 'en') {
      applyEnglishVersion();
    }

    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      alert('Không tìm thấy Canvas!');
      return;
    }

    setIsPlaying(false);
    setIsExporting(true);
    setProgress(0);
    setDownloadUrl(null);

    exportCanvasVideo(
      canvas,
      (timeSec) => {
        // Drive timeline frame-by-frame
        setCurrentTime(timeSec);
      },
      {
        fps,
        durationSec: duration,
        onProgress: (percent) => {
          setProgress(percent);
        },
        onComplete: (blob, filename) => {
          setIsExporting(false);
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setDownloadFilename(filename);

          // Auto-trigger download
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        onError: (err) => {
          setIsExporting(false);
          alert('Lỗi xuất video: ' + err.message);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#111722] border border-[#1E293B] rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Xuất Video Hoạt Ảnh (Export)</h3>
              <p className="text-xs text-slate-400">Đóng gói Canvas thành video cho TikTok, Shorts & YouTube</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Settings */}
        {!isExporting && !downloadUrl && (
          <div className="flex flex-col gap-4">
            {/* Format Info */}
            <div className="bg-[#161F2E] p-3 rounded-xl border border-[#1E293B] flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Định dạng xuất:</span>
                <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
                  📱 TikTok / Shorts 9:16 Vertical
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Thời lượng video:</span>
                <span className="font-bold text-white font-mono">{duration.toFixed(1)} giây</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Bộ giải mã:</span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">MP4 / WebM H.264 60FPS</span>
              </div>
            </div>

            {/* Language Selection: English (US/EU) vs Vietnamese */}
            <div className="bg-[#121927] p-3 rounded-xl border border-blue-500/30 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  Ngôn ngữ video xuất bản:
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  {exportLanguage === 'en' ? '🇺🇸 Khách Âu - Mỹ' : '🇻🇳 Khán Giả Việt'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setExportLanguage('en');
                    applyEnglishVersion();
                  }}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    exportLanguage === 'en'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-md shadow-blue-500/25'
                      : 'border-[#1E293B] bg-[#161F2E] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇺🇸 English (US/EU)</span>
                  {exportLanguage === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
                <button
                  type="button"
                  onClick={() => setExportLanguage('vi')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    exportLanguage === 'vi'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/20'
                      : 'border-[#1E293B] bg-[#161F2E] text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🇻🇳 Tiếng Việt</span>
                  {exportLanguage === 'vi' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>

              {exportLanguage === 'en' && (
                <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-200 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[10px]">Bản dựng Tiếng Anh chuẩn Quốc Tế:</span>
                    <button
                      type="button"
                      onClick={() => applyEnglishVersion()}
                      className="text-[10px] text-amber-400 hover:underline font-mono"
                    >
                      ⚡ Cập nhật lại
                    </button>
                  </div>
                  <div className="truncate font-bold text-amber-300">Hook: &ldquo;{headlineText}&rdquo;</div>
                  <div className="text-[10px] text-slate-300">✓ Phụ đề & Callout đã chuyển sang tiếng Anh chuẩn thuật ngữ SMC.</div>
                </div>
              )}
            </div>

            {/* TikTok Production Checklist */}
            <div className="bg-[#101725] p-3 rounded-xl border border-indigo-900/40 flex flex-col gap-1.5 text-[11px]">
              <span className="font-bold text-indigo-300 font-mono text-[10px] uppercase">
                Tiêu chuẩn video TikTok Hexagold:
              </span>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Hook 0-3s giật gân, chữ to tương phản cao</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Nến quét đỉnh (Liquidity Sweep) & FVG Retest</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Phụ đề kịch bản 4 bước khớp từng giây timeline</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Safe Zone chuẩn TikTok (không che bởi nút Like/Share)</span>
              </div>
            </div>

            {/* FPS Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Tốc độ khung hình (Frame Rate):</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFps(30)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    fps === 30
                      ? 'bg-primary text-white border-primary shadow'
                      : 'border-[#1E293B] bg-[#161F2E] text-slate-400 hover:text-white'
                  }`}
                >
                  30 FPS (Chuẩn)
                </button>
                <button
                  type="button"
                  onClick={() => setFps(60)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    fps === 60
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold border-amber-400 shadow-lg'
                      : 'border-[#1E293B] bg-[#161F2E] text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ 60 FPS (Siêu Mượt TikTok)
                </button>
              </div>
            </div>

            {/* Compliance Hard Gate Warning or Safe Badge */}
            {!isSafe ? (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex flex-col gap-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-pulse" />
                  <span>🚨 KHÓA XUẤT VIDEO (LỆCH PHA KỸ THUẬT)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Phát hiện <span className="font-bold text-rose-300">{report?.warnings?.length || 1} lỗi lệch pha</span> (chiều lệnh, toán R:R hoặc pips lợi nhuận). Nếu xuất bản lên YouTube sẽ bị người xem bóc phốt!
                </p>
                <button
                  type="button"
                  onClick={() => applyComprehensiveAutoFix()}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition group"
                >
                  <Zap className="w-4 h-4 text-black group-hover:scale-125 transition" />
                  <span>⚡ TỰ ĐỘNG SỬA HẾT ĐỂ MỞ KHÓA XUẤT (1-CLICK)</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-emerald-300 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-bold">✅ ĐÃ QUA KIỂM DUYỆT CHUYÊN GIA — 100% AN TOÀN XUẤT BẢN</span>
              </div>
            )}

            {/* Start Button (Hard Gated) */}
            <button
              onClick={handleStartExport}
              disabled={!isSafe || isExporting}
              className={`mt-1 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition ${
                isSafe
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black shadow-emerald-500/20 active:scale-95 cursor-pointer'
                  : 'bg-[#1E293B] text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {isSafe ? (
                <>
                  <Video className="w-4 h-4" /> Xuất Video {settings.aspectRatio} [{exportLanguage === 'en' ? '🇺🇸 English US/EU' : '🇻🇳 Tiếng Việt'}] Ngay ({fps} FPS)
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Đã Khóa Xuất (Bấm Tự Sửa Để Mở Khóa)
                </>
              )}
            </button>
          </div>
        )}

        {/* Exporting Progress */}
        {isExporting && (
          <div className="flex flex-col items-center justify-center py-6 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="text-center">
              <h4 className="text-sm font-bold text-white">Đang Render Video ({progress}%)...</h4>
              <p className="text-xs text-slate-400 mt-1">Đang tua từng khung hình Canvas và đóng gói video stream.</p>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#1E293B] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-150 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Export Success */}
        {downloadUrl && (
          <div className="flex flex-col items-center justify-center py-4 gap-4 text-center">
            <div className="w-12 h-12 bg-bullish/20 text-bullish rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Xuất Video Thành Công!</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tệp tin <span className="text-white font-mono">{downloadFilename}</span> đã tự động tải xuống.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <a
                href={downloadUrl}
                download={downloadFilename}
                className="flex-1 py-2.5 bg-[#1C2638] hover:bg-[#25334D] text-white rounded-xl text-xs font-semibold border border-[#1E293B] transition"
              >
                Tải lại file
              </a>
              <button
                onClick={() => {
                  setDownloadUrl(null);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold transition"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
