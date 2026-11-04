import { createHash } from 'crypto';

export function hashText(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function canonicalStringify(
  value: unknown,
  omitKeys: Set<string> = new Set(['sceneSha256'])
): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    const elements = value.map((elem) => canonicalStringify(elem, omitKeys));
    return `[${elements.join(',')}]`;
  }

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((k) => !omitKeys.has(k))
    .sort();

  const entries = keys.map((key) => {
    return `${JSON.stringify(key)}:${canonicalStringify(obj[key], omitKeys)}`;
  });

  return `{${entries.join(',')}}`;
}

export function hashCanonical(value: unknown, omitKeys?: Set<string>): string {
  const canonicalJson = canonicalStringify(value, omitKeys);
  return createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
}
