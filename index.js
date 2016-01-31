// Load dependencies
var express = require('express');
var browserify = require('browserify');
var uglify = require('uglify-js');

// Load environment config
var env = process.env;
var PORT = env.PORT || 3000;
var DEV = env.NODE_ENV !== 'production';

// Configure Express server
var app = express();
app.set('view engine', 'ejs');

console.info("Compiling game source...");
var b = browserify('source/main.js', {
  debug: DEV,
});
b.bundle((err, buf) => {
  if (err) {
    console.error(err.toString());
    console.error("Syntax error detected! Exiting.");
    process.exit(1);
  }
  var script = buf.toString('utf8');
  if (!DEV) {
    script = uglify.minify(script, {fromString: true}).code;
  }
  console.info("Done!");

  // Serve concatenated js
  app.get('/game.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.send(script);
  });

  // Serve static files
  app.use('/static', express.static('static'));

  // Serve home page with game
  app.get('/', (req, res) => {
    res.render('game');
  });

  // Start server
  app.listen(PORT, () => {
    console.log("App listening on port %s", PORT);
  });

});
