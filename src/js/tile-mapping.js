// Nuestro mapeo de mosaicos personalizado con:
// - Índice único para putTileAt
// - Matriz con pesos para weightedRandomize
// - Matriz para putTilesAt

const TILE_MAPPING = {
  BLANK: calculo(16, 14),
  VACIO: calculo(0, 0),
  WALL: {
    TOP_LEFT: calculo(1, 8),
    TOP_RIGHT: calculo(1, 9),
    BOTTOM_RIGHT: calculo(2, 9),
    BOTTOM_LEFT: calculo(2, 8),
    TOP: calculo(1, 3),
    /*TOP: [{ index: 39, weight: 4 }, { index: [57, 58, 59], weight: 1 }],
    SECOND_TOP: [{ index: calculo(2,3), weight: 10 }],
    LEFT: [{ index: calculo(2,10), weight: 10 }],
    RIGHT: [{ index: calculo(2,10), weight: 10 }],
    BOTTOM: [{ index: calculo(1,3), weight: 10 }]*/
    SECOND_TOP: calculo(2, 3),
    LEFT: calculo(2, 10),
    RIGHT: calculo(2, 10),
    BOTTOM: calculo(1, 3)
  },
  FLOOR: calculo(15, 9),
  //FLOOR: [{ index: calculo(15,9), weight: 5 }],
  //RANDOM_OBJECT: [{ index: 233, weight: 1 }, { index: 278, weight: 1 }, { index: 279, weight: 1 }],
  DOOR: {
    TOP: [[calculo(2, 9), calculo(15, 9), calculo(2, 8)],
    [calculo(2, 2), calculo(15, 9), calculo(2, 1)]],
    // prettier-ignore
    LEFT: [
      [calculo(2, 9)],
      [calculo(2, 2)],
      [calculo(15, 9)],
      [calculo(1, 9)]
    ],
    BOTTOM: [calculo(1, 9), calculo(15, 9), calculo(1, 8)],
    RIGHT: [
      [calculo(2, 8)],
      [calculo(2, 1)],
      [calculo(15, 9)],
      [calculo(1, 8)]
    ],
    SALIDA_TOP: [
      [calculo(16, 10)],
      [calculo(17, 10)]
    ],
    SALIDA_BOTTOM: [
      [calculo(16, 10)],
      [calculo(17, 10)]
    ],
    SALIDA_LEFT: [
      [calculo(16, 6), calculo(16, 7)]
    ],
    SALIDA_RIGHT: [
      [calculo(16, 8), calculo(16, 9)]
    ]
  },

  //Objetos varios, telefono, maceta etc... 
  //arriba
  FRIGO1: [
    [calculo(3, 0)],
    [calculo(4, 0)]
  ],
  //Arriba
  COCINA_FUEGOS: [
    [calculo(3, 1)],
    [calculo(4, 1)]
  ],
  //Centro
  MESA_COCINA: [
    [calculo(3, 2), calculo(3, 3)],
    [calculo(4, 2), calculo(4, 3)]
  ],
  //Arriba
  FREGADEROS: [
    [calculo(3, 4), calculo(3, 5)],
    [calculo(4, 4), calculo(4, 5)]
  ],
  //Arriba
  RADIO: [
    [calculo(3, 6)],
    [calculo(4, 6)]
  ],
  //Arriba
  ESTANTE_LLENO: [
    [calculo(3, 7), calculo(3, 8)],
    [calculo(4, 7), calculo(4, 8)]
  ],
  //Arriba
  ESTANTE_VACIO: [
    [calculo(3, 9), calculo(3, 10)],
    [calculo(4, 9), calculo(4, 10)]
  ],
  //Arriba
  TELE: [
    [calculo(3, 11)],
    [calculo(4, 11)]
  ],
  //Derecha
  ESTUDIO: [
    [calculo(3, 12)],
    [calculo(4, 12)]
  ],
  //Arriba
  CAMA: [
    [calculo(3, 13), calculo(3, 14)],
    [calculo(4, 13), calculo(4, 14)],
    [calculo(5, 13), calculo(5, 14)]
  ],
  //Arriba
  FRIGO2: [
    [calculo(5, 0)],
    [calculo(6, 0)]
  ],
  //Arriba
  FRIGO_GRANDE: [
    [calculo(5, 1), calculo(5, 2)],
    [calculo(6, 1), calculo(6, 2)]
  ],
  //arriba o centro
  PLANTA: [
    [calculo(5, 7)],
    [calculo(6, 7)]
  ],
  //Arriba
  TELEFONO: [[calculo(6, 8)]],
  ALFOMBRA_EEUU: [
    [calculo(5, 10), calculo(5, 11), calculo(5, 12)],
    [calculo(6, 10), calculo(6, 11), calculo(6, 12)]
  ],
  //Abajo
  SOFA: [
    [calculo(6, 13), calculo(6, 14)]
  ],
  //Arriba
  RADIO: [
    [calculo(7, 0), calculo(7, 1)],
    [calculo(8, 0), calculo(8, 1)]
  ],
  //Arriba
  PIZZARA: [
    [calculo(7, 2), calculo(7, 3)]
  ],
  //Arriba
  LABORATORIO: [
    [calculo(7, 6), calculo(7, 7), calculo(7, 8)],
    [calculo(8, 6), calculo(8, 7), calculo(8, 8)]
  ],
  //Arriba
  WC: [
    [calculo(9, 0)],
    [calculo(10, 0)]
  ],
  //Arriba
  LABAVO: [
    [calculo(9, 1)],
    [calculo(10, 1)]
  ],
  //Arriba
  DUCHA: [
    [calculo(9, 2)],
    [calculo(10, 2)]
  ],
  //SUELO_DUCHA: [[2]],
  //Centro
  TRONO: [
    [calculo(9, 11), calculo(9, 12)],
    [calculo(10, 11), calculo(10, 12)]
  ],
  //Centro
  COFRE: [[calculo(9, 13)]],
  //Arriba
  BANDERA_PAREZ: [[calculo(11, 1)]],
  //Arriba
  BAR: [
    [calculo(12, 0), calculo(12, 1)],
    [calculo(13, 0), calculo(13, 1)]
  ],
  //Centro
  MESA_LLENA: [
    [calculo(13, 8), calculo(13, 9)],
    [calculo(14, 8), calculo(14, 9)]
  ],
  //Centro
  SILLA_R: [[calculo(13, 10)]],
  SILLA_L: [[calculo(14, 10)]],
  //Arriba
  BANDERA: [[calculo(16, 5)]]
};

export default TILE_MAPPING;

function calculo(fila, columna) {
  var resultado = (fila * 15) + columna;
  return resultado;
};