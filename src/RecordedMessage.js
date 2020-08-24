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
    }
    this.effectsDropdown = this.effectsDropdown.bind(this);
    this.sendButton = this.sendButton.bind(this);
  }

  effectsDropdown() {
    return (
      <DropdownButton
        className='fx-dropdown'
        size="sm"
        as={ButtonGroup}
        key={'fx-dropdown'}
        id={'fx-dropdown'}
        variant={'info'}
        title={'fx'}
      >
        <Dropdown.Item eventKey="1">No Effect</Dropdown.Item>
        <Dropdown.Item eventKey="2">🤖</Dropdown.Item>
        <Dropdown.Item eventKey="3" active> 👶 </Dropdown.Item>
</DropdownButton>
    );
  }

  sendButton() {
    return (
      <Button size="sm" type="submit" variant="info" onClick={this.props.handleSend}>
        <FiSend/>
      </Button>
    );
  }

  handlePlay() {
    this.props.playAudio(this.props.audio, this.state.effect);
  }

  renderPlayOrStopButton() {
    if (this.state.playing) {
      return (
        <BsPlayFill
        onClick={this.props.playAudio}
        className='play-button'
        color='white'
        />
      )
    } else {
      return (
        <BsStopFill
      className='stop-button'
      color='white'
      />
    );
    }
  }

  render() {
    return (
      <Container>
        <Row>
          <Col className='fx-dropdown-container' xs={3}>
            {this.effectsDropdown()}
          </Col>
          <Col className="recorded-content" xs={7}>
            <BsPlayFill
            className='play-button'
            color='white'
            />
          </Col>
          <Col xs={2}>
          {this.sendButton()}
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
  handleSend: PropTypes.func,
}

export default RecordedMessage;
