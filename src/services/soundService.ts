// Web Audio API synthesized audio alerts (no external audio files needed)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playScannerBeep = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Ignore audio errors if user hasn't interacted yet
  }
};

export const playSuccessChime = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Two-tone rising chime (F5 -> A5 -> C6)
    [
      { freq: 659.25, time: now, dur: 0.12 },
      { freq: 880.00, time: now + 0.10, dur: 0.15 },
      { freq: 1046.50, time: now + 0.22, dur: 0.35 },
    ].forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + dur);
    });
  } catch {
    // Audio context safe fallback
  }
};

export const playAlertSiren = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Urgent alarm siren pulse (alternating high-low tones)
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const pulseTime = now + i * 0.22;
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, pulseTime);
      osc.frequency.exponentialRampToValueAtTime(440, pulseTime + 0.18);
      
      gain.gain.setValueAtTime(0.4, pulseTime);
      gain.gain.exponentialRampToValueAtTime(0.01, pulseTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(pulseTime);
      osc.stop(pulseTime + 0.21);
    }
  } catch {
    // Audio context safe fallback
  }
};
