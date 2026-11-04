export async function loadRenderAssets(): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
}

