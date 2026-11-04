import { describe, it, expect } from 'vitest';
import { isLoopbackRequest, validateSessionToken } from '../../src/server/video/localAccess';

describe('Local Studio Access & Security Boundaries (Task 6)', () => {
  it('allows loopback host localhost and 127.0.0.1', () => {
    const h1 = new Headers({ host: 'localhost:3000' });
    expect(isLoopbackRequest(h1)).toBe(true);

    const h2 = new Headers({ host: '127.0.0.1:3000' });
    expect(isLoopbackRequest(h2)).toBe(true);

    const h3 = new Headers({ host: '::1:3000' });
    expect(isLoopbackRequest(h3)).toBe(true);
  });

  it('rejects external or public hosts and origins', () => {
    const h1 = new Headers({ host: 'api.chartanimator.io' });
    expect(isLoopbackRequest(h1)).toBe(false);

    const h2 = new Headers({ host: 'localhost:3000', origin: 'https://malicious-site.com' });
    expect(isLoopbackRequest(h2)).toBe(false);
  });
});

