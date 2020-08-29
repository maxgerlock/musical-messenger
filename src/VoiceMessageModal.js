import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecordModal from './RecordModal.js';
import { applyEffect, setupRecording, startRecording, stopRecording } from './recording.js';
import { getEffects } from './voiceEffects.js'
import RecordedMessage from './RecordedMessage.js';

class VoiceMessageModal extends Component {
  constructor() {
    super();
    this.state = {
      isRecording: false,
      recordedAudio: null,
      effects: null,
    }
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.applyEffect = this.applyEffect.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
    this.onStopRecording = this.onStopRecording.bind(this);
    setupRecording(this.onStopRecording);
  }

  async componentDidMount() {
    const effects = await getEffects();
    this.setState({effects: effects});
  }

  // callback to populate audio upon stopping recording is set up here
  onStopRecording(audio) {
    this.setState({recordedAudio: audio});
  }

  startRecord() {
    console.log('recording started');
    startRecording();
  }

  stopRecord() {
    console.log('recording stopped');
    stopRecording(); // audio is populated without direct assignment using the onStopRecording callback specified in setupRecording
  }

  applyEffect(webAudioEffect) {
    applyEffect(this.state.recordedAudio, webAudioEffect);
  }

  playAudio() {
    this.state.recordedAudio.play();
  }

  stopAudio() {
    this.state.recordedAudio.pause();
    this.state.recordedAudio.load();
  }

  render() {
    if (!this.state.recordedAudio) {
      return (<RecordModal startRecord={this.startRecord} stopRecord = {this.stopRecord}/>);
    } else {
      return (
        <RecordedMessage effects={this.state.effects} applyEffect={this.applyEffect} playAudio={this.playAudio} stopAudio={this.stopAudio}/>
      );
    }
  }
}

VoiceMessageModal.propTypes = {

}

export default VoiceMessageModal;
