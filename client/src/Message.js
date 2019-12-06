import React from 'react';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {message} = this.props;
    return (
      <p>
        <li>
          <span><strong>{message.username}</strong>: </span>
          { message.foundFlight ?
            <span>found a flight to the airport closest to <strong>{message.destination}</strong> for <strong>${message.price}</strong>!</span>
            :
            <span>is still looking for flights to airports close to <strong>{message.destination}.</strong></span>
          }
        </li>
      </p>
    )
  }
}

export default Message;
