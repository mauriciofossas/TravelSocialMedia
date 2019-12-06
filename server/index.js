//Server side
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const db = require('./mysql.js');
const scrape = require('./scrape.js');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(session({
  secret: "dane&mau",
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 30 * 1000 * 60}
}));

const publicDir = path.join(__dirname, '..', 'client/build');
app.use(express.static(publicDir));

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const loginResponse = await db.login(username, req.body.password);
  if (loginResponse == 'bad username'){
    res.status(400).send("This username has not yet been registered");
  } else if (loginResponse == 'bad password'){
    res.status(401).send("Incorrect password");
  } else {
    req.session.loggedIn = true;
    req.session.username = req.body.username;
    res.send({username: req.body.username});
  }
})

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(password && username){
    if(await db.createUser(username, password)){
      req.session.loggedIn = true;
      req.session.username = req.body.username;
      res.send({username: req.body.username});
    } else{
      res.status(400).send("This username has already been taken, please try again.");
    }
  }else{
    res.status(402).send("You must set a password and username in order to register");
  }
})

const verifyUser = (req, res) => {
  if (!req.session.loggedIn) {
    console.log(req.session);
    res.status(403);
    res.send("Unauthenticated");
    return false;
  }
  return true;
}

app.post("/originSearch", async (req, res) => {
  if (!verifyUser(req, res)) return;
  const foundAirport = await db.verifyAirport(req.body.query);
  res.send(foundAirport);
})

app.post("/getCountries", async (req, res) => {
  if (!verifyUser(req, res)) return;
  const continent = req.body.continent;
  const countries = await db.getCountriesByContinent(continent);
  res.send({countries});
})

app.post("/getCity", async(req, res) => {
  if (!verifyUser(req, res)) return;
  const {country, continent, minPop, maxPop} = req.body;
  let whereClause = 'where Population >= ? and Population <= ?';
  let arguments = [minPop, maxPop]
  if (country) {
    whereClause += " and Country = ?"
    arguments.push(country);
  }
  if (continent) {
    whereClause += " and Continent = ?"
    arguments.push(continent); 
  }
  const cities = await db.getCities(whereClause, arguments);
  if(cities.length === 0){
    res.send({city: "null", numCities: 0});
  } else{
    const city = cities[Math.floor(Math.random() * cities.length)];
    res.send({city, numCities: cities.length});
  }
})

app.post("/findAirport", async(req, res) => {
  if (!verifyUser(req, res)) return;
  const {Longitude, Lattitude, Country} = req.body;
  closestAirport = await scrape.getClosestAirport(Longitude, Lattitude, Country);
  res.send({closestAirport});
})

app.post("/shareFlight", async(req, res) => {
  if (!verifyUser(req, res)) return;
  const {flightFound, price, city} = req.body;
  const user = req.session.username;
  db.shareFlight({foundFlight: flightFound, price: parseFloat(price.substring(1)), destination: city, username: user})
  res.send({});
})

app.post("/messages", async(req, res) => {
  if (!verifyUser(req, res)) return;
  const messages = await db.getMessages();
  res.send({messages});
})

app.post("/updates", async(req, res) => {
  if (!verifyUser(req, res)) return;
  const {lastTime} = req.body;
  const messages = await db.getUpdates({lastTime});
  res.send({messages});
})

server.listen(8080);
console.log('Server is up! Did you remember to `yarn build` the client?');
