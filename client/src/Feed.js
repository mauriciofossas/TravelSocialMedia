import React from 'react';
import _ from 'lodash';

import Message from './Message';

import ajax from './ajax';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      lastTime: null
    };
  }
  
  async componentDidMount() {
    const messages = await this.getMessages();
    const lastTime = Date.now();
    this.setState({messages, lastTime});
    setInterval(this.getUpdates, 30000); // Get updates every 30 seconds
  }

  getUpdates = async () => {
    const {messages} = await ajax.post('updates', {lastTime: this.state.lastTime});
    console.log(messages);
    const lastTime = Date.now();
    this.setState({lastTime, messages: _.flatten([messages, this.state.messages])});
  }

  getMessages = async() => {
    const {messages} = await ajax.post('messages');
    return messages;
  }

  render() {
    const {messages} = this.state;
    return (
      <ul>
      {messages.map(message => <Message message={message} />)}
      </ul>
    );
  }
}

export default Feed;
