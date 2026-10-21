'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { exportCanvasVideo } from '../utils/recorder';
import { Video, X, CheckCircle2, Loader2, Sparkles, Film } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { duration, setCurrentTime, setIsPlaying, settings } = useChartStore();

  const [fps, setFps] = useState<number>(30);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');

  if (!isOpen) return null;

  const handleStartExport = () => {
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
                <span className="text-slate-400">Tỷ lệ khung hình:</span>
                <span className="font-bold text-primary font-mono">{settings.aspectRatio}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Thời lượng video:</span>
                <span className="font-bold text-white font-mono">{duration.toFixed(1)} giây</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Mục đích tối ưu:</span>
                <span className="text-slate-300">
                  {settings.aspectRatio === '9:16'
                    ? 'TikTok / YouTube Shorts / Reels (Dọc)'
                    : settings.aspectRatio === '16:9'
                    ? 'YouTube Video (Ngang)'
                    : 'Instagram Post (Vuông)'}
                </span>
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
                  30 FPS (Mặc định - Nhanh)
                </button>
                <button
                  type="button"
                  onClick={() => setFps(60)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                    fps === 60
                      ? 'bg-primary text-white border-primary shadow'
                      : 'border-[#1E293B] bg-[#161F2E] text-slate-400 hover:text-white'
                  }`}
                >
                  60 FPS (Siêu mượt)
                </button>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartExport}
              className="mt-2 w-full py-3 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition"
            >
              <Video className="w-4 h-4" /> Bắt đầu Render & Tải Video
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
