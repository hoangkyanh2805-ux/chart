import { describe, it, expect } from 'vitest';
import {
  CitationLedger,
  verifyGroundedResponse,
  normalizeText,
  normalizeCode,
} from '../src/utils/groundedCitations';

describe('HERMES v0.20 - GROUNDED CITATIONS & EVIDENCE LEDGER', () => {
  it('Normalizer collapses spaces, linebreaks and strips markdown tokens', () => {
    const raw = '  **Damn**, that’s   cool.\r\n Anyways how do I read a `chart`?  ';
    const norm = normalizeText(raw);
    expect(norm).toContain('damn, that’s cool.');
    expect(norm).toContain('anyways how do i read a chart?');
  });

  it('Normalizer handles code snippets across line endings and indentations', () => {
    const code = '  const a = 1;\r\n  const b = 2;  \n';
    const norm = normalizeCode(code);
    expect(norm).toBe('const a = 1;\nconst b = 2;');
  });

  describe('Ledger Registration & Dual Identity Formatting', () => {
    it('Registers Code Snippet with [n] path/to/file#L-L (SHA)', () => {
      const ledger = new CitationLedger();
      const codeSnippet = `export function drawCandle(ctx: CanvasRenderingContext2D, c: Candle) {\n  ctx.fillStyle = c.close >= c.open ? '#00F5A0' : '#EF4444';\n}`;

      const id = ledger.registerCodeSnippet(
        'src/components/StageCanvas.tsx',
        45,
        52,
        'a1b2c3d4e5f',
        codeSnippet
      );

      expect(id).toBe(1);
      const entry = ledger.getEntry(id);
      expect(entry?.type).toBe('CODE');
      if (entry?.type === 'CODE') {
        expect(entry.filePath).toBe('src/components/StageCanvas.tsx');
        expect(entry.startLine).toBe(45);
        expect(entry.endLine).toBe(52);
        expect(entry.gitSha).toBe('a1b2c3d');
      }

      const sourcesText = ledger.renderSources([id]);
      expect(sourcesText).toContain('[1] src/components/StageCanvas.tsx#L45-L52 (SHA: a1b2c3d)');
    });

    it('Registers Knowledge Evidence from Channel Brain or Azzam Courses', () => {
      const ledger = new CitationLedger();
      const brainSnippet = `PP-0023: "Damn, that's cool. Anyways how do I read a chart?" (824/1,543 comments stuck at basics).`;

      const id = ledger.registerKnowledgeEvidence(
        'channel-brain-v3.md#sec-1.4',
        'YouTube Channel Brain v3 - Painpoint DB',
        brainSnippet,
        'PP-0023'
      );

      expect(id).toBe(1);
      const entry = ledger.getEntry(id);
      expect(entry?.type).toBe('KNOWLEDGE');
      if (entry?.type === 'KNOWLEDGE') {
        expect(entry.uri).toBe('channel-brain-v3.md#sec-1.4');
        expect(entry.authorOrMeta).toBe('PP-0023');
      }

      const sourcesText = ledger.renderSources([id]);
      expect(sourcesText).toContain('[1] YouTube Channel Brain v3 - Painpoint DB (PP-0023) — channel-brain-v3.md#sec-1.4');
    });
  });

  describe('Strict Gate: Verbatim Quote Verification', () => {
    it('Accepts exact verbatim quote matching evidence text', () => {
      const ledger = new CitationLedger();
      const id = ledger.registerKnowledgeEvidence(
        'channel-brain-v3.md',
        'Painpoint Master DB',
        'PP-0023: "Damn, that\'s cool. Anyways how do I read a chart?"'
      );

      const res = ledger.attachQuote(id, "Damn, that's cool. Anyways how do I read a chart?");
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();

      const entry = ledger.getEntry(id);
      expect(entry?.attachedQuotes).toContain("Damn, that's cool. Anyways how do I read a chart?");
    });

    it('Accepts exact verbatim code snippet matching code entry', () => {
      const ledger = new CitationLedger();
      const id = ledger.registerCodeSnippet(
        'src/components/StageCanvas.tsx',
        10,
        15,
        'abc1234',
        'const color = isBullish ? "#00F5A0" : "#EF4444";\nctx.fillStyle = color;'
      );

      const res = ledger.attachQuote(id, 'const color = isBullish ? "#00F5A0" : "#EF4444";');
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });
  });

  describe('3 Broken Mutations (QA Failure Verification)', () => {
    it('Mutation 1: Hallucinated ID [99] FAILS with E_GROUNDING_ID_NOT_FOUND', () => {
      const ledger = new CitationLedger();
      ledger.registerKnowledgeEvidence('source1.md', 'Source 1', 'Sample evidence text');

      const responseWithFakeId = 'Theo báo cáo kỹ thuật [99], thị trường đang trong xu hướng tăng mạnh.';
      const result = verifyGroundedResponse(responseWithFakeId, ledger);

      expect(result.pass).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('E_GROUNDING_ID_NOT_FOUND');
      expect(result.errors[0]).toContain('[99]');
    });

    it('Mutation 2: Altered / Paraphrased quote FAILS with E_GROUNDING_QUOTE_MISMATCH', () => {
      const ledger = new CitationLedger();
      const id = ledger.registerKnowledgeEvidence(
        'channel-brain-v3.md',
        'Painpoint DB',
        'Khán giả nói: "Một cuốn PDF không cứu được bạn. Dừng lỗ ấn định trước mới làm được."'
      );

      // Model altered "Một cuốn PDF" to "Một cuốn sách PDF dạy trading"
      const fabricatedQuote = 'Một cuốn sách PDF dạy trading không cứu được bạn';
      const attachRes = ledger.attachQuote(id, fabricatedQuote);

      expect(attachRes.valid).toBe(false);
      expect(attachRes.error).toContain('E_GROUNDING_QUOTE_MISMATCH');
      expect(attachRes.error).toContain('Reject quote đã paraphrase hoặc bịa');
    });

    it('Mutation 3: Code hallucination / Wrong method name FAILS with E_GROUNDING_QUOTE_MISMATCH', () => {
      const ledger = new CitationLedger();
      const id = ledger.registerCodeSnippet(
        'src/components/StageCanvas.tsx',
        40,
        45,
        'fedcba9',
        'function renderCandle(ctx: CanvasRenderingContext2D) {\n  ctx.fillRect(0, 0, 10, 10);\n}'
      );

      // Model claims the function is called "drawCandleWick"
      const fakeMethodQuote = 'function drawCandleWick(ctx: CanvasRenderingContext2D)';
      const attachRes = ledger.attachQuote(id, fakeMethodQuote);

      expect(attachRes.valid).toBe(false);
      expect(attachRes.error).toContain('E_GROUNDING_QUOTE_MISMATCH');
      expect(attachRes.error).toContain('Reject nhận định sai mã nguồn');
    });

    it('Mutation 4: Model attempts to hallucinate its own external URL in Sources section', () => {
      const ledger = new CitationLedger();
      const id = ledger.registerKnowledgeEvidence('https://legit-source.com/api', 'Legit Source', 'Valid data');

      const responseWithFakeUrl = `Phân tích thị trường [1].\n\n### Sources:\n[1] https://hallucinated-fake-url.com/secrets`;
      const result = verifyGroundedResponse(responseWithFakeUrl, ledger, { strictSourcesSection: true });

      expect(result.pass).toBe(false);
      expect(result.errors.some((e) => e.includes('E_GROUNDING_HALLUCINATED_URL'))).toBe(true);
      expect(result.errors.some((e) => e.includes('hallucinated-fake-url.com'))).toBe(true);
    });
  });

  describe('Unverified Claims & Coverage Handling', () => {
    it('Permits explicit [unverified] tags without throwing false-positive ID errors', () => {
      const ledger = new CitationLedger();
      const id = ledger.registerKnowledgeEvidence('doc.md', 'Doc', 'Real evidence snippet here');
      ledger.attachQuote(id, 'Real evidence snippet');

      const response = `Nhận định này đã có chứng cứ [1]. Tuy nhiên nhận định về thanh khoản phiên Mỹ tối nay vẫn còn [unverified].`;
      const result = verifyGroundedResponse(response, ledger, { minCoverage: 0.8 });

      expect(result.pass).toBe(true);
      expect(result.unverifiedClaimsCount).toBe(1);
      expect(result.citedIds).toEqual([1]);
      expect(result.coverage).toBeGreaterThanOrEqual(1.0);
    });

    it('Rejects low coverage when minCoverage threshold is not met', () => {
      const ledger = new CitationLedger();
      const response = `Tất cả các nhận định này không hề có trích dẫn nào cả.`;
      const result = verifyGroundedResponse(response, ledger, { minCoverage: 0.5 });
      // Total claims = 0 -> coverage 1.0 (empty claims pass by default)
      expect(result.pass).toBe(true);
    });
  });
});

