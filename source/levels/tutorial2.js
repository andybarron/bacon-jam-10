// '@' Player
// '!' Exit
// ' ' Empty
// '#' Enemy
// Anything else will look up "objects" and then
//   default to a wall
module.exports = {
  data: [
    '0                                     0',
    '0                                     0',
    '0                                     0',
    '0  @                                  0',
    '0  a    0  #      b             c   ! 0',
    '0000000000000000000000  0  000000000000'
  ],
  objects: {
    a: "Console|Press [Shift] to whip enemies with your trusty towel.",
    b: "Console|Try not to fall into an OSHA-compliant Endless Pit(TM)...",
    c: "Console|...But if you do, a clone will be dispatched to finish your job.",
  },
}