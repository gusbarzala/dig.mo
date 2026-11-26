type SfxType = 'click' | 'attack' | 'evolve' | 'shield' | 'heal' | 'victory' | 'villain';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'square',
  gainValue = 0.06
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(gainValue, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playSfx(type: SfxType, muted: boolean): void {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        playTone(ctx, 520, now, 0.05, 'square', 0.04);
        break;
      case 'attack':
        playTone(ctx, 440, now, 0.06, 'sawtooth', 0.07);
        playTone(ctx, 220, now + 0.06, 0.12, 'sawtooth', 0.07);
        break;
      case 'evolve':
        playTone(ctx, 392, now, 0.08, 'square', 0.06);
        playTone(ctx, 523.25, now + 0.08, 0.08, 'square', 0.06);
        playTone(ctx, 659.25, now + 0.16, 0.08, 'square', 0.06);
        playTone(ctx, 783.99, now + 0.24, 0.18, 'square', 0.07);
        break;
      case 'shield':
        playTone(ctx, 587.33, now, 0.09, 'triangle', 0.08);
        playTone(ctx, 880, now + 0.09, 0.14, 'triangle', 0.07);
        break;
      case 'heal':
        playTone(ctx, 523.25, now, 0.07, 'sine', 0.08);
        playTone(ctx, 659.25, now + 0.07, 0.12, 'sine', 0.08);
        break;
      case 'victory':
        playTone(ctx, 523.25, now, 0.08, 'square', 0.06);
        playTone(ctx, 659.25, now + 0.09, 0.08, 'square', 0.06);
        playTone(ctx, 783.99, now + 0.18, 0.08, 'square', 0.06);
        playTone(ctx, 1046.5, now + 0.27, 0.22, 'square', 0.08);
        break;
      case 'villain':
        playTone(ctx, 196, now, 0.1, 'sawtooth', 0.06);
        playTone(ctx, 146.83, now + 0.1, 0.16, 'sawtooth', 0.07);
        break;
    }
  } catch {
    // Ignore audio errors on restricted environments
  }
}
