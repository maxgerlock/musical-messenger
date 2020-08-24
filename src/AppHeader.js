import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AppHeader.css';
import { BsMusicNote } from 'react-icons/bs';

class AppHeader extends Component {

  constructor() {
    super();

    this.state = {
      musical: true,
    }

  }

  render() {
    return (
      <div className='App-header'>
        <div className={`note-container ${this.props.musical ? 'active' : 'inactive'}`}>
          <BsMusicNote
          className='note-icon'
          size={32}
          onClick={this.props.toggleMusical}
          title='Toggle musical audiation of messages'/>
        </div>
        <h1> Musical Messenger </h1>
      </div>
    );
  }
}

AppHeader.propTypes = {
  musical: PropTypes.bool,
  toggleMusical: PropTypes.func,
}

export default AppHeader;
