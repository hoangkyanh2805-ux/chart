'use client';

import { useEffect, useRef } from 'react';
import { useChartStore } from '../store/useChartStore';

export function useAudioPlaybackSync() {
  const {
    isPlaying,
    currentTime,
    duration,
    voiceAudioUrl,
    isAudioMuted,
    scriptSubtitles,
  } = useChartStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSpokenSubIndexRef = useRef<number>(-1);

  // 1. Gemini Cloud Audio (WAV) Playback Sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    if (voiceAudioUrl) {
      if (audio.src !== voiceAudioUrl) {
        audio.src = voiceAudioUrl;
        audio.load();
      }
    } else {
      audio.pause();
      audio.src = '';
    }

    audio.muted = isAudioMuted;

    if (isPlaying && voiceAudioUrl && !isAudioMuted) {
      if (Math.abs(audio.currentTime - currentTime) > 0.3) {
        audio.currentTime = Math.min(currentTime, audio.duration || currentTime);
      }
      audio.play().catch((err) => {
        console.warn('Audio play hindered by browser autoplay policy:', err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, voiceAudioUrl, isAudioMuted]);

  // Handle scrub / seek sync for Cloud Audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !voiceAudioUrl) return;

    if (Math.abs(audio.currentTime - currentTime) > 0.4) {
      audio.currentTime = Math.min(currentTime, audio.duration || currentTime);
    }
  }, [currentTime, voiceAudioUrl]);

  // 2. Dual-Engine Fallback: Web Speech API (Local / Native Browser Voice)
  // When voiceAudioUrl is not generated or Gemini API hits 429 daily quota
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // If Gemini audio is playing or audio is muted or video is stopped, cancel Web Speech
    if (voiceAudioUrl || !isPlaying || isAudioMuted) {
      window.speechSynthesis.cancel();
      lastSpokenSubIndexRef.current = -1;
      return;
    }

    if (!scriptSubtitles || scriptSubtitles.length === 0) return;

    // Determine which subtitle stage is active based on currentTime / duration
    const progress = duration > 0 ? currentTime / duration : 0;
    let activeIndex = -1;
    for (let i = scriptSubtitles.length - 1; i >= 0; i--) {
      const subPercent = scriptSubtitles[i].timePercent ?? (i / scriptSubtitles.length);
      if (progress >= subPercent) {
        activeIndex = i;
        break;
      }
    }

    if (activeIndex !== -1 && activeIndex !== lastSpokenSubIndexRef.current) {
      lastSpokenSubIndexRef.current = activeIndex;
      const sub = scriptSubtitles[activeIndex];
      const rawText = typeof sub === 'string' ? sub : sub.text || '';
      const textToSpeak = rawText.replace(/^HOOK:\s*/i, '').trim();

      if (textToSpeak) {
        window.speechSynthesis.cancel(); // Stop any pending utterance

        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        // Detect language: Vietnamese vs English
        const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(textToSpeak);
        utterance.lang = isVietnamese ? 'vi-VN' : 'en-US';
        utterance.rate = 1.05; // Slightly brisk for trading retention
        utterance.pitch = 1.0;

        // Try picking the best available natural browser voice
        const voices = window.speechSynthesis.getVoices();
        const bestVoice = voices.find((v) =>
          isVietnamese
            ? v.lang.includes('vi') || v.name.includes('Vietnamese') || v.name.includes('HoaiMy') || v.name.includes('NamMinh')
            : v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Christopher') || v.name.includes('Guy'))
        );
        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    }
  }, [isPlaying, currentTime, duration, voiceAudioUrl, isAudioMuted, scriptSubtitles]);

  // Clean up Web Speech when paused or stopped
  useEffect(() => {
    if (!isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      lastSpokenSubIndexRef.current = -1;
    }
  }, [isPlaying]);

  return { audioRef };
}
