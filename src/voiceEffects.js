import { audioContext } from './recording.js';
import PitchShift from 'soundbank-pitch-shift';
import impulse_response from './impulse_responses/Large Long Echo Hall.wav'

async function createReverb() {
    let convolver = audioContext.createConvolver();

    // load impulse response from file
    let response     = await fetch(impulse_response);
    let arraybuffer  = await response.arrayBuffer();
    convolver.buffer = await audioContext.decodeAudioData(arraybuffer);
    convolver.connect(audioContext.destination)

    return convolver;
}

function createBabyVoice() {
  var pitchShift = PitchShift(audioContext)
  pitchShift.connect(audioContext.destination)

  pitchShift.transpose = 8
  pitchShift.wet.value = 1.0
  pitchShift.dry.value = 0.0

  return pitchShift;
}

function createDeepVoice() {
  var pitchShift = PitchShift(audioContext)
  pitchShift.connect(audioContext.destination)

  pitchShift.transpose = -8
  pitchShift.wet.value = 1.0
  pitchShift.dry.value = 0.0

  return pitchShift;
}

function createAlienVoice() {
  var pitchShift = PitchShift(audioContext)
  pitchShift.connect(audioContext.destination)

  pitchShift.transpose = 6
  pitchShift.wet.value = 0.5
  pitchShift.dry.value = 0.5

  return pitchShift;
}

function createTelephoneFilter() {
  const lowpassFilter = audioContext.createBiquadFilter();
  lowpassFilter.type = "bandpass";
  lowpassFilter.frequency.setValueAtTime(4000, audioContext.currentTime);
  lowpassFilter.gain.setValueAtTime(25, audioContext.currentTime);
  const highpassFilter = audioContext.createBiquadFilter();
  highpassFilter.type = "highpass";
  highpassFilter.frequency.setValueAtTime(400, audioContext.currentTime);
  highpassFilter.gain.setValueAtTime(25, audioContext.currentTime);
  lowpassFilter.connect(highpassFilter);
  highpassFilter.connect(audioContext.destination);

  return lowpassFilter;
}

export async function getEffects() {
  const reverbConvolver = await createReverb();
  const babyVoice = createBabyVoice();
  const deepVoice = createDeepVoice();
  const alienVoice = createAlienVoice();
  const telephoneFilter = createTelephoneFilter();

  const effects = [
    {
      webAudioEffect: null,
      name: 'No Filter',
    },
    {
      webAudioEffect: reverbConvolver,
      name: '🤖',
    },
    {
      webAudioEffect: babyVoice,
      name: '👶',
    },
    {
      webAudioEffect: deepVoice,
      name: '🧔',
    },
    {
      webAudioEffect: alienVoice,
      name: '👽',
    },
    {
      webAudioEffect: reverbConvolver,
      name: '🏞️',
    },
    {
      webAudioEffect: telephoneFilter,
      name: '📞'
    }
  ];
  return effects;
}
