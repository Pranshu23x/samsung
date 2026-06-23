// Client-side audio capture utility.
// Records from the user's mic via MediaRecorder and encodes PCM data as a WAV
// blob suitable for Sarvam's STT API (which expects WAV/PCM input).

export type AudioCapture = {
  blob: Blob;
  durationMs: number;
};

/**
 * Request mic access and return a MediaRecorder that emits PCM audio.
 * Falls back to webm/opus if WAV encoding is unavailable.
 */
export async function createRecorder(): Promise<MediaRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const mimeType = [
    "audio/wav",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
  ].find((t) => MediaRecorder.isTypeSupported(t));

  return new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
}

/**
 * Record audio from the user's mic and return WAV blob + duration.
 * Stops recording when `stop()` is called on the returned recorder or after
 * the optional `timeoutMs`.
 */
export function recordAudio(
  recorder: MediaRecorder,
  timeoutMs?: number
): Promise<AudioCapture> & { stop: () => void } {
  const chunks: BlobPart[] = [];
  const startTime = performance.now();

  let stopRec: (() => void) | null = null;

  const promise = new Promise<AudioCapture>((resolve, reject) => {
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const durationMs = Math.round(performance.now() - startTime);
      const mime = recorder.mimeType || "audio/webm";

      try {
        const blob = await encodeWav(chunks, mime);
        resolve({ blob, durationMs });
      } catch {
        // If WAV encoding fails, return the raw blob
        const blob = new Blob(chunks, { type: mime });
        resolve({ blob, durationMs });
      }

      // Release the mic
      recorder.stream.getTracks().forEach((t) => t.stop());
    };

    recorder.onerror = () => {
      recorder.stream.getTracks().forEach((t) => t.stop());
      reject(new Error("Recording error"));
    };

    recorder.start(250); // collect data every 250ms

    if (timeoutMs) {
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, timeoutMs);
    }
  });

  const stop = () => {
    if (recorder.state === "recording") recorder.stop();
  };

  return Object.assign(promise, { stop });
}

/**
 * Convert audio chunks (possibly webm/opus) to WAV/PCM.
 * Uses Web Audio API to decode and re-encode as 16-bit PCM WAV.
 */
async function encodeWav(
  chunks: BlobPart[],
  mimeType: string
): Promise<Blob> {
  const rawBlob = new Blob(chunks, { type: mimeType });

  const arrayBuffer = await rawBlob.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  const pcmData = new Float32Array(length * numChannels);

  for (let ch = 0; ch < numChannels; ch++) {
    const channelData = audioBuffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      pcmData[i * numChannels + ch] = channelData[i];
    }
  }

  const wavBuffer = encodeWavPcm(pcmData, numChannels, sampleRate);
  return new Blob([wavBuffer], { type: "audio/wav" });
}

/**
 * Encode 32-bit float PCM samples as a 16-bit PCM WAV file (ArrayBuffer).
 */
function encodeWavPcm(
  samples: Float32Array,
  numChannels: number,
  sampleRate: number
): ArrayBuffer {
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const bufferSize = 44 + dataSize;

  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}
