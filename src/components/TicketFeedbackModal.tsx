'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle,
  Copy,
  Image as ImageIcon,
  History,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
  Trash2,
  FileText,
  UploadCloud,
} from 'lucide-react';
import { useChartStore } from '../store/useChartStore';

interface TicketItem {
  ticketId: string;
  category: string;
  problem: string;
  desired: string;
  author: string;
  image?: string | null;
  createdAt: string;
  status: 'Đã gửi' | 'Đang xử lý' | 'Hoàn thành';
}

interface TicketFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'Kịch bản', label: '🎬 Kịch bản', sub: 'Hook 0-3s, Retest, Tâm lý trading' },
  { id: 'Nến', label: '📊 Nến', sub: 'OHLC, Râu sweep, FVG, Order Block' },
  { id: 'Giọng đọc', label: '🎙️ Giọng đọc', sub: 'Audio AI, Tốc độ, Lời thoại phụ đề' },
  { id: 'Xuất video', label: '📹 Xuất video', sub: 'Khung 9:16, Safe Zone, Độ phân giải' },
  { id: 'Khác', label: '⚡ Khác', sub: 'Giao diện, Báo lỗi, Đề xuất mới' },
];

export const TicketFeedbackModal: React.FC<TicketFeedbackModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTool } = useChartStore();

  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [category, setCategory] = useState<string>('Kịch bản');
  const [problem, setProblem] = useState<string>('');
  const [desired, setDesired] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<{
    ticketId: string;
    formattedSummary: string;
    specMarkdown: string;
  } | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  // Load saved tickets from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chartanimator_team_tickets');
        if (saved) setTickets(JSON.parse(saved));
        const savedAuthor = localStorage.getItem('chartanimator_ticket_author');
        if (savedAuthor) setAuthor(savedAuthor);
      } catch (e) {
        console.warn('Could not load tickets:', e);
      }
    }
  }, []);

  // Listen for Ctrl+V paste image from clipboard
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setImagePreview(event.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || !desired.trim()) {
      alert('Vui lòng điền đầy đủ: Vấn đề gặp phải và Kết quả mong muốn!');
      return;
    }

    setIsSubmitting(true);
    const ticketId = `TK-${Date.now().toString().slice(-4)}`;
    const finalAuthor = author.trim() || 'Thành viên Team';

    try {
      // Save author for next time
      if (typeof window !== 'undefined') {
        localStorage.setItem('chartanimator_ticket_author', finalAuthor);
      }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          category,
          problem,
          desired,
          author: finalAuthor,
          image: imagePreview,
        }),
      });

      const data = await res.json();

      const newTicket: TicketItem = {
        ticketId,
        category,
        problem,
        desired,
        author: finalAuthor,
        image: imagePreview,
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
        status: 'Đã gửi',
      };

      const updated = [newTicket, ...tickets];
      setTickets(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('chartanimator_team_tickets', JSON.stringify(updated));
      }

      setSubmitResult({
        ticketId,
        formattedSummary: data.formattedSummary || `[TICKET FEEDBACK ${ticketId}]
- Phần cần sửa: ${category}
- Vấn đề gặp phải: ${problem}
- Mong muốn: ${desired}
- Người gửi: ${finalAuthor}`,
        specMarkdown: data.specMarkdown || '',
      });
    } catch (err: any) {
      console.error('Submit error:', err);
      // Even if offline, save locally
      const fallbackTicket: TicketItem = {
        ticketId,
        category,
        problem,
        desired,
        author: finalAuthor,
        image: imagePreview,
        createdAt: new Date().toLocaleTimeString('vi-VN'),
        status: 'Đã gửi',
      };
      const updated = [fallbackTicket, ...tickets];
      setTickets(updated);
      localStorage.setItem('chartanimator_team_tickets', JSON.stringify(updated));

      setSubmitResult({
        ticketId,
        formattedSummary: `[TICKET FEEDBACK ${ticketId}]
- Phần cần sửa: ${category}
- Vấn đề gặp phải: ${problem}
- Mong muốn: ${desired}
- Người gửi: ${finalAuthor}`,
        specMarkdown: `# SPEC: [${ticketId}] Yêu Cầu Chỉnh Sửa\nVấn đề: ${problem}\nMong muốn: ${desired}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySummary = () => {
    if (!submitResult) return;
    navigator.clipboard.writeText(submitResult.formattedSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopySpec = () => {
    if (!submitResult) return;
    navigator.clipboard.writeText(submitResult.specMarkdown);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  const handleSendToHermes = () => {
    onClose();
    setActiveTool('hermes');
  };

  const handleResetForm = () => {
    setSubmitResult(null);
    setProblem('');
    setDesired('');
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B0E17] border border-[#1E293B] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0F1422]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <FileText className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-wide">
                  GỬI TICKET YÊU CẦU / FEEDBACK
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold border border-amber-500/30">
                  TEAM COPILOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Góp ý kịch bản, nến, giọng đọc & sinh SPEC tự động cho Hermes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center bg-[#141B2D] p-0.5 rounded-lg border border-[#1E293B]">
              <button
                type="button"
                onClick={() => { setActiveTab('create'); setSubmitResult(null); }}
                className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'create'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Tạo Mới</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Đã Gửi ({tickets.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'history' ? (
            /* History Tab */
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Chưa có ticket nào được gửi. Hãy tạo ticket đầu tiên!
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.ticketId}
                    className="p-4 rounded-xl bg-[#121826] border border-[#1E293B] hover:border-amber-500/40 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400 text-xs">#{t.ticketId}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {t.category}
                        </span>
                        <span className="text-[11px] text-slate-400">bởi {t.author}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{t.createdAt}</span>
                    </div>

                    <div className="text-xs text-slate-200">
                      <span className="text-rose-400 font-bold">Vấn đề: </span>
                      {t.problem}
                    </div>

                    <div className="text-xs text-emerald-300">
                      <span className="text-emerald-400 font-bold">Mong muốn: </span>
                      {t.desired}
                    </div>

                    {t.image && (
                      <div className="pt-1">
                        <img src={t.image} alt="Ticket preview" className="max-h-24 rounded border border-white/10" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : submitResult ? (
            /* Success & Action Screen */
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-300">
                    Đã Ghi Nhận Ticket #{submitResult.ticketId} Thành Công!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Bản đặc tả SPEC kỹ thuật đã được tạo tự động cho Hermes Orchestrator. Bạn có thể copy gửi vào nhóm chat hoặc nạp ngay cho Hermes xử lý.
                  </p>
                </div>
              </div>

              {/* Formatted Summary Box (for Zalo/Telegram) */}
              <div className="p-4 rounded-xl bg-[#121826] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                    Nội Dung Gửi Vào Nhóm Chat (Zalo / Telegram):
                  </span>
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Đã Copy!' : 'Copy Tin Nhắn'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-200 bg-[#090D16] p-3 rounded-lg whitespace-pre-wrap border border-white/5 leading-relaxed">
                  {submitResult.formattedSummary}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSendToHermes}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Kích Hoạt Hermes Xử Lý Ngay</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-200 font-bold text-xs transition"
                >
                  Tạo Thêm Ticket Khác
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Phần cần sửa (Category Picker) */}
              <div>
                <label className="text-xs font-mono text-amber-400 font-bold uppercase block mb-2">
                  1. Phần Cần Sửa Đổi / Góp Ý:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`p-2.5 rounded-xl text-left border transition flex flex-col gap-0.5 ${
                        category === c.id
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                          : 'bg-[#121826] border-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#182032]'
                      }`}
                    >
                      <span className={`text-xs font-bold ${category === c.id ? 'text-amber-300' : 'text-slate-200'}`}>
                        {c.label}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight">
                        {c.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Vấn đề gặp phải */}
              <div>
                <label className="text-xs font-mono text-rose-400 font-bold uppercase block mb-1">
                  2. Vấn Đề Gặp Phải (Hiện Tại Đang Bị Gì):
                </label>
                <textarea
                  required
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Ví dụ: Chữ phụ đề chạy hơi nhanh so với nến, nến quét đỉnh xong chưa đổi màu đường sweep, chữ bị đè lên tai thỏ điện thoại..."
                  className="w-full bg-[#121826] border border-[#1E293B] focus:border-rose-500/60 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition leading-relaxed resize-none"
                />
              </div>

              {/* 3. Mong muốn */}
              <div>
                <label className="text-xs font-mono text-emerald-400 font-bold uppercase block mb-1">
                  3. Kết Quả Mong Muốn (Cần Sửa Thành Thế Nào):
                </label>
                <textarea
                  required
                  rows={2}
                  value={desired}
                  onChange={(e) => setDesired(e.target.value)}
                  placeholder="Ví dụ: Kéo dài thời gian đọc Stage 3 thêm 1.5 giây, thêm setup nến quét đáy phiên Á, cho chữ phụ đề xuống thấp hơn 10px..."
                  className="w-full bg-[#121826] border border-[#1E293B] focus:border-emerald-500/60 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition leading-relaxed resize-none"
                />
              </div>

              {/* 4. Tên người gửi & Ảnh chụp màn hình */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase block mb-1">
                    4. Người Gửi (Tên / Nick Zalo / Telegram):
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ví dụ: Hoàng Kỳ Anh, Trader Nam, Editor Tuấn..."
                    className="w-full bg-[#121826] border border-[#1E293B] focus:border-amber-500/60 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition"
                  />
                </div>

                {/* Screenshot Upload / Paste */}
                <div>
                  <label className="text-xs font-mono text-slate-400 font-bold uppercase block mb-1 flex items-center justify-between">
                    <span>5. Ảnh Chụp (Dán Ctrl+V hoặc Tải Lên):</span>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="text-[10px] text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Xóa ảnh
                      </button>
                    )}
                  </label>

                  {imagePreview ? (
                    <div className="relative rounded-xl border border-amber-500/40 p-1 bg-[#121826] flex items-center gap-2">
                      <img src={imagePreview} alt="Screenshot" className="w-12 h-10 object-cover rounded" />
                      <span className="text-[11px] text-amber-300 font-mono">Đã đính kèm ảnh chụp màn hình</span>
                    </div>
                  ) : (
                    <label className="w-full h-[38px] bg-[#121826] hover:bg-[#182032] border border-dashed border-[#1E293B] hover:border-amber-500/50 rounded-xl px-3 flex items-center justify-center gap-2 text-xs text-slate-400 cursor-pointer transition">
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>Chọn ảnh hoặc bấm Ctrl+V</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-98 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSubmitting ? 'Đang Tạo Ticket & Sinh SPEC...' : 'Gửi Ticket & Xuất SPEC Cho Hermes'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

