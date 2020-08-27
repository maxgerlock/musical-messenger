import { audioContext } from './recording.js';
import impulse_response from './impulse_responses/Large Long Echo Hall.wav'

async function createReverb() {
    let convolver = audioContext.createConvolver();

    // load impulse response from file
    let response     = await fetch(impulse_response);
    let arraybuffer  = await response.arrayBuffer();
    convolver.buffer = await audioContext.decodeAudioData(arraybuffer);

    return convolver;
}

export async function getEffects() {
  const reverbConvolver = await createReverb();
  reverbConvolver.connect(audioContext.destination);
  console.log('finished awaiting createReverb');
  const effects = [
    {
      webAudioEffect: null,
      name: 'No FX',
    },
    {
      webAudioEffect: reverbConvolver,
      name: '🤖',
    },
    {
      webAudioEffect: reverbConvolver,
      name: '👶',
    },
    {
      webAudioEffect: reverbConvolver,
      name: '(  ( (echo) )  )',
    },
    {
      webAudioEffect: reverbConvolver,
      name: '📞'
    }
  ];
  return effects;
}
