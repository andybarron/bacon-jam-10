// '@' Player
// '!' Exit
// ' ' Empty
// '#' Enemy
// Anything else will look up "objects" and then
//   default to a wall
module.exports = {
  name: "Glide Carefully",
  data: [
    '0                   a                                 00000000000000000000000000000000000000000000                        0',
    '0                  00                                 0                                          0                        0',
    '0                  0                                  0                                          0                        0',
    '0             00     0        0000               b                                               0            0           0',
    '0 @                  00        00          0    000                            0   0   00                    0   0        0',
    '0   0 0    0         000       00      000 0   #0         0       c  0     0                                     0     !  0',
    '00000 00000000000000000000000000000000 000 000000      0000      000 0     0                     0  000 0000000000  0000000'
  ],
  objects: {
    a: "Console|Tap the jump key in mid-air to float gently from your towel...",
    b: "Console|You can float from your towel to make seemingly impossible jumps!",
    c: "Console|Tapping the jump key again while floating lets you drop immediately.",
  },
  next: 'tutorial4',
}