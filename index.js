// Load dependencies
var express = require('express');
var browserify = require('browserify');

// Load environment config
var env = process.env;
var PORT = env.PORT || 3000;
var DEV = env.NODE_ENV !== 'production';

// Configure Express server
var app = express();
app.set('view engine', 'ejs');

console.info("Compiling game source...");
browserify('source/main.js').bundle((err, buf) => {
  var script = buf.toString('utf8');
  console.info("Done!");

  // Serve concatenated js
  app.get('/game.js', (req, res) => {
    res.send(script);
  });

  // Serve home page with game
  app.get('/', (req, res) => {
    res.render('game');
  });

  // Start server
  app.listen(PORT, () => {
    console.log("App listening on port %s", PORT);
  });

});
