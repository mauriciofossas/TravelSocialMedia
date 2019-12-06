import ajax from './ajax';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Modal, Nav} from 'react-bootstrap';
import _ from 'lodash';

class FlightLookup extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      origin: null,
      departureDate: null,
      returnDate: null,
      valid: <Nav.Link target="_blank" href="https://www.world-airport-codes.com/">Invalid airport, find your IATA code here.</Nav.Link>
    }
    this.doQuery = _.debounce(this.doQuery, 750).bind(this);
  }

  doQuery = async (query) => {
    const res = await ajax.post('originSearch', {query});
    if (res){
      this.setState({origin: res.airport, valid: "Valid airport"});
    } else{
      this.setState({origin: null, valid: <Nav.Link target="_blank" href="https://www.world-airport-codes.com/">Invalid airport, find your IATA code here.</Nav.Link>});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query) {
      this.doQuery(this.state.query);
    }
  }

  render(){
    const {query, departureDate, returnDate, valid} = this.state;
    const {show, doSearch, doCancel, destination} = this.props
    return (
      <Modal show={show}>
        <Modal.Body>
          <p>*Flying from:{' '}
            <input type="text"
                   placeholder="Outgoing airport"
                   value={query}
                   onChange={(e) => this.setState({query: e.target.value})}
            />
            {' '}{valid}
          </p>
          <p>
            Flying to:{' '}
            <input type="text" readOnly="readonly"
                   value={destination}
            />
          </p>
          <p>
            *Departure date:{' '}
            <input type="date"
                   placeholder="Departure date"
                   value={departureDate}
                   onChange={(e) => this.setState({departureDate: e.target.value})}
            />
          </p>
          <p>
            Return date:{' '}
            <input type="date"
                   placeholder="Returning date"
                   value={returnDate}
                   onChange={(e) => this.setState({returnDate: e.target.value})}
            />
          </p>
          <p>* indicate mandatory parameters</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={doCancel}>Close</Button>
          <Button variant="secondary" onClick={()=> doSearch({
            validAirport: valid,
            outgoingAirport: query,
            incomingAirport: destination,
            departureDate,
            returnDate
          })}>Search</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

//const FlightLookup = (props) => null;

export default FlightLookup;
