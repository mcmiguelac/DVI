import TILES from "./tile-mapping.js";
import TilemapVisibility from "./tilemap-visibility.js";

export default class RoomFactory {
    createNew(game, tileMap) {
        const tileset = tileMap.addTilesetImage("tiles", null, 64, 64, 0, 0);

        //Suelo
        game.floorLayer = tileMap.createBlankDynamicLayer("Floor", tileset);
        //Paredes
        game.groundLayer = tileMap.createBlankDynamicLayer("Ground", tileset);
        //Decoracion
        game.stuffLayer = tileMap.createBlankDynamicLayer("Stuff", tileset);
        //Decoracion artrabesable
        game.stuffLayerAtravesable = tileMap.createBlankDynamicLayer("StuffAtravesable", tileset);
        //game.enemyLayer = tileMap.createBlankDynamicLayer("Enemy", tileset);
        //Capa de ocultacion
        game.shadowLayer = tileMap.createBlankDynamicLayer("Shadow", tileset).fill(TILES.BLANK).setDepth(5);

        game.tilemapVisibility = new TilemapVisibility(game.shadowLayer);

        game.dungeon.rooms.forEach(room => {
            //const { x, y, width, height } = room;
            const { x, y, width, height, left, right, top, bottom } = room;
            game.floorLayer.fill(TILES.FLOOR, left, top, width, height);
        });

        // Usa la matriz de habitaciones generadas para colocar mosaicos en el mapa
        // Nota: usar una función de flecha aquí para que "game" todavía se refiera a nuestra escena
        game.dungeon.rooms.forEach(room => {
            const { x, y, width, height, left, right, top, bottom } = room;

            // Tiles de esquinas
            game.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
            game.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
            game.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
            game.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

            // Paredes
            game.groundLayer.fill(TILES.WALL.TOP, left + 1, top, width - 2, 1);
            game.groundLayer.fill(TILES.WALL.SECOND_TOP, left + 1, top + 1, width - 2, 1);
            game.groundLayer.fill(TILES.WALL.BOTTOM, left + 1, bottom, width - 2, 1);
            game.groundLayer.fill(TILES.WALL.LEFT, left, top + 1, 1, height - 2);
            game.groundLayer.fill(TILES.WALL.RIGHT, right, top + 1, 1, height - 2);

            // Las mazmorras tienen habitaciones conectadas con puertas. Cada puerta tiene una x, y relativa a la
            // ubicación de la habitación. Cada dirección tiene una puerta diferente para el mapeo de mosaicos.
            var doors = room.getDoorLocations();// Return una matriz de {x, y} objetos
            for (var i = 0; i < doors.length; i++) {
                if (doors[i].y === 0) {
                    game.groundLayer.putTilesAt(TILES.DOOR.TOP, x + doors[i].x - 1, y + doors[i].y);
                } else if (doors[i].y === room.height - 1) {
                    game.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + doors[i].x - 1, y + doors[i].y);
                } else if (doors[i].x === 0) {
                    game.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + doors[i].x, y + doors[i].y - 2);
                } else if (doors[i].x === room.width - 1) {
                    game.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + doors[i].x, y + doors[i].y - 2);
                }
            }
        });

        // Separa las habitaciones en:
        // - La sala de inicio (índice = 0)
        // - Una habitación que se designará como la habitación final, que se calcula coj un algoritmo.
        // - Una matriz del 90% de las habitaciones restantes, para colocar cosas al azar (dejando un 10% vacío)
        var rooms = game.dungeon.rooms.slice();
        game.startRoom = rooms.shift();
        rooms = Phaser.Utils.Array.Shuffle(rooms);

        //Encontrar la mejor habitacion salida
        var roomStudy = null;
        var puntuacion = 0;
        rooms.forEach(room => {
            var puntTemp = 0;
            // Las mazmorras tienen habitaciones conectadas con puertas. Cada puerta tiene una x, y relativa a la
            // ubicación de la habitación. Cada dirección tiene una puerta diferente para el mapeo de mosaicos.
            var doors = room.getDoorLocations();// Return una matriz de {x, y} objetos
            switch (doors.length) {
                case 0:
                    puntTemp = puntTemp - 1;
                    break;
                case 1:
                    puntTemp = puntTemp + 7;
                    break;
            }

            for (var i = 0; i < doors.length; i++) {
                if (doors[i].y === 0) {
                    puntTemp = puntTemp + 2;
                } else if (doors[i].y === room.height - 1) {
                    puntTemp = puntTemp + 2;
                } else if (doors[i].x === 0) {
                    puntTemp = puntTemp + 1;
                } else if (doors[i].x === room.width - 1) {
                    puntTemp = puntTemp + 1;
                }
            }

            for (var i = 0; i < doors.length; i++) {
                if (doors[i].y === 0) {
                    puntTemp = puntTemp + 2;
                } else if (doors[i].y === room.height - 1) {
                    puntTemp = puntTemp + 2;
                }
            }

            if (puntTemp > puntuacion) {
                puntuacion = puntTemp;
                roomStudy = room;
            }
        });
        game.endRoom = roomStudy;
        Phaser.Utils.Array.Remove(rooms, game.endRoom);

        rooms.sort(this.compareRooms);

        game.otherRoomsEmpty = rooms.slice(0, rooms.length * 0.25);
        game.otherRoomsFull = rooms.slice(rooms.length * 0.25, rooms.length);

        this.endRoomNew(game, game.endRoom);
        this.otherRoomsFullNew(game, game.otherRoomsFull);
        this.otherRoomsEmptyNew(game, game.otherRoomsEmpty);

        //Crea un rango desde 15, de longitud 30, los tiles que corresponden con paredes.
        var tilesBound = Array.apply(null, { length: 30 }).map(function (value, index) {
            return index + 15;
        });

        game.groundLayer.setCollision(tilesBound);
        //Excluimos todas la que corresponden con alfombras o puertas
        game.stuffLayer.setCollisionByExclusion([-1]);
    }
    endRoomNew(game, endRoom) {
        game.stuffLayer.putTilesAt(TILES.TRONO, endRoom.centerX - 1, endRoom.centerY);
        game.stuffLayer.putTileAt(TILES.COFRE, endRoom.left + 1, endRoom.top + 2);
        endRoom.getDoorLocations().forEach(door => {
            if (door.y === 0) {
                game.stuffLayerAtravesable.putTilesAt(TILES.DOOR.SALIDA_TOP, endRoom.x + door.x, endRoom.y + door.y - 1);
            } else if (door.y === endRoom.height - 1) {
                game.stuffLayerAtravesable.putTilesAt(TILES.DOOR.SALIDA_BOTTOM, endRoom.x + door.x, endRoom.y + door.y);
            } else if (door.x === 0) {
                game.stuffLayerAtravesable.putTilesAt(TILES.DOOR.SALIDA_LEFT, endRoom.x + door.x - 1, endRoom.y + door.y);
            } else if (door.x === endRoom.width - 1) {
                game.stuffLayerAtravesable.putTilesAt(TILES.DOOR.SALIDA_RIGHT, endRoom.x + door.x, endRoom.y + door.y);
            }
        });
    }
    otherRoomsFullNew(game, otherRoomsFull) {
        //Cosas en las demas habitaciones
        otherRoomsFull.forEach(room => {
            var rand = Math.round(Math.random() * 100) % 8;
            switch (rand) {
                case 0:
                    this.cocina(game, room);
                    break;
                case 1:
                    this.biblioteca(game, room);
                    break;
                case 2:
                    this.salon(game, room);
                    break;
                case 3:
                    this.estudio(game, room);
                    break;
                case 4:
                    this.habitacion(game, room);
                    break;
                case 5:
                    this.comedor(game, room);
                    break;
                case 6:
                    this.laboratorio(game, room);
                    break;
                case 7:
                    this.toilete(game, room);
                    break;
                default:
                    break;
            }
        });
    }
    otherRoomsEmptyNew(game, otherRoomsEmpty) {
        otherRoomsEmpty.forEach(room => {
            game.stuffLayerAtravesable.putTilesAt(TILES.ALFOMBRA_EEUU, room.centerX - 1, room.centerY);
        });
    }

    //Decoracion de la cocina
    cocina(game, room) {
        this.inicializarArray(room);
        const listaObjetosConTransparencia = [TILES.COCINA_FUEGOS, TILES.FREGADEROS, TILES.BANDERA_PAREZ, TILES.MESA_COCINA, TILES.BANDERA];
        this.colocarObjetosArriba(game, room, listaObjetosConTransparencia);
        const listaObjetos = [TILES.FRIGO1, TILES.FRIGO_GRANDE, TILES.SILLA_R];
        this.colocarObjetosMedio(game, room, listaObjetos);
    }

    biblioteca(game, room) {
        this.inicializarArray(room);
        const listaObjetos = [TILES.RADIO, TILES.BANDERA_PAREZ, TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.BANDERA_PAREZ, TILES.ESTANTE_LLENO, TILES.ESTANTE_VACIO, TILES.RADIO, TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.ESTANTE_VACIO];
        this.colocarObjetosArriba(game, room, listaObjetos);
        const listaObjetos2 = [TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.ESTANTE_VACIO, TILES.RADIO, TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.ESTANTE_VACIO];
        this.colocarObjetosMedio(game, room, listaObjetos2);
    }

    salon(game, room) {
        this.inicializarArray(room);
        const listaObjetos = [TILES.TELE, TILES.ESTANTE_VACIO, TILES.BANDERA, TILES.TELEFONO, TILES.PLANTA];
        this.colocarObjetosArriba(game, room, listaObjetos);
        this.colocarSofa(game, room);
        const listaObjetos3 = [TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO];
        this.colocarObjetosMedio(game, room, listaObjetos3);
    }

    estudio(game, room) {
        this.inicializarArray(room);
        const listaObjetos = [TILES.TELEFONO, TILES.BANDERA_PAREZ, TILES.ESTANTE_VACIO, TILES.BANDERA, TILES.RADIO, TILES.TELE, TILES.PLANTA];
        this.colocarObjetosArriba(game, room, listaObjetos);
        const listaObjetos1 = [TILES.ESTUDIO];
        this.colocarObjetosDerecha(game, room, listaObjetos1);
        this.colocarSofa(game, room);
        const listaObjetos3 = [TILES.SILLA_L, TILES.ESTANTE_LLENO, TILES.ESTANTE_VACIO, TILES.RADIO];
        this.colocarObjetosMedio(game, room, listaObjetos3);
    }

    habitacion(game, room) {
        this.inicializarArray(room);
        const listaObjetos = [TILES.TELEFONO, TILES.CAMA, TILES.TELE, TILES.BANDERA, TILES.PLANTA, TILES.BANDERA_PAREZ];
        this.colocarObjetosArriba(game, room, listaObjetos);
        this.colocarSofa(game, room);
        const listaObjetos3 = [TILES.ESTANTE_LLENO, TILES.ESTANTE_VACIO, TILES.SILLA_R, TILES.RADIO, TILES.SILLA_L];
        this.colocarObjetosMedio(game, room, listaObjetos3);
        const listaObjetos1 = [TILES.ESTUDIO];
        this.colocarObjetosDerecha(game, room, listaObjetos1);
    }

    comedor(game, room) {
        this.inicializarArray(room);
        const listaObjetos3 = [TILES.BAR, TILES.SILLA_L, TILES.MESA_LLENA, TILES.SILLA_R, TILES.FRIGO2, TILES.FRIGO_GRANDE];
        this.colocarObjetosMedio(game, room, listaObjetos3);
        const listaObjetos = [TILES.PLANTA, TILES.BANDERA, TILES.PLANTA, TILES.BANDERA_PAREZ, TILES.PLANTA, TILES.BANDERA_PAREZ, TILES.PLANTA, TILES.PLANTA, TILES.PLANTA];
        this.colocarObjetosArriba(game, room, listaObjetos);
        this.colocarSofa(game, room);
    }

    laboratorio(game, room) {
        this.inicializarArray(room);
        const listaObjetos = [TILES.LABORATORIO];
        this.colocarObjetosMedio(game, room, listaObjetos);
        const listaObjetos1 = [TILES.PIZZARA, TILES.BANDERA, TILES.TELEFONO, TILES.LABORATORIO, TILES.PLANTA];
        this.colocarObjetosArriba(game, room, listaObjetos1);
        const listaObjetos2 = [TILES.RADIO];
        this.colocarObjetosMedio(game, room, listaObjetos2);
        const listaObjetos3 = [TILES.BANDERA_PAREZ, TILES.TELEFONO];
        this.colocarObjetosArriba(game, room, listaObjetos3);
        const listaObjetos4 = [TILES.LABORATORIO, TILES.LABORATORIO, TILES.LABORATORIO];
        this.colocarObjetosMedio(game, room, listaObjetos4);
        const listaObjetos5 = [TILES.TELEFONO, TILES.RADIO, TILES.LABORATORIO];
        this.colocarObjetosArriba(game, room, listaObjetos5);
    }

    toilete(game, room) {
        this.inicializarArray(room);
        const listaObjetos = [TILES.WC, TILES.LABAVO, TILES.DUCHA, TILES.BANDERA, TILES.PLANTA, TILES.BANDERA_PAREZ];
        this.colocarObjetosArriba(game, room, listaObjetos);
        const listaObjetos2 = [TILES.SILLA_L];
        this.colocarObjetosMedio(game, room, listaObjetos2);
    }

    compareRooms(a, b) {
        const area_A = a.height * (a.width * 2);
        const area_B = b.height * (b.width * 2);
        return area_A - area_B;
    }

    //Array ocupados 0=libre 1=pared 2=puerta 3=tile de mueble(Si no es pared) 4=no tile de mueble pero no colocar mas objetos
    inicializarArray(room) {
        room.arrayOcupados = new Array(room.height);
        for (let i = 0; i < room.height; i++) {
            room.arrayOcupados[i] = new Array(room.width);
            for (let j = 0; j < room.width; j++) {
                if (i == 0) {
                    room.arrayOcupados[i][j] = 1;
                } else if (i == 1) {
                    room.arrayOcupados[i][j] = 1;
                } else if (i == room.height - 1) {
                    room.arrayOcupados[i][j] = 1;
                } else if (j == 0) {
                    room.arrayOcupados[i][j] = 1;
                } else if (j == room.width - 1) {
                    room.arrayOcupados[i][j] = 1;
                } else {
                    room.arrayOcupados[i][j] = 0;
                }
            }
        }

        var doors = room.getDoorLocations();// Return una matriz de {x, y} objetos
        for (let i = 0; i < doors.length; i++) {
            if (doors[i].y === 0) {
                room.arrayOcupados[doors[i].y + 1][doors[i].x] = 2;
                room.arrayOcupados[doors[i].y + 2][doors[i].x] = 2;
            } else if (doors[i].y === room.height - 1) {
                room.arrayOcupados[doors[i].y - 1][doors[i].x] = 2;
            } else if (doors[i].x === 0) {
                room.arrayOcupados[doors[i].y][doors[i].x + 1] = 2;
            } else if (doors[i].x === room.width - 1) {
                room.arrayOcupados[doors[i].y][doors[i].x - 1] = 2;
            }
        }
    }

    //Busca un hueco y coloca los objetos que entren en la fila superior
    colocarObjetosArriba(game, room, listaObjetos) {
        listaObjetos.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
            while (!colocado && posicion[0] < 3) {
                while (!colocado && posicion[1] < room.width) {
                    colocado = this.colocaObjeto(game, room, posicion, element);
                    posicion[1] += 1;
                }
                posicion[1] = 0;
                posicion[0] += 1;
            }
        });
    }
    //Busca un hueco y coloca los objetos que entren en cualquier lado de la sala
    colocarObjetosMedio(game, room, listaObjetos) {
        listaObjetos.forEach(element => {
            let colocado = false;
            let posicion = [4, 0];
            while (!colocado && posicion[0] < room.height) {
                while (!colocado && posicion[1] < room.width) {
                    colocado = this.colocaObjeto(game, room, posicion, element);
                    posicion[1] += 1;
                }
                posicion[1] = 0;
                posicion[0] += 1;
            }
        });
    }

    colocarObjetosDerecha(game, room, listaObjetos) {
        listaObjetos.forEach(element => {
            let colocado = false;
            let posicion = [0, room.width - 2];
            while (!colocado && posicion[0] < room.height) {
                colocado = this.colocaObjeto(game, room, posicion, element);
                posicion[0] += 1;
            }
        });
    }

    colocarSofa(game, room) {
        let colocado = false;
        let posicion = [room.height - 2, 0];
        while (!colocado && posicion[1] < room.width) {
            if (room.arrayOcupados[posicion[0]][posicion[1]] == 0 && room.arrayOcupados[posicion[0]][posicion[1] + 1] == 0) {
                game.stuffLayer.putTilesAt(TILES.SOFA, room.left + posicion[1], room.top + posicion[0]);
                //El alrededor a ocupado
                room.arrayOcupados[posicion[0]][posicion[1]] = 4;
                room.arrayOcupados[posicion[0]][posicion[1] + 1] = 4;
                colocado = true;
            }
            posicion[1] += 1;
        }
    }

    //Array ocupados 0=libre 1=pared 2=puerta 3=tile de mueble(Si no es pared) 4=no tile de mueble pero no colocar mas objetos
    //Array ocupados 3 donde esta el tile del mueble y 4 a los alrededores para que no se coloque nada
    colocaObjeto(game, room, posicion, objeto) {
        let colocado = false;
        if (room.arrayOcupados[posicion[0]][posicion[1]] == 0) {
            let alto = objeto.length;
            let ancho = objeto[0].length;
            switch (alto) {
                case 1:
                    switch (ancho) {
                        case 1:
                            if (room.arrayOcupados[posicion[0]][posicion[1] - 1] <= 1 &&
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] <= 1 &&
                                room.arrayOcupados[posicion[0] - 1][posicion[1]] <= 1 &&
                                room.arrayOcupados[posicion[0] - 1][posicion[1] - 1] <= 1 &&
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 1] <= 1) {
                                game.stuffLayer.putTileAt(objeto, room.left + posicion[1], room.top + posicion[0] - 1);
                                room.arrayOcupados[posicion[0]][posicion[1]] = 4;
                                room.arrayOcupados[posicion[0] - 1][posicion[1]] = 3;
                                colocado = true;
                            }
                            break;
                    }
                    break;
                case 2:
                    switch (ancho) {
                        case 1:
                            if (room.arrayOcupados[posicion[0] - 1][posicion[1]] <= 1 &&
                                room.arrayOcupados[posicion[0] + 1][posicion[1]] == 0) {

                                game.stuffLayer.putTilesAt(objeto, room.left + posicion[1], room.top + posicion[0] - 1);
                                room.arrayOcupados[posicion[0]][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0] + 1][posicion[1]] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 1] = 4;
                                colocado = true;
                            }
                            break;
                        case 2:
                            if (room.arrayOcupados[posicion[0] - 1][posicion[1]] <= 1 &&
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 1] <= 1 &&
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] == 0 &&
                                room.arrayOcupados[posicion[0] + 1][posicion[1]] == 0 &&
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 1] == 0) {

                                game.stuffLayer.putTilesAt(objeto, room.left + posicion[1], room.top + posicion[0] - 1);
                                room.arrayOcupados[posicion[0]][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 1] = 3;
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1]] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 1] = 4;
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 2] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] + 2] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 2] = 4;
                                colocado = true;
                            }
                            break;
                        case 3:
                            if (room.arrayOcupados[posicion[0] - 1][posicion[1]] <= 1 &&
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 1] <= 1 &&
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 2] <= 1 &&
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] == 0 &&
                                room.arrayOcupados[posicion[0]][posicion[1] + 2] == 0 &&
                                room.arrayOcupados[posicion[0] + 1][posicion[1]] == 0 &&
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 1] == 0 &&
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 2] == 0) {

                                game.stuffLayer.putTilesAt(objeto, room.left + posicion[1], room.top + posicion[0] - 1);
                                room.arrayOcupados[posicion[0]][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 1] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 2] = 3;
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] = 3;
                                room.arrayOcupados[posicion[0]][posicion[1] + 2] = 3;

                                room.arrayOcupados[posicion[0] - 1][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1]] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 1] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 2] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 3] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] + 3] = 4;
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 3] = 4;
                                colocado = true;
                            }
                            break;
                    }
                    break;
                case 3:
                    switch (ancho) {
                        case 2:
                            if (room.arrayOcupados[posicion[0] - 1][posicion[1]] <= 1 &&
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 1] <= 1 &&
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] == 0 &&
                                room.arrayOcupados[posicion[0] + 1][posicion[1]] == 0 &&
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 1] == 0 &&
                                room.arrayOcupados[posicion[0] + 2][posicion[1]] == 0 &&
                                room.arrayOcupados[posicion[0] + 2][posicion[1] + 1] == 0) {

                                game.stuffLayer.putTilesAt(objeto, room.left + posicion[1], room.top + posicion[0] - 1);
                                room.arrayOcupados[posicion[0]][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 1] = 3;
                                room.arrayOcupados[posicion[0] + 1][posicion[1]] = 3;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 1] = 3;

                                room.arrayOcupados[posicion[0] - 1][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0] - 1][posicion[1] + 2] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] + 2] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0] + 1][posicion[1] + 2] = 4;
                                room.arrayOcupados[posicion[0] + 2][posicion[1] - 1] = 4;
                                room.arrayOcupados[posicion[0] + 2][posicion[1]] = 4;
                                room.arrayOcupados[posicion[0] + 2][posicion[1] + 1] = 4;
                                room.arrayOcupados[posicion[0] + 2][posicion[1] + 2] = 4;
                                colocado = true;
                            }
                            break;
                    }
                    break;
            }
            return colocado;
        }
    }
}