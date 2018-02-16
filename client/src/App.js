import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter } from "react-router-dom";
import Main from "./components/Main";

class App extends Component {

  constructor() {
    super()
    this.state = {
      pin: ""
    }
  }

  sendPinRoot(pin) {
    this.setState({
      pin: pin
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header pin={this.state.pin}/>
          <Main sendPinRoot={(pin) => {this.sendPinRoot(pin)}}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
