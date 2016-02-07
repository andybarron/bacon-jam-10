"use strict";
// Load dependencies
let express = require('express');
let browserify = require('browserify');
let uglify = require('uglify-js');
let glob = require('glob');
let fs = require('fs');

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
let LEVELS_FILE = 'assets/level-list.json'
let LEVEL_DIR = 'assets/maps';

// Preload list for music and sounds
function removeFileExtension(str) {
  return str.replace(/\.[^/.]+$/, "");
}

function loadAudioAssets() {
  console.info('Generating sound preload list.');
  let sounds = {};
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
  return sounds;
};
let sounds = loadAudioAssets();

// Combined list of levels
function loadLevelList() {
  console.info('Generating list of levels.');
  let nameList = JSON.parse(fs.readFileSync(LEVELS_FILE).toString('utf-8'));
  let levelList = [];
  for (let levelId of nameList) {
    let levelPath = LEVEL_DIR + '/' + levelId + '.json';
    let levelData = JSON.parse(fs.readFileSync(levelPath).toString('utf-8'));
    for (let tileset of levelData.tilesets) {
      for (let tileId in tileset.tiles) {
        let name = tileset.tiles[tileId].image;
        name = removeFileExtension(name).replace(/^\.\.\/graphics\//, '');
        tileset.tiles[tileId].image = name;
      }
    }
    levelList.push(levelData);
  }
  console.info('Level list generated.');
  return levelList;
}
let levelList = loadLevelList();

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

  app.use('/levels.json', (req, res) => {
    res.json(levelList);
  });

  app.use(SOUND_ROUTE, express.static('assets/audio'));

  // Serve home page with game
  app.get('/', (req, res) => {
    res.render('game');
  });

  // Start server
  app.listen(PORT, () => {
    console.info("Server listening on port: %s", PORT);
    if (DEV) {
      console.info("To playtest locally, point your browser to: http://localhost:3000")
    }
  });

});
