import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { BsMusicNote } from 'react-icons/bs';
import {start, Transport } from 'tone';
import ChatBubble from './ChatBubble.js';
import { playTonic, playThird, playSentimentNote } from './synths.js';
import { activateTracksBySentiment, setupPlayback } from './playback.js'
 import { getSentimentScore } from './sentiment.js'

import './App.css';


class App extends Component {

  constructor() {
    super();

    this.state = {text: '', sentiment: null, messages: [], messageCount: 0};
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleAudiate = this.handleAudiate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getSentimentClass = this.getSentimentClass.bind(this);
    Transport.bpm.value = 120
    Transport.stop();
    setupPlayback();
  }

  async handleAudiate() {
    await start();
    const sentiment = await getSentimentScore(this.state.text);
    const messages = this.state.messages;
    messages.push({text: this.state.text || '', id: this.state.messageCount, sentiment: sentiment})
    this.setState({text: '', sentiment: sentiment, messages: messages, messageCount: this.state.messageCount + 1})
    console.log(sentiment)
    Transport.start()

    playTonic();
    playThird(sentiment);
    playSentimentNote(sentiment);
    activateTracksBySentiment(sentiment);
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  handleKeyDown(e) {
  if (e.key === 'Enter') {
    this.handleAudiate();
  }
}
  // todo refactor this into a separate file that this and ChatBubble share
  getSentimentClass() {
    if (!this.state.sentiment) {
      return;
    } else if (this.state.sentiment < 0.25) {
      return 'very-negative';
    } else if (this.state.sentiment < 0.45) {
      return 'somewhat-negative';
    } else if (this.state.sentiment < 0.55) {
      return 'neutral';
    } else if (this.state.sentiment < 0.75) {
      return 'somewhat-positive';
    } else {
      return 'very-positive';
    }
  }

  render() {
    const messages = this.state.messages.map((message) =>
    <ChatBubble key={message.id} sentiment={message.sentiment} text={message.text} sentByUser={!(message.id % 2)}/>
  );
    return (
      <div className="App">
        <div className="App-header">
          <h1> Musical Messenger </h1>
        </div>
        <div className='App-container'>
          <div className={`Chat-container ${this.getSentimentClass()}`}>{messages}</div>
          <InputGroup className="mb-3">
            <FormControl
              onKeyDown={this.handleKeyDown}
              onChange={this.handleTextChange}
              value={this.state.text}
              aria-label="Message text"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button type="submit" variant="info" onClick={this.handleAudiate}>
                <BsMusicNote/>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </div>
    );
  }
}

export default App;
