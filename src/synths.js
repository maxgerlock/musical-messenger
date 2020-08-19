import { Synth } from 'tone';
import { slowAutoFilter, fastAutoFilter, reverb, feedbackDelay } from './effects.js'

const TONIC_VELOCITY = 0.6
const SENTIMENT_VELOCITY = 0.2
const THIRD_VELOCITY = 0.4
const GAIN = 0.7

// Notes arranged by subjective consonance against C
const notesByConsonance = [
  "E5",
  "C6",
  "G5",
  "A5",
  "F5",
  "D5",
  "B5",
  "Bb5",
  "F#5",
  "Eb5",
  "Ab5",
  "Db5"
];

const tonicSynth = new Synth().toDestination();
const thirdSynth = new Synth({envelope: {
    attack: 0.0,
    decay: 0.3,
    sustain: 0.6,
    release: 0.6,
  }}).toDestination();
const colorSynth = new Synth({envelope: {
    attack: 0.0,
    decay: 0.3,
    sustain: 0.6,
    release: 0.6,
  }}).toDestination();

tonicSynth.connect(slowAutoFilter);
colorSynth.connect(fastAutoFilter);
thirdSynth.connect(reverb);
colorSynth.connect(reverb);
colorSynth.connect(feedbackDelay);
thirdSynth.connect(feedbackDelay);

function getNoteGivenSentiment(sentiment) {
  let possibleNotes = [];
  if (sentiment <= 0.125 - .0625) {
    possibleNotes = notesByConsonance.slice(10, 13);
  } else if (sentiment <= 0.25) {
    possibleNotes = notesByConsonance.slice(8, 11);
  } else if (sentiment <= 0.375) {
    possibleNotes = notesByConsonance.slice(6, 9);
  } else if (sentiment <= 0.5) {
    possibleNotes = notesByConsonance.slice(6, 8);
  } else if (sentiment <= 0.625) {
    possibleNotes = notesByConsonance.slice(4, 8);
  } else if (sentiment <= 0.75) {
    possibleNotes = notesByConsonance.slice(2, 6);
  } else if (sentiment <= 0.875) {
    possibleNotes = notesByConsonance.slice(0, 4);
  } else if (sentiment <= 1) {
    possibleNotes = notesByConsonance.slice(0, 3);
  }

  const randomElement =
    possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
  return randomElement;
}

export function playTonic() {
  tonicSynth.triggerAttack("C4", 0, TONIC_VELOCITY*GAIN);
  tonicSynth.triggerRelease("+32n");
}

export function playThird(sentiment) {
  if (sentiment >= 0) {
    thirdSynth.triggerAttack("E4", 0, THIRD_VELOCITY*GAIN);
    thirdSynth.triggerRelease("+32n");
  } else {
    thirdSynth.triggerAttack("Eb4", 0, THIRD_VELOCITY*GAIN);
    thirdSynth.triggerRelease("+32n");
  }
}

export function playSentimentNote(sentiment) {
  const note = getNoteGivenSentiment(sentiment);
  colorSynth.triggerAttack(note, 0, SENTIMENT_VELOCITY*GAIN);
  colorSynth.triggerRelease("+32n");
}
