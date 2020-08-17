import React, { Component } from 'react';
import { Transport, Synth, AutoFilter, Reverb, Distortion, start } from 'tone';
import Sentiment from 'sentiment'
import './App.css';

const TONIC_VELOCITY = 0.3
const SENTIMENT_VELOCITY = 0.1
const THIRD_VELOCITY = 0.2
const GAIN = 0.4

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

class App extends Component {

  constructor() {
    super();
    // Transport
    Transport.bpm.value = 240
    this.state = {text: ''};
    this.sentiment = new Sentiment();
    // Synth setup
    this.tonic = new Synth().toDestination();
    this.thirdSynth = new Synth({envelope: {
        attack: 0.0,
        decay: 0.3,
        sustain: 0.6,
        release: 0.6,
      }}).toDestination();
    this.colorSynth = new Synth({envelope: {
        attack: 0.0,
        decay: 0.3,
        sustain: 0.6,
        release: 0.6,
      }}).toDestination();

    // Effects
    this.slowAutoFilter = new AutoFilter("4n").toDestination().start();
    this.fastAutoFilter = new AutoFilter("8n").toDestination().start();
    this.reverb = new Reverb(1.5, 0.5, .3).toDestination();
    this.distortion = new Distortion(0.5);

    this.tonic.connect(this.slowAutoFilter);
    this.colorSynth.connect(this.fastAutoFilter);
    this.colorSynth.connect(this.distortion);
    this.thirdSynth.connect(this.reverb);
    this.colorSynth.connect(this.reverb);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleAudiate = this.handleAudiate.bind(this);
  }

  analyze = (phrase) => {
    const val = this.sentiment.analyze(phrase);
    return {
      comparative: val.comparative,
      negative: val.negative,
      positive: val.positive
    };
  };

  // Used to get a better distribution of sentiments, essentially "exaggerating" sentiments towards extremes since most posts have mild sentiment
  apply_sigmoid = (sentiment) => {
    return 8*(1/(1+Math.exp(-sentiment)) - 0.5);
  }

  getNoteGivenComparativeSentiment = (comparative) => {
    let possibleNotes = [];
    if (comparative <= -3.0) {
      possibleNotes = notesByConsonance.slice(10, 13);
    } else if (comparative <= -2.0) {
      possibleNotes = notesByConsonance.slice(8, 11);
    } else if (comparative <= -1.0) {
      possibleNotes = notesByConsonance.slice(6, 9);
    } else if (comparative <= 0.0) {
      possibleNotes = notesByConsonance.slice(6, 8);
    } else if (comparative <= 1.0) {
      possibleNotes = notesByConsonance.slice(4, 8);
    } else if (comparative <= 2.0) {
      possibleNotes = notesByConsonance.slice(2, 6);
    } else if (comparative <= 3.0) {
      possibleNotes = notesByConsonance.slice(0, 4);
    } else if (comparative <= 4.0) {
      possibleNotes = notesByConsonance.slice(0, 3);
    }

    const randomElement =
      possibleNotes[Math.floor(Math.random() * possibleNotes.length)];
    return randomElement;
  };

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  playTonic() {
    this.tonic.triggerAttack("C3", 0, TONIC_VELOCITY*GAIN);
    this.tonic.triggerRelease("+16n");
  };

  playThird(sentiment) {
    if (sentiment >= 0) {
      this.thirdSynth.triggerAttack("E4", 0, THIRD_VELOCITY*GAIN);
      this.thirdSynth.triggerRelease("+16n");
    } else {
      this.thirdSynth.triggerAttack("Eb4", 0, THIRD_VELOCITY*GAIN);
      this.thirdSynth.triggerRelease("+16n");
    }
  }

  playSentimentNote(sentiment) {
    const note = this.getNoteGivenComparativeSentiment(sentiment);
    this.colorSynth.triggerAttack(note, 0, SENTIMENT_VELOCITY*GAIN);
    this.colorSynth.triggerRelease("+16n");
  };

  async handleAudiate() {
    //console.log('it\'s happenin!')
    await start();
    const text = document.getElementById("post").value; // TODO fix
    const feeling = this.apply_sigmoid(this.analyze(text).comparative);
    console.log(feeling)
    this.playTonic();
    this.playThird(feeling);
    this.playSentimentNote(feeling);
  }

  render() {
    return (
      <div className="App">
        <div className="App Header">
          <h1>Musical Messenger</h1>
        </div>
        <textarea value={this.state.text} onChange={this.handleTextChange} id="post" rows="5" cols="33" placeholder='Paste your post here'> </textarea>
        <br />
        <button onClick={this.handleAudiate} id='audiate-button'> audiate </button>
      </div>
    );
  }
}

export default App;
