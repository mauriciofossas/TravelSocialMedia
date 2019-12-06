const util = require('util');
const request = util.promisify(require('request'));
const cheerio = require('cheerio');

const getClosestAirport = async (long, lat, country) =>  {
  if(lat < 0){
    const url = 'https://www.travelmath.com/nearest-airport/' + country;
    const html = await request(url);
    console.log('Scraping ' + url);
    const $ = cheerio.load(html.body);
    const closestAirport = $('td[valign=top]').find('a').eq(0).attr('href').split('/')[2];
    return closestAirport;
  } else{
    const url = 'https://www.travelmath.com/nearest-airport/' + lat + ',' + long;
    const html = await request(url);
    console.log('Scraping ' + url);
    const $ = cheerio.load(html.body);
    const closestAirport = $('a[name=international-airports]').nextAll('p').find('a').eq(1).attr('href').split('/')[2];
    return closestAirport;
  }
}

module.exports = {getClosestAirport};
