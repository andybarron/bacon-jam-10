// '@' Player
// '!' Exit
// ' ' Empty
// '#' Enemy
// Anything else will look up "objects" and then
//   default to a wall
module.exports = {
  name: "The Mighty Towel",
  data: [
    '0  #                                        0',
    '0     0                                     0',
    '0000000                                     0',
    '0                                           0',
    '0                         0                 0',
    '0 @  a   b   0  #      c 00           d   ! 0',
    '000000000000000000000000000  00  000000000000',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
    '                          0  00  0           ',
  ],
  objects: {
    a: "Console|Defective cleaning robots may mistake you for a deadly microbe and attack.",
    b: "Console|Press the [Z] key to whip rogue cleaning bots with your trusty towel!",
    c: "Console|Be careful around patented OSHA-compliant Endless Pits(TM).",
    d: "Console|If you fail to use caution, a clone will be dispatched to try again.",
  },
  next: 'tutorial3',
}