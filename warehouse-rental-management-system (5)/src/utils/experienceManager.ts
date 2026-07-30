/**
 * Acrely OS - Centralized Sound & Haptic Manager
 * Provides subtle, high-quality, zero-dependency Web Audio API sound synthesis
 * and native haptic vibration feedback for supported devices.
 */

export type SoundType =
  | 'click'
  | 'pop'
  | 'save'
  | 'success'
  | 'delete'
  | 'notification'
  | 'toggle'
  | 'dropdown'
  | 'modalOpen'
  | 'modalClose'
  | 'upload'
  | 'payment'
  | 'invoice'
  | 'login'
  | 'error'
  | 'warning';

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'error';

export interface ExperienceSettings {
  enableUiSounds: boolean;
  soundVolume: number; // 0 - 100
  enableHaptics: boolean;
  enableAnimations: boolean;
  reduceMotion: boolean;
  muteAllSounds: boolean;
  followSystemPreferences: boolean;
}

export const DEFAULT_EXPERIENCE_SETTINGS: ExperienceSettings = {
  enableUiSounds: true,
  soundVolume: 30,
  enableHaptics: true,
  enableAnimations: true,
  reduceMotion: false,
  muteAllSounds: false,
  followSystemPreferences: false
};

class SoundAndHapticEngine {
  private audioCtx: AudioContext | null = null;
  private lastPlayTimes: Record<string, number> = {};
  private settings: ExperienceSettings = { ...DEFAULT_EXPERIENCE_SETTINGS };

  constructor() {
    // Attempt lazy initialization on first user interaction if in browser
    if (typeof window !== 'undefined') {
      const initAudioOnUserInteraction = () => {
        this.initAudioContext();
        window.removeEventListener('pointerdown', initAudioOnUserInteraction);
        window.removeEventListener('keydown', initAudioOnUserInteraction);
      };
      window.addEventListener('pointerdown', initAudioOnUserInteraction, { once: true });
      window.addEventListener('keydown', initAudioOnUserInteraction, { once: true });
    }
  }

  public updateSettings(newSettings: Partial<ExperienceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  public getSettings(): ExperienceSettings {
    return { ...this.settings };
  }

  private initAudioContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Play a synthesized UI sound
   */
  public playSound(type: SoundType, customVolumeMultiplier = 1) {
    if (
      this.settings.muteAllSounds ||
      !this.settings.enableUiSounds ||
      this.settings.soundVolume <= 0
    ) {
      return;
    }

    // Rate limiting (prevent sound distortion when spam clicking within 35ms)
    const now = performance.now();
    const lastPlayed = this.lastPlayTimes[type] || 0;
    if (now - lastPlayed < 35) {
      return;
    }
    this.lastPlayTimes[type] = now;

    const ctx = this.initAudioContext();
    if (!ctx) return;

    // Calculate effective gain (scaled to 0.22 max so sounds stay soft and low-volume)
    const baseGain = (this.settings.soundVolume / 100) * 0.22 * customVolumeMultiplier;
    if (baseGain <= 0.001) return;

    const startTime = ctx.currentTime;

    // Create Master Gain for this sound instance
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(baseGain, startTime);

    // Create Low-pass filter for smooth, warm, non-harsh tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, startTime);

    masterGain.connect(filter);
    filter.connect(ctx.destination);

    switch (type) {
      case 'click': {
        // Linear/Notion style soft micro click (35ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, startTime);
        osc.frequency.exponentialRampToValueAtTime(550, startTime + 0.035);

        gain.gain.setValueAtTime(0.8, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.04);
        break;
      }

      case 'pop': {
        // Soft bubble tap (45ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, startTime);
        osc.frequency.exponentialRampToValueAtTime(320, startTime + 0.045);

        gain.gain.setValueAtTime(0.9, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.045);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.05);
        break;
      }

      case 'toggle': {
        // Crisp micro snap (30ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, startTime);
        osc.frequency.exponentialRampToValueAtTime(1500, startTime + 0.03);

        gain.gain.setValueAtTime(0.7, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.035);
        break;
      }

      case 'dropdown': {
        // Ultra-soft menu tap (25ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, startTime);

        gain.gain.setValueAtTime(0.5, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.025);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.03);
        break;
      }

      case 'save': {
        // Soft 2-step upward warmth (C5 -> E5, 90ms)
        [523.25, 659.25].forEach((freq, idx) => {
          const t = startTime + idx * 0.045;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.7, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.055);
        });
        break;
      }

      case 'success': {
        // Elegant 3-note major triad chime (C5 -> E5 -> G5, 130ms)
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const t = startTime + idx * 0.04;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.75, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.08);
        });
        break;
      }

      case 'delete': {
        // Soft double downward low tap (100ms)
        [320, 220].forEach((freq, idx) => {
          const t = startTime + idx * 0.045;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.8, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.05);
        });
        break;
      }

      case 'notification': {
        // Soft bell dual chime (A5 -> E6, 120ms)
        [880, 1318.51].forEach((freq, idx) => {
          const t = startTime + idx * 0.05;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.7, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.09);
        });
        break;
      }

      case 'modalOpen': {
        // Soft rising swoosh/pop (70ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, startTime);
        osc.frequency.exponentialRampToValueAtTime(520, startTime + 0.07);

        gain.gain.setValueAtTime(0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.075);
        break;
      }

      case 'modalClose': {
        // Soft falling swoosh/pop (70ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, startTime);
        osc.frequency.exponentialRampToValueAtTime(260, startTime + 0.07);

        gain.gain.setValueAtTime(0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.075);
        break;
      }

      case 'upload': {
        // Upward micro glide (80ms)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, startTime);
        osc.frequency.exponentialRampToValueAtTime(840, startTime + 0.08);

        gain.gain.setValueAtTime(0.7, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.085);
        break;
      }

      case 'payment': {
        // Warm gold metallic chime (G5 -> C6, 140ms)
        [783.99, 1046.5].forEach((freq, idx) => {
          const t = startTime + idx * 0.055;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.85, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.085);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.09);
        });
        break;
      }

      case 'invoice': {
        // Precise register chime (650Hz -> 880Hz, 90ms)
        [650, 880].forEach((freq, idx) => {
          const t = startTime + idx * 0.045;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.75, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.055);
        });
        break;
      }

      case 'login': {
        // Uplifting welcome triad (A4 -> C#5 -> E5, 140ms)
        [440, 554.37, 659.25].forEach((freq, idx) => {
          const t = startTime + idx * 0.045;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.8, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.075);
        });
        break;
      }

      case 'error': {
        // Soft double low warning tap (gentle, non-harsh)
        [220, 180].forEach((freq, idx) => {
          const t = startTime + idx * 0.06;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.7, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.06);
        });
        break;
      }

      case 'warning': {
        // Soft caution tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, startTime);

        gain.gain.setValueAtTime(0.7, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.095);
        break;
      }

      default:
        break;
    }
  }

  /**
   * Trigger native haptic feedback on supported mobile/tablet devices
   */
  public triggerHaptic(type: HapticType = 'light') {
    if (!this.settings.enableHaptics || typeof window === 'undefined' || !('navigator' in window)) {
      return;
    }

    if (typeof navigator.vibrate !== 'function') {
      return;
    }

    try {
      switch (type) {
        case 'light':
        case 'selection':
          navigator.vibrate(8);
          break;
        case 'medium':
          navigator.vibrate(15);
          break;
        case 'heavy':
          navigator.vibrate(25);
          break;
        case 'success':
          navigator.vibrate([8, 30, 12]);
          break;
        case 'error':
          navigator.vibrate([15, 40, 15]);
          break;
        default:
          navigator.vibrate(8);
          break;
      }
    } catch {
      // Ignore haptic errors on unsupported hardware
    }
  }
}

export const experienceEngine = new SoundAndHapticEngine();
