'use client';

import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, AlertTriangle, X, Shield, ExternalLink, RefreshCw, Trash2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (newKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [keyInput, setKeyInput] = useState<string>('');
  const [savedKey, setSavedKey] = useState<string>('');
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key') || '';
      setSavedKey(stored);
      setKeyInput(stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async (keyToTest: string) => {
    if (!keyToTest.trim()) {
      setTestingStatus('error');
      setStatusMessage('Vui lòng nhập API Key trước khi kiểm tra');
      return;
    }

    setTestingStatus('testing');
    setStatusMessage('Đang kiểm tra kết nối với Google AI...');

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${keyToTest.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'ping' }] }],
          }),
        }
      );

      if (res.ok) {
        setTestingStatus('success');
        setStatusMessage('✅ API Key hợp lệ và sẵn sàng hoạt động (Model: Gemini 2.5 Flash Lite)!');
      } else {
        const errData = await res.json().catch(() => ({}));
        setTestingStatus('error');
        setStatusMessage(
          `❌ Key không hợp lệ hoặc đã hết hạn (${errData.error?.message || 'Lỗi HTTP ' + res.status})`
        );
      }
    } catch (err: any) {
      setTestingStatus('error');
      setStatusMessage(`❌ Không thể kết nối tới Google API: ${err.message}`);
    }
  };

  const handleSave = () => {
    const trimmed = keyInput.trim();
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('gemini_api_key', trimmed);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    }
    setSavedKey(trimmed);
    if (onKeySaved) onKeySaved(trimmed);
    onClose();
  };

  const handleRemove = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gemini_api_key');
    }
    setKeyInput('');
    setSavedKey('');
    setTestingStatus('idle');
    setStatusMessage('');
    if (onKeySaved) onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0F1420] border border-[#1E293B] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200 select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Cài Đặt & Đổi Google Gemini API Key</h3>
              <p className="text-[11px] text-slate-400">Đổi key trực tiếp trên giao diện, không cần đụng đến code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status Badge */}
        <div className="bg-[#141B29] border border-[#1E293B] rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium">Trạng thái hiện tại:</span>
          {savedKey ? (
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Đã lưu Key ({savedKey.substring(0, 6)}...{savedKey.substring(savedKey.length - 4)})</span>
            </span>
          ) : (
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Dùng Server / Native Engine</span>
            </span>
          )}
        </div>

        {/* Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-300 font-semibold flex items-center justify-between">
            <span>Dán Google Gemini API Key mới:</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Lấy key miễn phí tại Google</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <input
            type="password"
            placeholder="Dán key vào đây (ví dụ: AIzaSy... hoặc AQ.Ab8...)"
            value={keyInput}
            onChange={(e) => {
              setKeyInput(e.target.value);
              setTestingStatus('idle');
              setStatusMessage('');
            }}
            className="w-full bg-[#141B29] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Test Result Message */}
        {testingStatus !== 'idle' && (
          <div
            className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
              testingStatus === 'testing'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                : testingStatus === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {testingStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin flex-shrink-0" />}
            {testingStatus === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            {testingStatus === 'error' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            <span className="text-[11px] leading-tight">{statusMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleTestKey(keyInput)}
            disabled={testingStatus === 'testing' || !keyInput.trim()}
            className="flex-1 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-slate-200 font-semibold text-xs transition disabled:opacity-50"
          >
            {testingStatus === 'testing' ? 'Đang kiểm tra...' : 'Kiểm Tra Key (Test)'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition"
          >
            Lưu Key Vào Trình Duyệt
          </button>
        </div>

        {savedKey && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5 py-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa Key khỏi trình duyệt (Chuyển về mặc định)</span>
          </button>
        )}

        <div className="text-[10px] text-slate-500 leading-relaxed border-t border-[#1E293B] pt-2.5">
          🔒 <span className="font-semibold text-slate-400">Bảo mật:</span> Key được lưu an toàn trong trình duyệt (LocalStorage) của riêng bạn và chỉ được gửi trực tiếp đến Google AI khi phân tích brief.
        </div>
      </div>
    </div>
  );
};
