const childProcess = require('child_process');
const request = require('request');
const cheerio = require('cheerio');

const COMMANDS = {
  OPEN: 'open',
  START: 'start',
  XDG: 'xdg-open',
};

const ERRORS = {
  TRY_AGAIN: 'Sorry, please try again.',
};

const PLATFORMS = {
  DARWIN: 'darwin',
  WIN32: 'win32',
};

const SELECTORS = {
  CATEGORY_MENU: '.seccion-submenu-navegacion ul li a',
  MEGA_MENU: 'nav ul li a',
};

const BASE_URL = 'https://elpais.com';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getHeaderLink = body => {
  const $ = cheerio.load(body);

  const headers = $(SELECTORS.MEGA_MENU);

  const headerLinks = headers.map((idex, header) => $(header).attr('href'));

  const randomHeader = `https:${
    headerLinks[getRandomInt(0, headerLinks.length)]
  }`;

  return randomHeader;
};

const getCategoryHeaderLink = body => {
  const $ = cheerio.load(body);

  const headers = $(SELECTORS.CATEGORY_MENU);

  const headerLinks = headers.map((idex, header) => $(header).attr('href'));

  const randomHeader = `https:${
    headerLinks[getRandomInt(0, headerLinks.length)]
  }`;

  return randomHeader;
};

module.exports = () => {
  request(BASE_URL, (err, res, body) => {
    let baseHeaderLink;
    let categoryHeaderLink;
    if (err) {
      throw new Error(ERRORS.TRY_AGAIN);
    }
    baseHeaderLink = getHeaderLink(body);
    request(baseHeaderLink, (err, res, body) => {
      categoryHeaderLink = getCategoryHeaderLink(body);
      if (!categoryHeaderLink) {
        console.log(ERRORS.TRY_AGAIN);
        return;
      }
      const start =
        process.platform == PLATFORMS.DARWIN
          ? COMMANDS.OPEN
          : process.platform == PLATFORMS.WIN32
          ? COMMANDS.START
          : PLATFORMS.XDG;
      childProcess.exec(`${start} ${categoryHeaderLink}`);
    });
  });
};
