import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './Chat';
import AppHeader from './AppHeader'
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
      musical: true,
    }
    this.toggleMusical = this.toggleMusical.bind(this);
  }

  toggleMusical() {
    this.setState({...this.state, musical: !this.state.musical});
  }

  render() {
    return (
      <div className="App">
        <AppHeader toggleMusical={this.toggleMusical} musical={this.state.musical}/>
        <Chat musical={this.state.musical}/>
      </div>
    );
  }
}

export default App;
