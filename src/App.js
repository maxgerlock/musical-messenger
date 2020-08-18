import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl, Container, Row } from 'react-bootstrap';
import {start, Transport } from 'tone';
import ChatBubble from './ChatBubble.js';
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
    this.handleKeyDown = this.handleKeyDown.bind(this);
    Transport.bpm.value = 120
    Transport.stop();
    setupPlayback();
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

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  handleKeyDown(e) {
  if (e.key === 'Enter') {
    this.handleAudiate();
  }
}


  render() {
    const messages = this.state.messages.map((message) =>
    <ChatBubble key={message.id} text={message.text} sentByUser={!(message.id % 2)}/>
  );
    return (
      <div className="App">
        <div className="App-header">
          <h1>Musical Messenger</h1>
        </div>
        <Container>
          <Row>
            <div className="Chat-container">{messages}</div>
          </Row>
        </Container>
        <Container>
          <Row>
            <InputGroup className="mb-3">
              <FormControl
                onKeyDown={this.handleKeyDown}
                onChange={this.handleTextChange}
                value={this.state.text}
                aria-label="Message text"
                aria-describedby="basic-addon2"
              />
              <InputGroup.Append>
                <Button type="submit" variant="info" onClick={this.handleAudiate}>jam</Button>
              </InputGroup.Append>
            </InputGroup>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
