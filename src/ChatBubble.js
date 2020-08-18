import React, { Component } from 'react';

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
      return 'very-negative';
    } else if (this.props.sentiment < 0.45) {
      return 'somewhat-negative';
    } else if (this.props.sentiment < 0.55) {
      return 'neutral';
    } else if (this.props.sentiment < 0.75) {
      return 'somewhat-positive';
    } else {
      return 'very positive';
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
//        <div className='blank-line'/>
  render() {
    const classes = `chatBubble ${this.getSentimentClass()} ${this.getSentReceivedClass()}`
    return (
      <React.Fragment>
        <p className = {classes}> {this.props.text} </p>
      </React.Fragment>
    );
  }
}

export default ChatBubble;
