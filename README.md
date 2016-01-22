# Bacon Game Jam 10: Team Natural 20

## Development setup
1. [Install the latest version of NodeJS](https://nodejs.org/) (5.4.1 as of
   this writing). Test your Node installation by running the following
   terminal commands:  
   `node -v`  
   `npm -v`  
   It should output your installed versions of NodeJS and NPM (the NodeJS
   package manager).
2. From the project directory (the one containing this readme and
   `package.json`), install the project dependencies:  
   `npm install`  
   The dependency files are not included in the repository, so re-run this
   command if the dependencies change. (To remove unused dependencies, use
   `npm prune`.)
3. To run the game in development mode:  
   `npm test`  
   This will restart the server and recompile the game source code whenever
   a `.js` file changes. Recompiling the source can take a few seconds.

## Game deployment
TBD, probably heroku. To run the game in non-development mode:  
`npm start`