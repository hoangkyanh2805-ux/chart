export interface ThemeTokens {
  name: 'paper' | 'dark' | 'white';
  background: string;
  gridLine: string;
  textPrimary: string;
  textSecondary: string;
  bullishCandle: string;
  bearishCandle: string;
  candleWick: string;
  supportLevel: string;
  fvgBoxFill: string;
  fvgBoxStroke: string;
  watermarkText: string;
  badgeBg: string;
  badgeText: string;
}

export const THEMES: Record<'paper' | 'dark' | 'white', ThemeTokens> = {
  paper: {
    name: 'paper',
    background: '#E6C191',
    gridLine: 'rgba(30, 58, 95, 0.08)',
    textPrimary: '#0F172A',
    textSecondary: '#1E3A5F',
    bullishCandle: '#1E3A5F',
    bearishCandle: '#B91C1C',
    candleWick: '#0F172A',
    supportLevel: '#1D4ED8',
    fvgBoxFill: 'rgba(217, 119, 6, 0.18)',
    fvgBoxStroke: '#92400E',
    watermarkText: 'rgba(15, 23, 42, 0.65)',
    badgeBg: '#1E3A5F',
    badgeText: '#FFFFFF',
  },
  dark: {
    name: 'dark',
    background: '#080C16',
    gridLine: 'rgba(255, 255, 255, 0.05)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    bullishCandle: '#10B981',
    bearishCandle: '#EF4444',
    candleWick: '#CBD5E1',
    supportLevel: '#3B82F6',
    fvgBoxFill: 'rgba(245, 158, 11, 0.15)',
    fvgBoxStroke: '#F59E0B',
    watermarkText: 'rgba(248, 250, 252, 0.55)',
    badgeBg: '#1E293B',
    badgeText: '#F8FAFC',
  },
  white: {
    name: 'white',
    background: '#FFFFFF',
    gridLine: 'rgba(0, 0, 0, 0.04)',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    bullishCandle: '#11806C',
    bearishCandle: '#000000',
    candleWick: '#000000',
    supportLevel: '#0284C7',
    fvgBoxFill: 'rgba(205, 235, 252, 0.7)',
    fvgBoxStroke: '#38BDF8',
    watermarkText: 'rgba(15, 23, 42, 0.35)',
    badgeBg: '#F1F5F9',
    badgeText: '#0F172A',
  },
};

