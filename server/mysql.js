const moment = require('moment');
const mysql = require('mysql');
const util = require('util');
const passwordHash = require('password-hash');

const mysqli = require('mysql').createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'NEWSUSER',
  password: '1dane&2mau',
  database: 'countries'
})

mysqli.query = util.promisify(mysqli.query);

const createUser = async (username, password) => {
  const hashedPassword = passwordHash.generate(password);
  try {
    await mysqli.query('insert into users (username, password) values (?, ?)', [username, hashedPassword]);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const login = async (username, password) => {
  const res = await mysqli.query('select password from users where username = ?', [username]);
  if (res.length === 0) {
    return 'bad username';
  } else if (passwordHash.verify(password, res[0].password)) {
    return 'ok';
  } else {
    return 'bad password';
  }
}

const getCountriesByContinent = async (continent) => {
  const res = await mysqli.query('select distinct Country from cities where Continent = ?', [continent]);
  return res.map(({Country}) => Country);
}

const verifyAirport = async (airport) => {
  const res = await mysqli.query('select * from airports where Airport = ?', [airport]);
  if(res.length > 0){
    return res[0];
  } else{
    return false;
  }
}

const getCities = async (whereClause, arguments) => {
  const res = await mysqli.query('select City, Lattitude, Longitude, Continent, Population, Country from cities ' + whereClause, arguments);
  return res;
}

const shareFlight = async(info) => {
  const {username, destination, foundFlight, price} = info;
  let res;
  if (foundFlight) {
    res = await mysqli.query('insert into posts (username, destination, foundFlight, price) values (?, ?, ?, ?)', [username, destination, true, price]);
  } else {
    res = await mysqli.query('insert into posts (username, destination, foundFlight, price) values (?, ?, ?, ?)', [username, destination, false, null]);
  }
  return res;
}

const getMessages = async () => {
  const res = await mysqli.query('select username, destination, foundFlight, price from posts order by postTime desc');
  return res;
}

const getUpdates = async ({lastTime}) => {
  const formattedTimestamp = moment(lastTime).format('YYYY-MM-DD HH:mm:ss');
  res = await mysqli.query('select username, destination, foundFlight, price from posts where postTime > ? order by postTime desc', [formattedTimestamp]);
  return res;
}

module.exports = {getCountriesByContinent, getCities, createUser, login, verifyAirport, shareFlight, getMessages, getUpdates};
