# Bacon Game Jam 10: Team Natural 20

## Development setup
1. [Install the latest version of NodeJS](https://nodejs.org/) (5.5.0 as of
   this writing). Test your Node installation by running the following
   terminal commands:  
   `node -v`  
   `npm -v`  
   It should output your installed versions of NodeJS and NPM (the NodeJS
   package manager).
2. Clone this repository and `cd` into it.
3. From the project directory, install all dependencies with this command:  
   `npm install`  
   The dependency files are not included in the repository, so re-run this
   command if the dependencies change. (To remove unused dependencies, use
   `npm prune`.)
4. To run the game in development mode:  
   `npm test`  
   This will restart the server and recompile the game source code whenever
   a `.js` file changes. Recompiling the source can take a few seconds.
5. Navigate to [http://localhost:3000](http://localhost:3000) to test the
   game.

## Game deployment
TBD, probably heroku. To run the game in non-development mode:  
`npm start`
