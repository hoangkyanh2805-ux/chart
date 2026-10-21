import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChartAnimator — Animated Trading Chart Video Maker',
  description: 'Create animated candlestick trading patterns for TikTok, YouTube Shorts, and Reels.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B0E14]">{children}</body>
    </html>
  );
}
