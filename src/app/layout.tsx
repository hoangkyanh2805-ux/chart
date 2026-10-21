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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;900&family=Montserrat:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B0E14]">{children}</body>
    </html>
  );
}
