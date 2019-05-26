const request = require('request');
const cheerio = require('cheerio');

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

const SELECTORS = {
  MEGA_MENU: '.seccion-submenu-navegacion-listado li a',
};

const BASE_URL = 'https://elpais.com';

const getHeaderLink = body => {
  const $ = cheerio.load(body);

  const headers = $(SELECTORS.MEGA_MENU);

  const headerLinks = headers.map((idex, header) => $(header).attr('href'));

  const randomHeader = `https:${
    headerLinks[getRandomInt(0, headerLinks.length - 1)]
  }`;

  return randomHeader;
};

request(BASE_URL, (err, res, body) => {
  let headerLink;
  if (err) {
    throw new Error('Sorry, please try again.');
  }
  headerLink = getHeaderLink(body);

  headerLink = headerLink.includes(BASE_URL)
    ? headerLink
    : `${BASE_URL}/${headerLink}`;

  request(headerLink, async (err, res, body) => {
    headerLink = getHeaderLink(body);
    if(!headerLink) {
      console.log('Sorry please try again');
      return;
    }
    const start =
      process.platform == 'darwin'
        ? 'open'
        : process.platform == 'win32'
        ? 'start'
        : 'xdg-open';
    require('child_process').exec(start + ' ' + headerLink);
  });
});


