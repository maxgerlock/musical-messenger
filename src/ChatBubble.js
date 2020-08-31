import React, { Component } from 'react';
import PropTypes from 'prop-types';

import VoiceMessage from './VoiceMessage';

import './ChatBubble.css';

// TODO determine whether this component is rendering unnecessarily
class ChatBubble extends Component {

  constructor() {
    super();
    this.getSentimentClass = this.getSentimentClass.bind(this);
    this.getSentReceivedClass = this.getSentReceivedClass.bind(this);
    this.renderSentByUserBumper = this.renderSentByUserBumper.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
  }

  getSentimentClass() {
    if (!this.props.musical) {
      return '';
    }
    if (this.props.sentiment < 0.25) {
      return 'very-negative-message';
    } else if (this.props.sentiment < 0.45) {
      return 'somewhat-negative-message';
    } else if (this.props.sentiment < 0.55) {
      return 'neutral-message';
    } else if (this.props.sentiment < 0.75) {
      return 'somewhat-positive-message';
    } else {
      return 'very-positive-message';
    }
  }

  getSentReceivedClass() {
    if (this.props.sentByUser) {
      return 'sent-by-user';
    } else {
      return 'received-by-user';
    }
  }

  renderSentByUserBumper() {
    if (this.props.sentByUser) {
      return (
        <div className='bumper'/>
      );
    }
  }

  renderReceivedByUserBumper() {
    if (!this.props.sentByUser) {
      return (
        <div className='bumper'/>
      );
    }
  }

  renderText() {
    return (
      <p> {this.props.text} </p>
    );
  }

  renderAudio() {
    return (
      <VoiceMessage
        playAudio={this.playAudio}
        stopAudio={this.stopAudio}
        isInProgress={false}
      />
    );
  }

  playAudio() {
    this.props.audio.play();
  }

  stopAudio() {
    this.props.audio.pause();
    this.props.audio.load();
  }


  render() {
    const classes = `chatBubble ${this.props.audio ? 'audioChatBubble' : ''} ${this.getSentimentClass()} ${this.getSentReceivedClass()}`
    return (
      <div className={classes}>
        {this.props.text ? this.renderText() : null}
        {this.props.audio ? this.renderAudio() : null}
      </div>
    );
  }
}

ChatBubble.propTypes = {
  sentByUser: PropTypes.bool,
  musical: PropTypes.bool,
  sentiment: PropTypes.number,
  text: PropTypes.string,
  audio: PropTypes.object,
}

export default ChatBubble;
