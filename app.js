require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Static path
app.use(express.static(path.join(__dirname, '/public')));

// Set up view engine
app.set('view engine', 'hbs');

// Set up path for views engine
app.set('views', path.join(__dirname, '/public/templates/views'));

// hbs can access the components(reuseable) which is respresent in the partials folder
hbs.registerPartials(path.join(__dirname, '/public/templates/partials'));

app.get('/', (req, res) => {
  res.render('index', { apiKey: process.env.NEWS_API_KEY });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/docs', (req, res) => {
  res.render('docs');
});

// if user search your other pages
app.get("*", (req, res) =>{
    res.render("errorPage", {
        errorMsg: "Opps! Page Not Found"
    });
});

// Server listen
app.listen(port, () =>{
    console.log('listening on port: ' + port);
});