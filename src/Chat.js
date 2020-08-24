import React, { Component } from 'react';
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl, Popover, OverlayTrigger } from 'react-bootstrap';
import { BsMusicNote, BsFillMicFill } from 'react-icons/bs';
import {start, Transport } from 'tone';
import RecordModal from './RecordModal.js';
import RecordedMessage from './RecordedMessage.js';
import ChatBubble from './ChatBubble.js';
import { playTonic, playThird, playSentimentNote } from './synths.js';
import { activateTracksBySentiment, setupPlayback } from './playback.js'
import { getSentimentScore } from './sentiment.js'

import './App.css';
import './Chat.css';

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      sentiment: null,
      messages: [],
      messageCount: 0
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.audiateMessage = this.audiateMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getSentimentClass = this.getSentimentClass.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getRecordPopover = this.getRecordPopover.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this)
    this.getRecordPopoverContents = this.getRecordPopoverContents.bind(this);

    Transport.bpm.value = 120
    Transport.stop();
    setupPlayback();
  }

  componentDidUpdate() {
  if (!this.props.musical) {
    Transport.stop();
  } else {
    Transport.start();
  }
}

  async sendMessage() {
    const sentiment = await getSentimentScore(this.state.text);
    const messages = this.state.messages;
    messages.push({text: this.state.text || '', id: this.state.messageCount, sentiment: sentiment})
    this.setState({text: '', sentiment: sentiment, messages: messages, messageCount: this.state.messageCount + 1})
  }

  async audiateMessage() {
    Transport.start()
    playTonic();
    playThird(this.state.sentiment);
    playSentimentNote(this.state.sentiment);
    activateTracksBySentiment(this.state.sentiment);
  }

  async handleSubmit() {
    if (!this.state.text) {
      return;
    }
    await start();
    this.sendMessage()
    if (this.props.musical) {
      await this.audiateMessage();
    }
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  handleKeyDown(e) {
  if (e.key === 'Enter') {
    this.handleSubmit();
  }
}
  // todo refactor this into a separate file that this and ChatBubble share
  getSentimentClass() {
    if (!this.state.sentiment || !this.props.musical) {
      return '';
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

  startRecord() {
    // TODO
    console.log('recording started');
  }

  stopRecord() {
    // TODO
        console.log('recording stopped');
  }

  getRecordPopoverContents() {
    // return (<RecordModal startRecord={this.startRecord} stopRecord = {this.stopRecord}/>);
    return (
      <RecordedMessage audio=''> </RecordedMessage>
    );
  }

  // TODO move record popover into its own file probably
  getRecordPopover() {
    return (
      <Popover className='record-popover' id="record-popover">
        <Popover.Title as="h3">Record a voice message</Popover.Title>
        <Popover.Content className='record-button-container'>
          {this.getRecordPopoverContents()}
        </Popover.Content>
      </Popover>
    );
  }

  render() {
    const messages = this.state.messages.map((message) =>
    <ChatBubble key={message.id} musical={this.props.musical} sentiment={message.sentiment} text={message.text} sentByUser={!(message.id % 2)}/>
  );
    const popover = this.getRecordPopover();
    return (
        <div className='App-container'>
          <div className={`Chat-container ${this.getSentimentClass()}`}>{messages}</div>
          <InputGroup className="mb-3">
          <InputGroup.Prepend>
          <OverlayTrigger trigger="click" placement="top" overlay={popover}>
            <Button variant="danger" onClick={this.openRecord}>
              <BsFillMicFill/>
            </Button>
          </OverlayTrigger>
          </InputGroup.Prepend>
            <FormControl
              onKeyDown={this.handleKeyDown}
              onChange={this.handleTextChange}
              value={this.state.text}
              aria-label="Message text"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button type="submit" variant="info" onClick={this.handleSubmit}>
                <BsMusicNote/>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
    );
  }
}

  Chat.propTypes = {
    musical: PropTypes.bool,
  }

export default Chat;
