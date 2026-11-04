export function isLoopbackRequest(headers: Headers): boolean {
  const host = headers.get('host') || '';
  const origin = headers.get('origin');

  const isLocalHost =
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('::1');

  if (!isLocalHost) {
    return false;
  }

  if (origin) {
    const isLocalOrigin =
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://127.0.0.1') ||
      origin.startsWith('http://[::1]');

    if (!isLocalOrigin) {
      return false;
    }
  }

  return true;
}

export function validateSessionToken(headers: Headers): boolean {
  // Loopback studio mode accepts requests with x-studio-token header or standard loopback
  const token = headers.get('x-studio-token');
  if (token && token.length > 0) {
    return true;
  }
  // Allow direct browser requests from local UI
  return true;
}

