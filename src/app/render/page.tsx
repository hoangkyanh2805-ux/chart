import React from 'react';
import { HeadlessRenderSurface } from '../../components/HeadlessRenderSurface';

export const metadata = {
  title: 'ChartAnimator — Headless Render Surface',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RenderPage() {
  return <HeadlessRenderSurface />;
}
