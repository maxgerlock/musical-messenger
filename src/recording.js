import * as Tone from 'tone';
let mediaRecorder;
let chunks = [];
let audio;

const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioContext = new AudioContext();
Tone.setContext(audioContext);

export function setupRecording(onStopRecording) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
   navigator.mediaDevices.getUserMedia (
      {
         audio: true
      })

      // Success callback
      .then(function(stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => {
          chunks.push(e.data);
        }
        mediaRecorder.onstop = (e) => {
          const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
          const audioUrl = window.URL.createObjectURL(blob);
          audio = new Audio(audioUrl);
          chunks = [];
          onStopRecording(audio);
        }
      })

      // Error callback
      .catch(function(err) {
         console.log('The following getUserMedia error occured: ' + err);
      }
   );
  } else {
     console.log('getUserMedia not supported on your browser!');
  }
}

export function startRecording() {
  mediaRecorder.start();
}

export function stopRecording() {
  mediaRecorder.stop();
  return {audio: audio, track: null};
}

export function applyEffect(audio, effect) {
  // TODO it may be the case that the source audio is accidentally being routed in parallel with the FX send. check and fix

  const track = audioContext.createMediaElementSource(audio);

  track.connect(audioContext.destination);
  if (effect && effect.webAudioEffect) {
    console.log(effect.webAudioEffect);
    track.connect(effect.webAudioEffect);
    effect.webAudioEffect.connect(audioContext.destination);
  }
}
