/**
 * HERMES v0.20 - GROUNDED CITATIONS ENGINE
 * Deterministic Evidence Ledger & Verbatim Quote Verifier
 * 
 * Philosophy: Traceability != Verified Provenance != Truth
 * Harness controls ledger and source rendering; verifies verbatim quotes; rejects hallucinations.
 */

export interface CodeLedgerEntry {
  id: number;
  type: 'CODE';
  filePath: string;
  startLine: number;
  endLine: number;
  gitSha: string;
  exactSnippet: string;
  attachedQuotes: string[];
}

export interface KnowledgeLedgerEntry {
  id: number;
  type: 'KNOWLEDGE' | 'COMMENT' | 'DOCUMENT';
  uri: string;
  sourceName: string;
  authorOrMeta?: string;
  evidenceText: string;
  attachedQuotes: string[];
}

export type LedgerEntry = CodeLedgerEntry | KnowledgeLedgerEntry;

export interface GroundedVerificationOptions {
  requireEvidence?: boolean;      // When true, cited source must have matching quotes
  minCoverage?: number;           // Min ratio of claims with valid citation (0.0 - 1.0)
  strictSourcesSection?: boolean; // Ensure sources section at bottom matches ledger exactly
  strictMode?: boolean;           // Fail fast on any quote mismatch or hallucinated ID
}

export interface GroundedVerificationResult {
  pass: boolean;
  citedIds: number[];
  unverifiedClaimsCount: number;
  coverage: number;
  errors: string[];
  warnings: string[];
  renderedSources?: string;
}

/**
 * Normalizes text for verbatim matching:
 * - Converts CRLF to LF
 * - Collapses multiple spaces into a single space
 * - Removes markdown emphasis (*, **, _, `, #) for robust token matching
 */
export function normalizeText(text: string, caseSensitive: boolean = false): string {
  if (!text) return '';
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/[\*_`#]/g, '')       // strip markdown bold/italic/code
    .replace(/[ \t]+/g, ' ')        // collapse horizontal whitespace
    .trim();
  return caseSensitive ? cleaned : cleaned.toLowerCase();
}

/**
 * Normalizes code snippet lines for exact substring comparison
 */
export function normalizeCode(code: string): string {
  if (!code) return '';
  return code
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

export class CitationLedger {
  private entries: Map<number, LedgerEntry> = new Map();
  private keyToId: Map<string, number> = new Map();
  private nextId = 1;

  /**
   * Register a code snippet into the Ledger:
   * Format: [n] filePath#Lstart-Lend (SHA: gitSha)
   */
  registerCodeSnippet(
    filePath: string,
    startLine: number,
    endLine: number,
    gitSha: string = 'working-tree',
    exactSnippet: string
  ): number {
    const key = `CODE:${filePath}:${startLine}:${endLine}:${gitSha}`;
    const existingId = this.keyToId.get(key);
    if (existingId !== undefined) {
      return existingId;
    }

    const id = this.nextId++;
    const entry: CodeLedgerEntry = {
      id,
      type: 'CODE',
      filePath,
      startLine,
      endLine,
      gitSha: gitSha.substring(0, 7),
      exactSnippet,
      attachedQuotes: [],
    };

    this.entries.set(id, entry);
    this.keyToId.set(key, id);
    return id;
  }

  /**
   * Register knowledge or document evidence into the Ledger:
   * Format: [n] sourceName — uri (authorOrMeta)
   */
  registerKnowledgeEvidence(
    uri: string,
    sourceName: string,
    evidenceText: string,
    authorOrMeta?: string,
    type: 'KNOWLEDGE' | 'COMMENT' | 'DOCUMENT' = 'KNOWLEDGE'
  ): number {
    const key = `KNOW:${uri}:${authorOrMeta || ''}`;
    const existingId = this.keyToId.get(key);
    if (existingId !== undefined) {
      const existing = this.entries.get(existingId) as KnowledgeLedgerEntry;
      if (evidenceText && !existing.evidenceText.includes(evidenceText)) {
        existing.evidenceText += '\n\n' + evidenceText;
      }
      return existingId;
    }

    const id = this.nextId++;
    const entry: KnowledgeLedgerEntry = {
      id,
      type,
      uri,
      sourceName: sourceName || uri,
      authorOrMeta,
      evidenceText: evidenceText || '',
      attachedQuotes: [],
    };

    this.entries.set(id, entry);
    this.keyToId.set(key, id);
    return id;
  }

  getEntry(id: number): LedgerEntry | undefined {
    return this.entries.get(id);
  }

  getAllEntries(): LedgerEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => a.id - b.id);
  }

  /**
   * Verifies if a quote appears verbatim in the evidence text or code snippet of source [id].
   * If matched: attaches quote to source and returns success.
   * If not matched: rejects quote immediately (Fail-Fast).
   */
  attachQuote(id: number, rawQuote: string): { valid: boolean; normalizedQuote?: string; error?: string } {
    const entry = this.entries.get(id);
    if (!entry) {
      return {
        valid: false,
        error: `E_GROUNDING_ID_NOT_FOUND: ID [${id}] không tồn tại trong Ledger.`,
      };
    }

    if (entry.type === 'CODE') {
      const normSourceCode = normalizeCode(entry.exactSnippet);
      const normQuoteCode = normalizeCode(rawQuote);

      if (!normQuoteCode || normQuoteCode.length < 3) {
        return { valid: false, error: 'E_GROUNDING_EMPTY_QUOTE: Đoạn code quote quá ngắn hoặc rỗng.' };
      }

      if (!normSourceCode.includes(normQuoteCode)) {
        return {
          valid: false,
          error: `E_GROUNDING_QUOTE_MISMATCH: Code quote không xuất hiện verbatim trong [${id}] ${entry.filePath}#L${entry.startLine}-L${entry.endLine} (SHA: ${entry.gitSha}). Reject nhận định sai mã nguồn!`,
        };
      }

      if (!entry.attachedQuotes.includes(rawQuote)) {
        entry.attachedQuotes.push(rawQuote);
      }
      return { valid: true, normalizedQuote: normQuoteCode };
    } else {
      const normEvidence = normalizeText(entry.evidenceText);
      const normQuote = normalizeText(rawQuote);

      if (!normQuote || normQuote.length < 5) {
        return { valid: false, error: 'E_GROUNDING_EMPTY_QUOTE: Quote quá ngắn hoặc rỗng.' };
      }

      if (!normEvidence.includes(normQuote)) {
        return {
          valid: false,
          error: `E_GROUNDING_QUOTE_MISMATCH: Quote "${rawQuote}" không xuất hiện verbatim trong evidence của [${id}] ${entry.sourceName}. Reject quote đã paraphrase hoặc bịa!`,
        };
      }

      if (!entry.attachedQuotes.includes(rawQuote)) {
        entry.attachedQuotes.push(rawQuote);
      }
      return { valid: true, normalizedQuote: normQuote };
    }
  }

  /**
   * Renders the Sources & Citations section deterministically from the Ledger.
   * Model IS FORBIDDEN from rendering custom URLs or sources.
   */
  renderSources(citedIds?: number[]): string {
    const idsToRender = citedIds && citedIds.length > 0
      ? citedIds.filter((id) => this.entries.has(id))
      : Array.from(this.entries.keys());

    if (idsToRender.length === 0) return '';

    let out = '### Sources & Citations Ledger:\n';
    for (const id of idsToRender) {
      const entry = this.entries.get(id)!;
      if (entry.type === 'CODE') {
        out += `[${entry.id}] ${entry.filePath}#L${entry.startLine}-L${entry.endLine} (SHA: ${entry.gitSha})\n`;
      } else {
        const metaStr = entry.authorOrMeta ? ` (${entry.authorOrMeta})` : '';
        out += `[${entry.id}] ${entry.sourceName}${metaStr} — ${entry.uri}\n`;
      }

      if (entry.attachedQuotes.length > 0) {
        for (const q of entry.attachedQuotes) {
          out += `    > "${q.replace(/\n/g, ' ')}"\n`;
        }
      }
    }
    return out.trim();
  }
}

/**
 * Deterministic Consistency Verifier for Agent Output
 */
export function verifyGroundedResponse(
  responseText: string,
  ledger: CitationLedger,
  options: GroundedVerificationOptions = {}
): GroundedVerificationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Extract all cited IDs: e.g. [1], [2]
  const citationRegex = /\[(\d+)\]/g;
  const citedIdsSet = new Set<number>();
  let match: RegExpExecArray | null;
  while ((match = citationRegex.exec(responseText)) !== null) {
    citedIdsSet.add(parseInt(match[1], 10));
  }
  const citedIds = Array.from(citedIdsSet).sort((a, b) => a - b);

  // 2. Extract unverified markers: [unverified]
  const unverifiedRegex = /\[unverified\]/gi;
  const unverifiedMatches = responseText.match(unverifiedRegex) || [];
  const unverifiedClaimsCount = unverifiedMatches.length;

  // Gate 1: Check ID existence in Ledger
  for (const id of citedIds) {
    if (!ledger.getEntry(id)) {
      errors.push(`E_GROUNDING_ID_NOT_FOUND: ID [${id}] được cite trong bài nhưng KHÔNG tồn tại trong Ledger!`);
    }
  }

  // Gate 2: Evidence Quotes Check
  if (options.requireEvidence) {
    for (const id of citedIds) {
      const entry = ledger.getEntry(id);
      if (entry && entry.attachedQuotes.length === 0) {
        if (options.strictMode) {
          errors.push(`E_GROUNDING_MISSING_QUOTE: Nguồn [${id}] được cite nhưng chưa đính kèm Quote nào được kiểm chứng trong evidence text.`);
        } else {
          warnings.push(`Nguồn [${id}] được cite nhưng chưa đính kèm Quote nào được kiểm chứng.`);
        }
      }
    }
  }

  // Gate 3: Sources Section Consistency (Model cannot hallucinate URLs)
  if (options.strictSourcesSection) {
    const rawSourcesSectionMatch = responseText.match(/(?:###?\s*Sources|###?\s*Nguồn tham khảo)[\s\S]*$/i);
    if (rawSourcesSectionMatch) {
      const rawSection = rawSourcesSectionMatch[0];
      const urlRegex = /(https?:\/\/[^\s\)\>]+)/g;
      let urlMatch: RegExpExecArray | null;
      while ((urlMatch = urlRegex.exec(rawSection)) !== null) {
        const foundUrl = urlMatch[1];
        const existsInLedger = ledger.getAllEntries().some((e) => 'uri' in e && e.uri === foundUrl);
        if (!existsInLedger) {
          errors.push(`E_GROUNDING_HALLUCINATED_URL: URL bịa "${foundUrl}" xuất hiện trong Sources nhưng không có trong Ledger!`);
        }
      }
    }
  }

  // Gate 4: Coverage Gate
  const totalClaims = citedIds.length + unverifiedClaimsCount;
  const coverage = totalClaims > 0 ? (citedIds.length + unverifiedClaimsCount) / (totalClaims || 1) : 1.0;
  if (options.minCoverage !== undefined && coverage < options.minCoverage) {
    errors.push(`E_GROUNDING_LOW_COVERAGE: Độ phủ trích dẫn (${(coverage * 100).toFixed(1)}%) không đạt ngưỡng tối thiểu ${(options.minCoverage * 100).toFixed(1)}%.`);
  }

  const pass = errors.length === 0;
  const renderedSources = ledger.renderSources(citedIds);

  return {
    pass,
    citedIds,
    unverifiedClaimsCount,
    coverage,
    errors,
    warnings,
    renderedSources,
  };
}

