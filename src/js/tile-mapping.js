// Nuestro mapeo de mosaicos personalizado con:
// - Índice único para putTileAt
// - Matriz con pesos para weightedRandomize
// - Matriz para putTilesAt
const TILE_MAPPING = {
  BLANK: 735,
  WALL: {
    TOP_LEFT: 53,
    TOP_RIGHT: 54,
    BOTTOM_RIGHT: 99,
    BOTTOM_LEFT: 98,
    TOP: [{ index: 55, weight: 10 }]/*[{ index: 39, weight: 4 }, { index: [57, 58, 59], weight: 1 }]*/,
    SECOND_TOP: [{ index: 93, weight: 10 }],
    LEFT: [{ index: 100, weight: 10 }],
    RIGHT: [{ index: 100, weight: 10 }],
    BOTTOM: [{ index: 55, weight: 10 }]
  },
  FLOOR: [{ index: 64, weight: 10 }],
  RANDOM_OBJECT: [{ index: 233, weight: 1 }, { index: 278, weight: 1 }, { index: 279, weight: 1 }],
  DOOR: {
    TOP: [[47, 64, 46], [92, 64, 91]],
    // prettier-ignore
    LEFT: [
      [45],
      [90],
      [64],
      [52]
    ],
    BOTTOM: [47, 64, 46],
    // prettier-ignore
    RIGHT: [
      [45],
      [90],
      [64],
      [52]
    ]
  },
  //Objetos varios, telefono, maceta etc...
  CHEST: 166,
  STAIRS: 234,
  // prettier-ignore
  TOWER: [
    [232],
    [277]
  ]
};

export default TILE_MAPPING;
