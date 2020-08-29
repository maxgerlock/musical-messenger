let mediaRecorder;
let chunks = [];
let audio;

// Acts as a cache mapping each audio source to its corresponding track, so that
// we don't have to pass around both audio and tracks.
// TODO eventually this should probably use a permanent store of some kind
const audioSrcToTrackCache = {};

const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioContext = new AudioContext();

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
        mediaRecorder.onstop = () => {
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
  let track;

  if (Object.prototype.hasOwnProperty.call(audioSrcToTrackCache, audio.src)) {
      track = audioSrcToTrackCache[audio.src];
  } else {
    track = audioContext.createMediaElementSource(audio);
    audioSrcToTrackCache[audio.src] = track;
  }
  track.disconnect();
  if (effect && effect.webAudioEffect) {
    track.connect(effect.webAudioEffect);
    effect.webAudioEffect.connect(audioContext.destination);
  } else {
    track.connect(audioContext.destination);
  }
}
