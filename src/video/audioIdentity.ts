import { NarrationCue } from './contracts';
import { hashText } from './canonicalHash';

export interface AudioBindingRequest {
  sourceId: string;
  revision: number;
  cueId: string;
  transcriptSha256: string;
}

export function createAudioBindingRequest(
  sourceId: string,
  revision: number,
  cue: NarrationCue
): AudioBindingRequest {
  return {
    sourceId,
    revision,
    cueId: cue.id,
    transcriptSha256: hashText(cue.text),
  };
}

export function isAudioBindingValid(
  request: AudioBindingRequest,
  currentSourceId: string,
  currentRevision: number,
  currentCue: NarrationCue
): boolean {
  if (request.sourceId !== currentSourceId) return false;
  if (request.revision !== currentRevision) return false;
  if (request.cueId !== currentCue.id) return false;

  const currentTranscriptHash = hashText(currentCue.text);
  if (request.transcriptSha256 !== currentTranscriptHash) return false;

  return true;
}

