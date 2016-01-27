// '@' Player
// '!' Exit
// ' ' Empty
// '#' Enemy
// Anything else will look up "objects" and then
//   default to a wall
module.exports = {
  name: "Glide Carefully",
  data: [
    '                     a                             00000000000000000000000000000000000000000000                        0',
    '             00    000                             0                                          0                        0',
    '                     0                             0                                          0                        0',
    '                0    0                                                                        0            0           0',
    '  @                 00         0           0    0                           0   0   00                    0   0        0',
    '0   0 0 #  0      0000          0      000 0   #0      0          0     0                                     0     !  0',
    '00000 000000 0 0 00000           00000 000 000000   0000      000 0     0                     0  000 0000000000  0000000'
  ],
  objects: {
    a: "Console|Holding the jump key as you fall lets you float gently from your towel...",
  },
}