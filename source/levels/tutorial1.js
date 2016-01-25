// '@' Player
// '!' Exit
// ' ' Empty
// '#' Enemy
// Anything else will look up "objects" and then
//   default to a wall
var next = require('./tutorial2');
module.exports = {
  data: [
    '00000000000000000000000000000000',
    '0                              0',
    '0                              0',
    '0                              0',
    '0  @                           0',
    '0  a       b      0     c    ! 0',
    '00000000000000000000000000000000'
  ],
  objects: {
    a: "Console|Use the left and right arrows to move.",
    b: "Console|Use the up arrow to jump!",
    c: "Console|Reach the \"Wet Floor\" sign to clean the spill and complete the level.",
  },
  next: next,
}