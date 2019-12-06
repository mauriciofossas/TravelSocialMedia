import React from 'react'
import {Button} from 'react-bootstrap';

import ajax from './ajax';

import FlightLookup from './FlightLookup';
import ShareForm from './ShareForm';

class City extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      destination: null,
      viewedFlight: false,
      sharedFlight: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.city !== this.props.city) {
      this.setState({wantsFlight: false});
    }
  }

  lookupFlight = async() => {
    const {Longitude, Lattitude, Country} = this.props.city;
    const closestAirport = await ajax.post("findAirport", {Longitude, Lattitude, Country});
    this.setState({modalOpen: true, destination: closestAirport, sharedFlight: false});
  }

  cancelFlight = () => {
    this.setState({modalOpen: false});
  }

  searchFlight = ({validAirport, outgoingAirport, incomingAirport, departureDate, returnDate}) => {
    if(outgoingAirport && departureDate && validAirport==="Valid airport"){
      this.setState({modalOpen: false, viewedFlight: true});
      let url = "https://www.studentuniverse.com/flights/1/";
      url += `${outgoingAirport}/${incomingAirport}/${departureDate}`;
      if (returnDate) {
        url += `/${incomingAirport}/${outgoingAirport}/${returnDate}`;
      }
      const win = window.open(url, '_blank');
      win.focus();
    } else{
      window.alert("One or more required fields have not been filled out properly")
    }
  }

  shareFlight = async ({flightFound, price}) => {
    this.setState({sharedFlight: true});
    ajax.post("shareFlight", {
      flightFound,
      price,
      city: this.props.city.City + ', ' + this.props.city.Country,
    })
  }
  
  render () {
    const {city, numCities} = this.props;
    const {destination, viewedFlight, sharedFlight} = this.state;
    if(this.props.numCities === 0){
      return(
        <div>
          <p>Sorry, your search did not return any results. Try again!</p>
        </div>
      )
    } else{
      return (
        <div>
          <p><h2>{city.City}</h2></p>
          <p>{city.City} is in {city.Country}, {city.Continent}.</p>
          <p>It has a population of {city.Population}.</p>
          <p><Button onClick={this.lookupFlight}> Click here to see flights</Button></p>
          <p>There are <strong>{numCities - 1}</strong> other cities that meet your needs! Search again!</p>
          <FlightLookup
            destination={
            this.state.destination ?
            this.state.destination.closestAirport :
            null
            }
            show={this.state.modalOpen}
            doSearch={this.searchFlight}
            doCancel={this.cancelFlight}
          />
          {viewedFlight &&
           <ShareForm
             shared={sharedFlight}
             doShare={this.shareFlight}
           />
          }
        </div>
      )
    }
  }
}

export default City;
