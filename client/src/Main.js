import React from 'react';
import {Container, Row, Col, Form, Nav, NavDropdown, Navbar, Button, FormControl} from 'react-bootstrap';
import ajax from './ajax';
import _ from 'lodash';

import City from "./City";
import Feed from "./Feed";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      continent: 'Continent',
      country: 'Country',
      countries: [],
      city: null,
      numCities: 0,
      minPop: 0,
      maxPop: 100000000
    };
    //this.doQuery = _.debounce(this.doQuery, 500).bind(this); // Only call doQuery if the user doesn't type for half a second
  }

  getCountries = async (continent) => {
    if (!this.state.continent || continent === 'Any') {
      this.setState({countries: []});
    } else {
      const res = await ajax.post('getCountries', {continent});
      this.setState({countries: res.countries});
    }
  }

  getCity = async () => {
    const {continent, country, minPop, maxPop} = this.state;
    const res = await ajax.post('getCity', {
      continent: continent === 'Any' || continent === "Continent" ? null : continent,
      country: country === 'Any' || country == 'Country' ? null : country,
      minPop: minPop === "" ? 0 : minPop, 
      maxPop: maxPop === "" ? 1000000000 : maxPop
    });
    this.setState({
      city: res.city,
      numCities: res.numCities,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.continent !== this.state.continent) {
      this.getCountries(this.state.continent);
    }
  }


  render() {
    const {query, countries, city, numCities} = this.state;
    const {username} = this.props;
    return (
      <Container>
        <Row><Col lg={9} md={12}>
          Hey {username}! Where do you want to go today? <br></br>
          <Navbar bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="Selector">
                <NavDropdown className="noContinent" title={this.state.continent} id="ContinentDropdown">
                  {["Any", "Africa", "Asia", "Europe", "North America", "Oceania", "South America"].map((continent) => (
                    <NavDropdown.Item className="continentSelection" onClick={(e)=> this.setState({continent : e.target.innerHTML, country : "Country"})}>{continent}</NavDropdown.Item>
                  ))}
                </NavDropdown>
                <NavDropdown title={this.state.country} id="CountryDropdown">
                  <NavDropdown.Item className="countrySelection" onClick={(e)=> this.setState({country : e.target.innerHTML})}>Any</NavDropdown.Item>
                  {countries.map((country) => (
                    <NavDropdown.Item className="countrySelection" onClick={(e)=> this.setState({country : e.target.innerHTML})}>{country}</NavDropdown.Item>
                  ))}
                </NavDropdown>
              </Nav>
              <Form inline>
                <FormControl type="number" id="minPop" placeholder="Minimum population" className="mr-sm-2" onChange={(e)=> this.setState({minPop : e.target.value})} />
              </Form>
              <Form inline>
                <FormControl type="number" id="maxPop" placeholder="Maximum population" className="mr-sm-2" onChange={(e)=> this.setState({maxPop : e.target.value})}/>
              </Form>
              <Button id="lookForCity" variant="outline-success" onClick={this.getCity}>Search</Button>
            </Navbar.Collapse>
          </Navbar>
          {city &&
           <City city={city} numCities={numCities}/>
          }
        </Col>
        <Col sm={3}>
          <Feed/>
        </Col>
        </Row>
      </Container>
    );
  }
}

export default Main;
