import React, { Component } from 'react';
import PropTypes from 'prop-types'

import './ChatBubble.css';


class ChatBubble extends Component {

  constructor() {
    super();
    this.getSentimentClass = this.getSentimentClass.bind(this);
    this.getSentReceivedClass = this.getSentReceivedClass.bind(this);
    this.renderSentByUserBumper = this.renderSentByUserBumper.bind(this);
  }

  getSentimentClass() {
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

  render() {
    const classes = `chatBubble ${this.getSentimentClass()} ${this.getSentReceivedClass()}`
    return (
      <React.Fragment>
        <p className = {classes}> {this.props.text} </p>
      </React.Fragment>
    );
  }
}

ChatBubble.propTypes = {
  sentByUser: PropTypes.bool,
  sentiment: PropTypes.number,
  text: PropTypes.string,
}

export default ChatBubble;
