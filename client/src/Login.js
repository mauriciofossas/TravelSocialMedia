import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  render() {
    const {username, password} = this.state;
    const {onLogin, onRegister} = this.props;
    return (
      <div>
        <input type="text"
               placeholder="Username"
               value={this.state.username}
               onChange={(e) => this.setState({username: e.target.value})}
        />
        <input type="password"
               placeholder="Password"
               value={this.state.password}
               onChange={(e) => this.setState({password: e.target.value})}
        />
        <button onClick={() => onLogin(username, password)}>Login</button>
        <button onClick={() => onRegister(username, password)}>Register</button>
      </div>
    );
  }
}

export default Login;
