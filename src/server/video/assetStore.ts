import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const MAX_ASSET_BYTES = 100 * 1024 * 1024; // 100MB

export class ConfinedAssetStore {
  private baseDir: string;

  constructor(baseDir: string = path.resolve(process.cwd(), 'livrables/s2v_runs/assets')) {
    this.baseDir = path.resolve(baseDir);
    fs.mkdirSync(this.baseDir, { recursive: true });
  }

  saveAsset(
    bytes: Buffer,
    extension: string = '.wav'
  ): { assetId: string; sha256: string; filePath: string } {
    if (bytes.length > MAX_ASSET_BYTES) {
      throw new Error(`Asset exceeds maximum allowed size of 100MB (${bytes.length} bytes)`);
    }

    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    const assetId = `asset_${sha256.substring(0, 16)}`;
    const safeFilename = `${assetId}${extension}`;
    const filePath = path.resolve(this.baseDir, safeFilename);

    // Verify confinement
    if (!filePath.startsWith(this.baseDir)) {
      throw new Error('Path traversal detected');
    }

    fs.writeFileSync(filePath, bytes);
    return { assetId, sha256, filePath };
  }

  getAssetPath(assetId: string, extension: string = '.wav'): string | null {
    // Sanitize assetId to alphanumeric + underscore
    if (!/^[a-zA-Z0-9_-]+$/.test(assetId)) {
      throw new Error('Invalid asset ID format');
    }

    const filePath = path.resolve(this.baseDir, `${assetId}${extension}`);
    if (!filePath.startsWith(this.baseDir)) {
      throw new Error('Path traversal detected');
    }

    if (!fs.existsSync(filePath)) {
      return null;
    }

    return filePath;
  }
}

