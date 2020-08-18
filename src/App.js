import React, { Component } from 'react';
import {start, Player, Transport } from 'tone';
import { playTonic, playThird, playSentimentNote } from './synths.js';
import { activateTracksBySentiment, setupPlayback } from './playback.js'
import { getSentimentScore } from './sentiment.js'

import './App.css';


class App extends Component {

  constructor() {
    super();

    this.state = {text: '', messages: [], messageCount: 0};
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleAudiate = this.handleAudiate.bind(this);
    Transport.bpm.value = 120
    Transport.stop();
    setupPlayback();
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  async handleAudiate() {
    await start();
    const sentiment = await getSentimentScore(this.state.text);
    const messages = this.state.messages;
    messages.push({text: this.state.text || '', id: this.state.messageCount})
    this.setState({text: '', messages: messages, messageCount: this.state.messageCount + 1})
    console.log(sentiment)
    Transport.start()

    playTonic();
    playThird(sentiment);
    playSentimentNote(sentiment);
    activateTracksBySentiment(sentiment);
  }

  render() {
    const messages = this.state.messages.map((message) =>
    <p key={message.id}>{message.text}</p>
  );
    return (
      <div className="App">
        <div className="App Header">
          <h1>Musical Messenger</h1>
        </div>
        <div>{messages}</div>
        <textarea value={this.state.text} onChange={this.handleTextChange} id="post" rows="5" cols="33" placeholder='Paste your post here'> </textarea>
        <br />
        <button onClick={this.handleAudiate} id='audiate-button'> audiate </button>
      </div>
    );
  }
}

export default App;
