// Load dependencies
var express = require('express');
var browserify = require('browserify');
var uglify = require('uglify-js');
var glob = require('glob');

// Load environment config
var env = process.env;
var PORT = env.PORT || 3000;
var DEV = env.NODE_ENV !== 'production';

// Configure Express server
var app = express();
app.set('view engine', 'ejs');

// Game config
var SOUND_DIR = 'assets/audio';
var SOUND_ROUTE = '/sounds';

// Preload list for music and sounds
var sounds = null;
function removeFileExtension(str) {
  return str.replace(/\.[^/.]+$/, "");
}
// TODO support multiple file endings for codec support in Howler
function loadAudioAssets() {
  console.info('Generating sound preload list...');
  sounds = {};
  glob.sync(SOUND_DIR + '/**/*.@(wav|ogg|mp3)').forEach((snd) => {
    var path = snd.slice(SOUND_DIR.length + 1, snd.length);
    var key = removeFileExtension(path);
    var url = SOUND_ROUTE + '/' + path;
    if (!(key in sounds)) {
      sounds[key] = {urls: []};
    }
    sounds[key].urls.push(url);
  });
  console.info('Done!');
};
loadAudioAssets();

console.info("Compiling game source...");
var b = browserify('source/main.js', {
  debug: DEV,
});
b.transform("babelify", {presets: ["es2015"]})
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
