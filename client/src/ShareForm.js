import React from 'react';

import {Form, Button} from 'react-bootstrap';

const isMoney = (str) => str === '' || /^\$\d+\.?\d{0,2}$/.test(str)

class ShareForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flightFound: false,
      price: "",
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.foundFlight && !this.state.flightFound) {
      this.setState({price: ""});
    }
  }

  canShare = () =>
    isMoney(this.state.price);

  handleShare = (items) => {
    if (this.canShare()) {
      this.props.doShare(items);
    }
  }

  render() {
    const {shared, doShare} = this.props;
    const {flightFound, price} = this.state;
    if (!shared) {
      return (
        <div>
          <h3>Share your findings!</h3>
          <Form>
            <Form.Check
              type="checkbox"
              onClick={e => this.setState({flightFound: e.target.checked})}
              label="Flight Found? (Note that if you were directed to Student Universe's main page, no flights were found)"
            />
            {flightFound && <>
             <Form.Label>Price:</Form.Label>
             <Form.Control
               type="text"
               onChange={e => this.setState({price: e.target.value})}
               isInvalid={!isMoney(price)}
               value={price}
             />
             Please note that prices must be inputed as: '$ddd.dd' (e.g. $144.3, $70.33). <br></br>
             </>
            }
            <Button variant="primary" onClick={() => this.handleShare({
              flightFound,
              price
            })}>
              Share!
            </Button>
          </Form>
        </div>
      )
    } else {
      return <div>Thanks for sharing!</div>
    }
  }
}

export default ShareForm;
