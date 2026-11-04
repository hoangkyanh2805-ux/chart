'use client';

import React, { useState } from 'react';
import { SceneDraft, FrozenScene } from '../video/contracts';
import { validateDraft } from '../video/validateDraft';
import { compileScene } from '../video/compileScene';

interface SceneReviewPanelProps {
  draft: SceneDraft;
  onApplyDraft?: (draft: SceneDraft) => void;
}

export function SceneReviewPanel({ draft }: SceneReviewPanelProps) {
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const issues = validateDraft(draft);
  const isValid = issues.length === 0;

  const handleExport = async () => {
    setErrorMsg(null);
    setIsExporting(true);

    const compileRes = compileScene(draft);
    if (!compileRes.ok) {
      setErrorMsg(`Compilation failed: ${compileRes.issues.map((i) => i.message).join(', ')}`);
      setIsExporting(false);
      return;
    }

    const frozenScene = compileRes.value;

    try {
      const res = await fetch('/api/render/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(frozenScene),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit render job');
      }

      const jobReceipt = await res.json();
      setJobId(jobReceipt.id);
      setJobStatus(jobReceipt.status);

      // Poll status
      pollStatus(jobReceipt.id);
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsExporting(false);
    }
  };

  const pollStatus = async (id: string) => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/render/jobs/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setJobStatus(data.status);

        if (data.status === 'MEDIA_VERIFIED' || data.status === 'FAILED' || data.status === 'CANCELLED') {
          clearInterval(timer);
          setIsExporting(false);
        }
      } catch (e) {
        clearInterval(timer);
        setIsExporting(false);
      }
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white max-w-4xl mx-auto shadow-2xl my-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            🎬 Script-to-Video Canonical Review Panel
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Source: <span className="text-blue-400 font-mono">{draft.source.id}</span> (Rev {draft.source.revision})
          </p>
        </div>
        <div>
          {isValid ? (
            <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-semibold">
              ✓ VALIDATED
            </span>
          ) : (
            <span className="bg-amber-950 border border-amber-500/30 text-amber-400 text-xs px-3 py-1.5 rounded-full font-semibold">
              ⚠️ NEEDS REVIEW ({issues.length} issues)
            </span>
          )}
        </div>
      </div>

      {/* Issues Alert */}
      {issues.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-lg p-4 mb-6">
          <h4 className="text-rose-400 font-semibold text-sm mb-2">Validation Issues:</h4>
          <ul className="text-xs text-rose-300 list-disc pl-5 space-y-1">
            {issues.map((iss, idx) => (
              <li key={idx}>
                <span className="font-mono text-rose-200">[{iss.code}]</span> {iss.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Facts Card */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium">Risk Budget</div>
          <div className="text-lg font-bold text-white mt-1">
            ${draft.budget?.riskUsd} / {draft.budget?.slPips} pips
          </div>
          <div className="text-xs text-emerald-400 font-mono mt-0.5">${draft.budget?.usdPerPip}/pip</div>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium">Lesson Outcome</div>
          <div className="text-lg font-bold text-rose-400 mt-1">
            {draft.outcome === 'STOP_LOSS' ? '❌ STOP LOSS HIT' : draft.outcome}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Risk-First Lesson</div>
        </div>

        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium">Profile & Theme</div>
          <div className="text-lg font-bold text-white mt-1">1080×1920 (30fps)</div>
          <div className="text-xs text-blue-400 capitalize mt-0.5">Theme: {draft.theme}</div>
        </div>
      </div>

      {/* Narration Cues */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Narration & Storyboard Cues ({draft.narration.length})</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {draft.narration.map((cue, idx) => (
            <div key={cue.id} className="bg-slate-800/40 border border-slate-700/40 p-3 rounded-lg flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-blue-400">
                  #{idx + 1} [{cue.intentId}] ({cue.span.startUtf16}..{cue.span.endUtf16})
                </div>
                <div className="text-sm text-slate-200 mt-1">{cue.text}</div>
              </div>
              <div className="ml-4 shrink-0">
                {cue.audio ? (
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/40">
                    Audio Ready ({cue.audio.sampleCount}smp)
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                    Audio Unbound
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action / Export Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <div>
          {jobStatus && (
            <div className="text-sm font-mono flex items-center gap-2">
              <span className="text-slate-400">Job:</span>
              <span className="text-blue-400">{jobId}</span>
              <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded text-xs border border-blue-800">
                {jobStatus}
              </span>
            </div>
          )}
          {errorMsg && <div className="text-xs text-rose-400 mt-1">{errorMsg}</div>}
        </div>

        <div className="flex items-center gap-3">
          {jobStatus === 'MEDIA_VERIFIED' && jobId && (
            <a
              href={`/api/render/jobs/${jobId}/artifact`}
              download
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition"
            >
              📥 Download Verified MP4
            </a>
          )}

          <button
            onClick={handleExport}
            disabled={!isValid || isExporting}
            className={`font-semibold text-sm px-5 py-2 rounded-lg transition flex items-center gap-2 ${
              !isValid || isExporting
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
            }`}
          >
            {isExporting ? '⏳ Rendering MP4...' : '🚀 Freeze & Export Video'}
          </button>
        </div>
      </div>
    </div>
  );
}

