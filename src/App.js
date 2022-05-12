import React, { Component } from 'react';
import './App.css';
import Messages from './components/Messages';
import Input from './components/Input';

function randomName() {
  const adjectives = [
    "Bobo", "Dozo", "Damir", "Kornilije", "Margo", "Ragnar", "Obama", "Teemo",
    "John", "Cxaxukluth", "Yog-Sothoth", "Davor", "Vojko", "Ronald", "Vladimir", "Joinko",
    "Jozo", "Suiiiii", "Vrhovni General", "Geralt", "Kocka", "Jusef", "Labudije", "Zoos"
  ];
  const nouns = [
    "Dodo", "Bono", "Skoljikević", "Kornilijus", "Butter", "Ok", "Obama", "Sotona",
    "Johnson", "The Ancient One", "Skelić", "V", "McDonald", "Vlado", "Boinko",
    "Bozo", "II", "Tito", "Of Rivia", "Labud", "Poporko", " Gospodar Vremena"
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + " " + noun;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
} 

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone(process.env.REACT_APP_SCALEDRONE_ROOM_KEY, { 
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1 className='App-header-title'>The Backrooms</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
