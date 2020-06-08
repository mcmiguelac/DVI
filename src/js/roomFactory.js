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
            // Llena el suelo con baldosas en su mayoría limpias, pero ocasionalmente coloca una baldosa sucia
            // Consulte el ejemplo de "Aleatorización ponderada" para obtener más información sobre cómo usar weightedRandomize.
            // Esto se ha modificado para que todas las balsodas sean iguales, TODO en otra version se ensuciarán
            //game.floorLayer.weightedRandomize(x, y, width, height, TILES.FLOOR);
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
            /*game.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP);
            game.groundLayer.weightedRandomize(left + 1, top + 1, width - 2, 1, TILES.WALL.SECOND_TOP);
            game.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM);
            game.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT);
            game.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT);*/

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

            //puntTemp = puntTemp + (room.height*2 + room.width);

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
        

        //Encontró la salida
        /*game.stuffLayer.setTileIndexCallback(TILES.COFRE, () => {
            game.stuffLayer.setTileIndexCallback(TILES.COFRE, null);
            game.hasPlayerReachedStairs = true;
            game.player.freeze();
            game.score+=100;
            game.cameras.main.fade(250, 0, 0, 0);
            game.cameras.main.once("camerafadeoutcomplete", () => {
                game.player.destroy();
                game.scene.restart();
                //TODO destoy todos los elementos
            });
        });*/
    }
    endRoomNew(game, endRoom) {
        //Escaleras TODO
        game.stuffLayer.putTilesAt(TILES.TRONO, endRoom.centerX - 1, endRoom.centerY);
        game.stuffLayer.putTileAt(TILES.COFRE, endRoom.left + 1, endRoom.top + 2);
        endRoom.getDoorLocations().forEach(door => {
            if (door.y === 0) {
                //game.groundLayer.putTilesAt(TILES.DOOR.TOP, x + doors[i].x - 1, y + doors[i].y);
                game.stuffLayerAtravesable.putTilesAt(TILES.DOOR.SALIDA_TOP, endRoom.x + door.x, endRoom.y + door.y - 1);
            } else if (door.y === endRoom.height - 1) {
                //game.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + doors[i].x - 1, y + doors[i].y);
                game.stuffLayerAtravesable.putTilesAt(TILES.DOOR.SALIDA_BOTTOM, endRoom.x + door.x, endRoom.y + door.y);
            } else if (door.x === 0) {
                //game.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + doors[i].x, y + doors[i].y - 2);
                game.stuffLayerAtravesable.putTilesAt(TILES.DOOR.SALIDA_LEFT, endRoom.x + door.x - 1, endRoom.y + door.y);
            } else if (door.x === endRoom.width - 1) {
                //game.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + doors[i].x, y + doors[i].y - 2);
                game.stuffLayerAtravesable.putTilesAt(TILES.DOOR.SALIDA_RIGHT, endRoom.x + door.x, endRoom.y + door.y);
            }
        });
    }
    otherRoomsFullNew(game, otherRoomsFull) {
        //Cosas en las demas habitaciones TODO hacer correctament
        otherRoomsFull.forEach(room => {
            //var rand = Math.random();
            var rand = Math.round(Math.random() * 100) % 8;
            switch (rand) {
                case 0:
                    console.log("cocina");
                    this.cocina(game, room);
                    break;
                case 1:
                    console.log("Biblioteca");
                    this.biblioteca(game, room);
                    break;
                case 2:
                    console.log("Salon");
                    this.salon(game, room);
                    break;
                case 3:
                    console.log("Estudio");
                    this.estudio(game, room);
                    break;
                case 4:
                    console.log("Habitacion");
                    this.habitacion(game, room);
                    break;
                case 5:
                    console.log("Comedor");
                    this.comedor(game, room);
                    break;
                case 6:
                    console.log("Laboratorio");
                    this.laboratorio(game, room);
                    break;
                case 7:
                    console.log("Toilette");
                    this.toilete(game, room);
                    break;
                default:
                    break;
            }

            if (rand <= 0.12) {
                // 25% de probabilidad de objeto
                //game.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
                //game.stuffLayer.putTilesAt(TILES.ALFOMBRA_EEUU, room.centerX-1, room.centerY);
            } else if (rand <= 0.24) {
                // 50% de probabilidad de que haya un objeto random en cualquier lugar de la habitación ... ¡excepto que no bloquees una puerta!
                const x = Phaser.Math.Between(room.left + 2, room.right - 2);
                const y = Phaser.Math.Between(room.top + 3, room.bottom - 2);
                //var valor =game.stuffLayer.weightedRandomize(x, y, 1, 1, TILES.PLANTA);
                //console.log(valor);
            } else {
                // 25% de 2 o 4 torres, dependiendo del tamaño de la habitación
                /*if (room.height >= 8) {
                    game.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
                    game.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
                    game.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
                    game.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2);
                } else {
                    game.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
                    game.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
                }*/
                // 25% de maceta
                //game.stuffLayer.putTilesAt(TILES.TOWER, room.left + 1, room.top + 1);
            }
        });
    }
    otherRoomsEmptyNew(game, otherRoomsEmpty) {
        otherRoomsEmpty.forEach(room => {
            game.stuffLayerAtravesable.putTilesAt(TILES.ALFOMBRA_EEUU, room.centerX - 1, room.centerY);
        });
    }

    //TODO añadir banderas a todo

    //Decoracion de la cocina
    cocina(game, room) {
        this.inicializarArray(room);
        const array = [TILES.FRIGO1, TILES.COCINA_FUEGOS, TILES.FREGADEROS, TILES.MESA_COCINA];
        array.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
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

    biblioteca(game, room) {
        this.inicializarArray(room);
        const array = [TILES.RADIO, TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.ESTANTE_LLENO, TILES.ESTANTE_VACIO, TILES.TELE];
        array.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
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

    salon(game, room) {
        //TODO aniadir sofa
        this.inicializarArray(room);
        const array = [TILES.TELEFONO, TILES.ESTANTE_VACIO, TILES.TELE, TILES.PLANTA];
        array.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
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

    estudio(game, room) {
        //TODO añadir estudio y silla
        this.inicializarArray(room);
        const array = [TILES.TELEFONO, TILES.ESTANTE_VACIO, TILES.RADIO, TILES.TELE, TILES.PLANTA];
        array.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
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

    habitacion(game, room) {
        //Añadir estudio y silla
        this.inicializarArray(room);
        const array = [TILES.TELEFONO, TILES.CAMA, TILES.TELE, TILES.PLANTA];
        array.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
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

    comedor(game, room) {
        //Arreglar mesa y sillas
        this.inicializarArray(room);
        const array = [TILES.FRIGO2, TILES.BAR, TILES.FRIGO_GRANDE, TILES.TELE, TILES.PLANTA];
        array.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
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

    laboratorio(game, room) {
        //Poner cosas por mitad
        this.inicializarArray(room);
        const array = [TILES.PIZZARA, TILES.LABORATORIO, TILES.RADIO, TILES.TELEFONO, TILES.LABORATORIO, TILES.PLANTA];
        array.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
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

    toilete(game, room) {
        //Poner cosas por mitad
        this.inicializarArray(room);
        const array = [TILES.WC, TILES.LABAVO, TILES.DUCHA, TILES.PLANTA];
        array.forEach(element => {
            let colocado = false;
            let posicion = [0, 0];
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
                            if (room.arrayOcupados[posicion[0]][posicion[1] - 1] != 2 && room.arrayOcupados[posicion[0]][posicion[1] + 1] != 2)
                                game.stuffLayer.putTileAt(objeto, room.left + posicion[1], room.top + posicion[0] - 1);
                            room.arrayOcupados[posicion[0]][posicion[1]] = 4;
                            colocado = true;
                            break;
                        case 2:
                            if (room.arrayOcupados[posicion[0]][posicion[1] + 1] == 0) {
                                game.stuffLayer.putTilesAt(objeto, room.left + posicion[1], room.top + posicion[0] - 1);
                                //El alrededor a ocupado
                                room.arrayOcupados[posicion[0]][posicion[1]] = 4;
                                room.arrayOcupados[posicion[0]][posicion[1] + 1] = 4;
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
                        case 1:
                            //No existen objetos
                            break;
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
                        case 3:
                            //No existen
                            break;
                    }
                    break;
            }
            return colocado;
        }
    }
}