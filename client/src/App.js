import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Main from './Main';
import ajax from './ajax';

class App extends React.Component {
  constructor(props) {
    super(props); // Undoubtably empty
    this.state = {
      username: null,
    }
  }
  onLogin = async (username, password) => {
    try {
      await ajax.post('login', {username, password});
      this.setState({username});
    } catch (error) {
      if(error.status === 400){
        window.alert("This username has not yet been registered");
      } else{
        window.alert("Incorrect password");
      }
    }
  }
  onRegister = async(username, password) => {
    try {
      await ajax.post('register', {username, password});
      this.setState({username});
    } catch (error) {
      if(error.status === 400){
        window.alert("This username has already been taken, please try again.");
      } else{
        window.alert("You must set a password and username in order to register");
      }
    }
  }
  render() {
    if (this.state.username) {
      return <Main username={this.state.username} />;
    } else {
      return <Login onLogin={this.onLogin} onRegister={this.onRegister}/>;
    }
  }
}

export default App;
