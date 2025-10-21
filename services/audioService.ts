// A simple service to play generated sounds using the Web Audio API.
// This avoids needing to host and load audio files.

let audioContext: AudioContext | null = null;
let generatingSound: { oscillator: OscillatorNode; gain: GainNode; lfo: OscillatorNode } | null = null;


/**
 * Initializes the AudioContext. Must be called from a user gesture (e.g., a click).
 * @returns {boolean} - True if context is initialized, false otherwise.
 */
const initAudioContext = (): boolean => {
  if (audioContext) return true;
  try {
    // Safari requires the `webkit` prefix.
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return true;
  } catch (e) {
    console.error("Web Audio API is not supported in this browser");
    return false;
  }
};

/**
 * Plays a pre-defined sound type.
 * @param {'click' | 'success' | 'copy' | 'typing' | 'introGlitch' | 'introReveal'} type - The type of sound to play.
 */
const playSound = (type: 'click' | 'success' | 'copy' | 'typing' | 'introGlitch' | 'introReveal') => {
  // Initialization must be triggered by a user action.
  if (!initAudioContext() || !audioContext) return;
  
  // In some browsers, the AudioContext starts in a 'suspended' state
  // and must be resumed by a user gesture.
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const now = audioContext.currentTime;

  switch (type) {
    case 'click': {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800, now);
      
      gainNode.gain.setValueAtTime(0.2, now); // Lowered volume from 0.5
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
    }
    case 'success': {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01); // Lowered volume from 0.3
      
      // A pleasant, ascending arpeggio (C5, E5, G5)
      oscillator.frequency.setValueAtTime(523.25, now);
      oscillator.frequency.setValueAtTime(659.25, now + 0.1);
      oscillator.frequency.setValueAtTime(783.99, now + 0.2);
      
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;
    }
    case 'copy': {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1000, now);
      oscillator.frequency.setValueAtTime(1200, now + 0.05);

      gainNode.gain.setValueAtTime(0.15, now); // Lowered volume from 0.3
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
    }
    case 'typing': {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1500, now);
      gainNode.gain.setValueAtTime(0.05, now); // Lowered volume from 0.1
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
    }
    case 'introGlitch': {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.1, now); // Lowered volume from 0.2
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
      break;
    }
    case 'introReveal': {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(100, now);
      oscillator.frequency.exponentialRampToValueAtTime(400, now + 2);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 1.5); // Lowered volume from 0.3
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 2.5);
      break;
    }
  }
};

export const startGeneratingSound = () => {
  if (!initAudioContext() || !audioContext || generatingSound) return;
  if (audioContext.state === 'suspended') {
      audioContext.resume();
  }
  const now = audioContext.currentTime;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const lfo = audioContext.createOscillator(); // Low-frequency oscillator for pulsing effect
  
  // Main sound
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(120, now);
  
  // LFO to modulate gain
  lfo.type = 'square';
  lfo.frequency.setValueAtTime(4, now); // Pulse 4 times per second
  
  const lfoGain = audioContext.createGain();
  lfoGain.gain.setValueAtTime(0.05, now); // Depth of the pulse, lowered from 0.1
  
  lfo.connect(lfoGain);
  lfoGain.connect(gainNode.gain); // LFO controls the main gain
  
  gainNode.gain.setValueAtTime(0.05, now); // Base gain, lowered from 0.1
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  lfo.start(now);
  oscillator.start(now);
  
  generatingSound = { oscillator, gain: gainNode, lfo };
};

export const stopGeneratingSound = () => {
  if (!generatingSound || !audioContext) return;
  
  const now = audioContext.currentTime;
  generatingSound.gain.gain.cancelScheduledValues(now);
  generatingSound.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  
  generatingSound.oscillator.stop(now + 0.2);
  generatingSound.lfo.stop(now + 0.2);
  
  generatingSound = null;
};

export const playClickSound = () => playSound('click');
export const playSuccessSound = () => playSound('success');
export const playCopySound = () => playSound('copy');
export const playTypingSound = () => playSound('typing');
export const playIntroGlitchSound = () => playSound('introGlitch');
export const playIntroRevealSound = () => playSound('introReveal');