"use strict";
// Load dependencies
var express = require('express');
var browserify = require('browserify');
var uglify = require('uglify-js');
var glob = require('glob');

// Load environment config
let env = process.env;
let PORT = env.PORT || 3000;
let DEV = env.NODE_ENV !== 'production';

// Configure Express server
let app = express();
app.set('view engine', 'ejs');

// Game config
let SOUND_DIR = 'assets/audio';
let SOUND_ROUTE = '/sounds';

// Preload list for music and sounds
let sounds = null;
function removeFileExtension(str) {
  return str.replace(/\.[^/.]+$/, "");
}

function loadAudioAssets() {
  console.info('Generating sound preload list.');
  sounds = {};
  glob.sync(SOUND_DIR + '/**/*.@(wav|ogg|mp3)').forEach((snd) => {
    let path = snd.slice(SOUND_DIR.length + 1, snd.length);
    let key = removeFileExtension(path);
    let url = SOUND_ROUTE + '/' + path;
    if (!(key in sounds)) {
      sounds[key] = {urls: []};
    }
    sounds[key].urls.push(url);
  });
  console.info('Sound preload list generated.');
};
loadAudioAssets();

console.info("Compiling game source...");
let b = browserify('source/main.js', {
  debug: DEV,
});
b.transform("babelify", {presets: ["es2015"]})
b.bundle((err, buf) => {
  if (err) {
    console.error(err.toString());
    console.error("Syntax error detected! Exiting.");
    process.exit(1);
  }
  let script = buf.toString('utf8');
  if (!DEV) {
    script = uglify.minify(script, {fromString: true}).code;
  }
  console.info("...Done!");

  // Serve concatenated js
  app.get('/game.js', (req, res) => {
    res.header("Content-Type", "application/javascript");
    res.send(script);
  });

  // Serve static files
  app.use('/static', express.static('static'));

  app.use('/sounds.json', (req, res) => {
    res.json(sounds);
  });

  app.use(SOUND_ROUTE, express.static('assets/audio'));

  // Serve home page with game
  app.get('/', (req, res) => {
    res.render('game');
  });

  // Start server
  app.listen(PORT, () => {
    console.log("App listening on port %s", PORT);
  });

});
