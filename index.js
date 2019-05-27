const childProcess = require('child_process');
const requestPromise = require('request-promise');
const cheerio = require('cheerio');

const BASE_URL = 'https://elpais.com';

const REQUEST_OPTIONS = {
  url: BASE_URL,
  transform: body => cheerio.load(body),
};

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
  MEGA_MENU: '.seccion-submenu-navegacion ul li a',
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const getLinks = (cheerioScope, cheerioObject) =>
  cheerioObject.map((idex, header) => cheerioScope(header).attr('href'));

const getRandomArticle = async () => {
  const elPaisHomePage = await requestPromise(REQUEST_OPTIONS);
  const homePageHeaders = getLinks(
    elPaisHomePage,
    elPaisHomePage(SELECTORS.MEGA_MENU),
  );
  const randomHomePageHeader = `http:${
    homePageHeaders[getRandomInt(0, homePageHeaders.length - 1)]
  }`;
  if (!randomHomePageHeader) throw new Error(ERRORS.TRY_AGAIN);
  const elPaisCategoryHomePage = await requestPromise(
    Object.assign({}, REQUEST_OPTIONS, {
      url: randomHomePageHeader,
    }),
  );
  const categoryHomePageHeaders = getLinks(
    elPaisCategoryHomePage,
    elPaisCategoryHomePage(SELECTORS.CATEGORY_MENU),
  );
  const randomCategoryHomePageHeader = `http:${
    categoryHomePageHeaders[getRandomInt(0, categoryHomePageHeaders.length - 1)]
  }`;
  if (!randomCategoryHomePageHeader) throw new Error(ERRORS.TRY_AGAIN);

  const startCommand =
    process.platform == PLATFORMS.DARWIN
      ? COMMANDS.OPEN
      : process.platform == PLATFORMS.WIN32
      ? COMMANDS.START
      : PLATFORMS.XDG;

  childProcess.exec(`${startCommand} ${randomCategoryHomePageHeader}`);
};

module.exports = getRandomArticle;
