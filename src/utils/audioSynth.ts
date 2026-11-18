/**
 * Web Audio API based Synthesizer & Groove Engine for JZ Music Studio.
 * Generates genuine high-fidelity musical audio and real FFT waveform data
 * without depending on external audio file hosting.
 */

class MusicStudioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private currentTrackId: string = '';
  private timerId: number | null = null;
  private beatStep: number = 0;
  private startTime: number = 0;
  private pauseOffset: number = 0;
  private volume: number = 0.8;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getAnalyserData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public setCallbacks(onTimeUpdate: (t: number) => void, onEnd: () => void) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndCallback = onEnd;
  }

  public playTrack(trackId: string, duration: number, bpm: number, startAtOffset?: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentTrackId === trackId && startAtOffset === undefined) {
      return;
    }

    this.stop();
    this.currentTrackId = trackId;
    this.isPlaying = true;
    this.startTime = this.ctx.currentTime - (startAtOffset || 0);
    this.pauseOffset = startAtOffset || 0;
    this.beatStep = Math.floor((this.pauseOffset / 60) * bpm * 4);

    const stepIntervalMs = (60 / bpm / 4) * 1000;

    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;

      const elapsed = this.ctx.currentTime - this.startTime;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(elapsed);
      }

      if (elapsed >= duration) {
        this.stop();
        if (this.onEndCallback) this.onEndCallback();
        return;
      }

      this.triggerStepSound(trackId, this.beatStep);
      this.beatStep++;
    }, stepIntervalMs);
  }

  public pause() {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;
    this.pauseOffset = this.ctx.currentTime - this.startTime;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public resume(duration: number, bpm: number) {
    if (!this.currentTrackId) return;
    this.playTrack(this.currentTrackId, duration, bpm, this.pauseOffset);
  }

  public seek(targetSeconds: number, duration: number, bpm: number) {
    const wasPlaying = this.isPlaying;
    this.pauseOffset = Math.max(0, Math.min(duration, targetSeconds));
    if (wasPlaying) {
      this.playTrack(this.currentTrackId, duration, bpm, this.pauseOffset);
    } else {
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.pauseOffset);
      }
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.beatStep = 0;
    this.pauseOffset = 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private triggerStepSound(trackId: string, step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const s16 = step % 16;
    const bar = Math.floor(step / 16);

    switch (trackId) {
      case 'track-1': // Future Bass / Pop Dance (128 BPM)
        // Kick on 0, 4, 8, 12 or 0, 7, 10
        if (s16 === 0 || s16 === 7 || s16 === 10) {
          this.playKick(now, 110, 45, 0.25);
        }
        // Snare/Clap on 4, 12
        if (s16 === 4 || s16 === 12) {
          this.playSnare(now, 0.18);
        }
        // Hi-hats
        if (s16 % 2 === 0) {
          this.playHiHat(now, s16 % 4 === 2 ? 0.05 : 0.03, s16 % 4 === 2);
        }
        // Chords on steps 0, 3, 6, 10 (Future bass chord ducking)
        if (s16 === 0 || s16 === 3 || s16 === 6 || s16 === 10) {
          const chordFrequencies = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [220.00, 261.63, 329.63, 392.00], // Am7
            [174.61, 220.00, 261.63, 329.63], // Fmaj7
            [196.00, 246.94, 293.66, 392.00]  // G7
          ];
          const chord = chordFrequencies[bar % chordFrequencies.length];
          this.playSawChord(now, chord, 0.35, 0.18);
        }
        // Arpeggiated Melody
        if (s16 % 2 === 1) {
          const melodyNotes = [523.25, 659.25, 783.99, 987.77, 880.00, 783.99];
          const note = melodyNotes[(step * 3) % melodyNotes.length];
          this.playLeadSynth(now, note, 0.12, 0.08);
        }
        break;

      case 'track-2': // Lo-Fi R&B (84 BPM)
        // Soft kick on 0, 10
        if (s16 === 0 || s16 === 10) {
          this.playKick(now, 85, 38, 0.35);
        }
        // Rimshot/Snare on 8
        if (s16 === 8) {
          this.playSnare(now, 0.12, true);
        }
        // Swing hats on 0, 4, 8, 12 + swing
        if (s16 % 4 === 0 || s16 % 4 === 3) {
          this.playHiHat(now, 0.04, false);
        }
        // Rhodes Chords on bar change (s16 === 0) and syncopation (s16 === 6)
        if (s16 === 0 || s16 === 6) {
          const lofiChords = [
            [220.0, 277.18, 329.63, 415.30], // Amaj9
            [207.65, 246.94, 311.13, 369.99], // G#m7
            [185.0, 220.0, 277.18, 329.63],   // F#m9
            [164.81, 207.65, 246.94, 329.63]  // Emaj7
          ];
          const chord = lofiChords[bar % lofiChords.length];
          this.playRhodes(now, chord, 1.2, 0.15);
        }
        break;

      case 'track-3': // Cinematic Drama OST (72 BPM)
        // Deep ambient sub boom every 16 steps
        if (s16 === 0) {
          this.playKick(now, 65, 30, 0.6);
          const droneNotes = [130.81, 146.83, 110.00, 123.47];
          const root = droneNotes[bar % droneNotes.length];
          this.playSawChord(now, [root, root * 1.5, root * 2], 2.0, 0.12);
        }
        // Expressive cello-like melodic phrases
        if (s16 === 4 || s16 === 10 || s16 === 14) {
          const celloNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
          const note = celloNotes[(bar * 2 + (s16 / 2)) % celloNotes.length];
          this.playLeadSynth(now, note, 0.6, 0.1);
        }
        break;

      case 'track-4': // Before & After Comparison
        // Bar 0-3: "Before" (dry thin piano only, no drums, no bass)
        // Bar 4+: "After" (punchy drums, 808 bass, wide stereo saw synths, crisp highs)
        if (bar < 2) {
          // "Before" stage: dry simple electric piano, small velocity
          if (s16 === 0 || s16 === 8) {
            this.playRhodes(now, [261.63, 329.63, 392.00], 0.6, 0.1);
          }
        } else {
          // "After" stage: full master punch!
          if (s16 === 0 || s16 === 6 || s16 === 10) {
            this.playKick(now, 120, 50, 0.28);
          }
          if (s16 === 4 || s16 === 12) {
            this.playSnare(now, 0.22);
          }
          if (s16 % 2 === 0) {
            this.playHiHat(now, 0.06, s16 % 4 === 2);
          }
          if (s16 === 0 || s16 === 4 || s16 === 8 || s16 === 12) {
            const afterChords = [
              [130.81, 261.63, 329.63, 392.00, 493.88],
              [110.00, 220.00, 261.63, 329.63, 392.00],
              [87.31, 174.61, 220.00, 261.63, 329.63],
              [98.00, 196.00, 246.94, 293.66, 392.00]
            ];
            const chord = afterChords[bar % afterChords.length];
            this.playSawChord(now, chord, 0.35, 0.22);
          }
        }
        break;
    }
  }

  private playKick(time: number, startFreq: number, endFreq: number, decay: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + decay);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + decay);
  }

  private playSnare(time: number, decay: number, isRim: boolean = false) {
    if (!this.ctx || !this.masterGain) return;

    // Noise buffer for snap
    const bufferSize = this.ctx.sampleRate * decay;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = isRim ? 'bandpass' : 'highpass';
    filter.frequency.setValueAtTime(isRim ? 1800 : 1000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isRim ? 0.3 : 0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(time);
    whiteNoise.stop(time + decay);

    // Tonal body
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(isRim ? 320 : 185, time);
    bodyOsc.frequency.exponentialRampToValueAtTime(60, time + 0.08);

    bodyGain.gain.setValueAtTime(0.3, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.masterGain);

    bodyOsc.start(time);
    bodyOsc.stop(time + 0.08);
  }

  private playHiHat(time: number, gainLevel: number, isOpen: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const decay = isOpen ? 0.18 : 0.05;
    const bufferSize = this.ctx.sampleRate * decay;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + decay);
  }

  private playSawChord(time: number, freqs: number[], duration: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, time);
      filter.frequency.exponentialRampToValueAtTime(800, time + duration);

      gain.gain.setValueAtTime(gainLevel / freqs.length, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(time);
      osc.stop(time + duration);
    });
  }

  private playRhodes(time: number, freqs: number[], duration: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const sub = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      sub.type = 'triangle';
      sub.frequency.setValueAtTime(freq * 2, time);

      gain.gain.setValueAtTime(gainLevel / freqs.length, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(time);
      sub.start(time);
      osc.stop(time + duration);
      sub.stop(time + duration);
    });
  }

  private playLeadSynth(time: number, freq: number, duration: number, gainLevel: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(gainLevel, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }
}

export const studioAudio = new MusicStudioAudioEngine();
