import React, { Component } from 'react';
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css';
import './RecordedMessage.css';
import { Button, ButtonGroup, Col, Container, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { BsPlayFill, BsStopFill } from 'react-icons/bs';
import { FiSend } from 'react-icons/fi';

class RecordedMessage extends Component {

  constructor() {
    super();
    this.state = {
      isRecording: false,
      effect: null,
      selectedEffectKey: 1,
    }
    this.renderEffectsDropdown = this.renderEffectsDropdown.bind(this);
    this.renderSendButton = this.renderSendButton.bind(this);
    this.renderPlayButton = this.renderPlayButton.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.renderDropDownItems = this.renderDropDownItems.bind(this);
    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
    this.effects = [
          {
            key: 1,
            effectName: 'No FX',
          },
          {
            key: 2,
            effectName: '🤖',
          },
          {
            key: 3,
            effectName: '👶',
          },
      ]
  }

  renderDropDownItems() {
    return this.effects.map(effect => (
        <Dropdown.Item key={effect.key} eventKey={effect.key} active={effect.key == this.state.selectedEffectKey}>
          {effect.effectName}
        </Dropdown.Item>
    ));
  }

  handleDropdownSelect(eventKey, event) {
    this.setState({...this.state, selectedEffectKey: eventKey});
  }

  renderEffectsDropdown() {
    const title = (this.effects.find(effect => effect.key == this.state.selectedEffectKey) || {effectName: 'fx'}).effectName
    return (
      <DropdownButton
        className=' btn-block fx-dropdown'
        block={true}
        size="md"
        as={ButtonGroup}
        key={'fx-dropdown'}
        id={'fx-dropdown'}
        title={title}
        onSelect={this.handleDropdownSelect}
      >
        {this.renderDropDownItems()}
</DropdownButton>
    );
  }

  renderSendButton() {
    return (
      <Button className='send-button' size="md" type="submit" variant="light" onClick={this.props.handleSend}>
        <FiSend color='white'/>
      </Button>
    );
  }

  renderPlayButton() {
    return (
      <Button className='play-button' size="md" type="submit" variant="light" onClick={this.handlePlay}>
        <BsPlayFill color='white'/>
      </Button>
    );
  }

  renderStopButton() {
    return (
      <Button className='stop-button' size="md" type="submit" variant="light" onClick={this.handleStop}>
        <BsStopFill color='white'/>
      </Button>
    );
  }

  handlePlay() {
    this.props.playAudio(this.props.audio, this.state.effect);
  }

  handleStop() {
    this.props.playAudio(this.props.audio);
  }

  render() {
    return (
      <Container>
        <Row className="recorded-content no-gutters">
          <Col xs={2} className='play-button-container'>
            {this.renderPlayButton()}
          </Col>
          <Col className='fx-dropdown-container'>
            {this.renderEffectsDropdown()}
          </Col>
          <Col xs={2} className='send-button-container'>
            {this.renderSendButton()}
          </Col>
        </Row>
      </Container>
    );
  }
}

 // TODO determine if this is the correct type
RecordedMessage.propTypes = {
  audio: PropTypes.string,
  playAudio: PropTypes.func,
  stopAudio: PropTypes.func,
  handleSend: PropTypes.func,
}

export default RecordedMessage;
