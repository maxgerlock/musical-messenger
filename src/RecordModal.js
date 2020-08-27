import React, { Component } from 'react';
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecordModal.css';
import { BsStopFill } from 'react-icons/bs';

class RecordModal extends Component {

  constructor() {
    super();
    this.state = {
      isRecording: false,
    }
    this.getRecordButtonContents = this.getRecordButtonContents.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (!this.state.isRecording) {
      this.props.startRecord();
    } else {
      this.props.stopRecord();
    }
    this.setState({isRecording: !this.state.isRecording});
  }

  getRecordButtonContents() {
    if (this.state.isRecording) {
      return (
        <BsStopFill size={26}/>
      )
    } else {
      return "Record"
    }
  }

  render() {
    return (
      <div className="record-button" onClick={this.handleClick}>
        {this.getRecordButtonContents()}
      </div>
    );
  }
}

RecordModal.propTypes = {
  startRecord: PropTypes.func,
  stopRecord: PropTypes.func,
}

export default RecordModal;
