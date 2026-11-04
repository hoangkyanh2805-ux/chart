import { SourceDocument, Result, Issue } from './contracts';
import { hashText } from './canonicalHash';

export function verifySource(source: SourceDocument): Result<SourceDocument> {
  const issues: Issue[] = [];

  if (!source || typeof source !== 'object') {
    return {
      ok: false,
      issues: [{ code: 'INVALID_SOURCE', path: 'source', message: 'Source must be an object', severity: 'error' }],
    };
  }

  if (typeof source.selectedText !== 'string' || source.selectedText.length === 0) {
    issues.push({ code: 'EMPTY_TEXT', path: 'source.selectedText', message: 'Selected text cannot be empty', severity: 'error' });
  }

  const computedHash = hashText(source.selectedText || '');
  if (computedHash !== source.selectedTextSha256) {
    issues.push({
      code: 'SOURCE_HASH_MISMATCH',
      path: 'source.selectedTextSha256',
      message: `Selected text hash ${computedHash} does not match declared ${source.selectedTextSha256}`,
      severity: 'error',
    });
  }

  if (!/^[0-9a-f]{64}$/i.test(source.sourceSha256)) {
    issues.push({
      code: 'INVALID_SOURCE_SHA',
      path: 'source.sourceSha256',
      message: 'Source SHA-256 must be a 64-character hex string',
      severity: 'error',
    });
  }

  if (!Number.isInteger(source.revision) || source.revision < 0) {
    issues.push({
      code: 'INVALID_REVISION',
      path: 'source.revision',
      message: 'Revision must be a non-negative integer',
      severity: 'error',
    });
  }

  if (source.selection !== 'FULL' && source.selection !== 'EXCERPT') {
    issues.push({
      code: 'INVALID_SELECTION_MODE',
      path: 'source.selection',
      message: 'Selection mode must be FULL or EXCERPT',
      severity: 'error',
    });
  }

  if (source.language !== 'en' && source.language !== 'vi') {
    issues.push({
      code: 'UNSUPPORTED_LANGUAGE',
      path: 'source.language',
      message: 'Language must be en or vi',
      severity: 'error',
    });
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, value: source, issues: [] };
}

