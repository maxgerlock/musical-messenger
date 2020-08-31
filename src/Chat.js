import React, { Component } from 'react';
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, InputGroup, FormControl, Popover, OverlayTrigger } from 'react-bootstrap';
import { BsMusicNote, BsFillMicFill } from 'react-icons/bs';
import {start, Transport } from 'tone';
import VoiceMessageModal from './VoiceMessageModal';
import ChatBubble from './ChatBubble.js';
import { playTonic, playThird, playSentimentNote } from './synths.js';
import { activateTracksBySentiment, setupPlayback } from './playback.js'
import { getSentimentScore } from './sentiment.js'

import './App.css';
import './Chat.css';

class Chat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: '',
      sentiment: null,
      messages: [],
      messageCount: 0,
    };
    this.messagesEndRef = React.createRef();

    this.handleTextChange = this.handleTextChange.bind(this);
    this.audiateMessage = this.audiateMessage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getSentimentClass = this.getSentimentClass.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendAudioMessage = this.sendAudioMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    Transport.bpm.value = 120
    Transport.stop();
    setupPlayback();
  }


  componentDidUpdate() {
    this.scrollToBottom();
    if (!this.props.musical) {
      Transport.stop();
    } else {
      Transport.start();
    }
}

  async sendMessage() {
    const sentiment = await getSentimentScore(this.state.text);
    const messages = this.state.messages;
    messages.push({text: this.state.text || '', id: this.state.messageCount, sentiment: sentiment});
    this.setState({text: '', sentiment: sentiment, messages: messages, messageCount: this.state.messageCount + 1});
    if (this.props.musical) {
      await start();
      await this.audiateMessage(sentiment);
    }
  }
  async sendAudioMessage(audio) {
    const messages = this.state.messages;
    messages.push({id: this.state.messageCount, audio: audio});
    this.setState({text: '', messages: messages, messageCount: this.state.messageCount + 1});
  }

  async audiateMessage(sentiment) {
    Transport.start();
    playTonic();
    playThird(sentiment);
    playSentimentNote(sentiment);
    activateTracksBySentiment(sentiment);
  }

  async handleSubmit() {
    if (!this.state.text) {
      return;
    }

    this.sendMessage();
  }

  scrollToBottom() {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  handleTextChange(event) {
    this.setState({text: event.target.value});
  }

  handleKeyDown(e) {
  if (e.key === 'Enter') {
    this.handleSubmit();
  }
}
  // TODO refactor this into a separate file that this and ChatBubble share
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

  // TODO move record popover into its own file probably
  getRecordPopover() {
    return (
      <Popover className='record-popover' id="record-popover">
        <Popover.Title as="h3">Voice message</Popover.Title>
        <Popover.Content className='record-button-container'>
          <VoiceMessageModal handleSend={this.sendAudioMessage}/>
        </Popover.Content>
      </Popover>
    );
  }

  getChatBubbleForMessage(message) {
    if (message.text) {
      return (
        <ChatBubble
          key={message.id}
          musical={this.props.musical}
          sentiment={message.sentiment}
          text={message.text}
          sentByUser={!(message.id % 2)}/>
      );
    } else if (message.audio) {
      return (
        <ChatBubble
          key={message.id}
          musical={this.props.musical}
          sentiment={message.sentiment}
          audio={message.audio}
          sentByUser={!(message.id % 2)}/>
      );
    }
  }

  render() {
    const chatBubbles = this.state.messages.map((message) => this.getChatBubbleForMessage(message));
    chatBubbles.push(<div key={'messages-end-ref'} ref={this.messagesEndRef} />);
    return (
        <div className='App-container'>
          <div className={`Chat-container ${this.getSentimentClass()}`}>{chatBubbles}</div>
          <InputGroup className="mb-3">
          <InputGroup.Prepend>
          <OverlayTrigger rootClose trigger="click" placement="top" overlay={this.getRecordPopover()}>
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
