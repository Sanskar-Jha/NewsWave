require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded form data
const port = process.env.PORT || 3000;
const apiKey = process.env.NEWS_API_KEY;

// Static path
app.use(express.static(path.join(__dirname, '/public')));

// Set up view engine
app.set('view engine', 'hbs');

// Set up path for views engine
app.set('views', path.join(__dirname, '/public/templates/views'));

// hbs can access the components(reuseable) which is respresent in the partials folder
hbs.registerPartials(path.join(__dirname, '/public/templates/partials'));

// Check if title is not null and undefined both
hbs.registerHelper('isNotRemoved', function (title, options) {
  return title !== '[Removed]' ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('isNotRemoved', function (title, options) {
  return title !== '[Removed]' ? options.fn(this) : options.inverse(this);
});

// Check if image url is not null
hbs.registerHelper('isImageNotNull', function (urlToImage, options) {
  return urlToImage !== 'null' ? options.fn(this) : options.inverse(this);
});

// Slice the title and description both
hbs.registerHelper('sliceTitle', function (title, start, end) {
  return new hbs.SafeString(title.substring(start, end));
});
hbs.registerHelper('sliceContent', function (content, start, end) {
  return new hbs.SafeString(content.substring(start, end));
});


let searchTerm;
app.get('/', async (req, res) => {
  searchTerm = req.query.search;
  let apiUrl;
  if (searchTerm !== undefined) {
    apiUrl = `https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=${apiKey}`;
  }
  else {
    apiUrl = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`;
  }

  try {
    const fetchResponse = await fetch(apiUrl);
    const json = await fetchResponse.json();
    const articles = json.articles;

    res.render('index', { articles: articles })
  }
  catch (err) {
    // console.log(err);
    res.writeHead(500);
    res.render('index', { articles: "Failed to load news. Please try again later." });
    res.end();
  }
});

app.post('/', (req, res) => {
  const { domain0, domain1, from, to, languageSelect, sorting } = req.body;

  // Build the URL with optional parameters based on user selections
  let url = `https://newsapi.org/v2/everything?q=${searchTerm}`;

  function getDomainQuery() {
    const domainArr = [];
    try {
      domainArr.push(domain0);
      domainArr.push(domain1);
    }
    catch (err) {
      console.log("Filter domain error: ", err);
      res.writeHead(500);
      // res.render('index', { articles: "Failed to load news. Please try again later." });
      res.end();
    }
    return domainArr.join(',');
  }

  if (getDomainQuery) {
    url += `&domains=${getDomainQuery()}`;
  }

  if (from && to) {
    url += `&from=${from}&to=${to}`;
  }

  if (languageSelect) {
    url += `&language=${languageSelect}`;
  }

  if (sorting) {
    url += `&sortBy=${sorting}`;
  }

  // Append the API key securely
  url += `&apiKey=${apiKey}`;


  // Fetch news using the constructed URL (and handle errors)
  fetch(url)
    .then(response => response.json())
    .then(data => {
      articles = data.articles;
      res.render('index', { articles: articles });
    })
    .catch(error => {
      res.writeHead(500);
      res.render('index', { articles: "No news. Please check filter setting." });
      res.end();
    });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/docs', (req, res) => {
  res.render('docs');
});

// if user search another pages
app.get("*", (req, res) => {
  res.render("errorPage", {
    errorMsg: "Opps! Page Not Found"
  });
});

// Server listen
app.listen(port);