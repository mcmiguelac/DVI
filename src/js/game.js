import Player from "./player.js";
import Enemy from "./enemy.js";
import TILES from "./tile-mapping.js";
import TilemapVisibility from "./tilemap-visibility.js";

import { datosConfig } from "./config.js";


export default class Game extends Phaser.Scene {
    

    constructor() {
        super({ key: 'game' });
    }

    create() {
        //Creacion del cursor 
        var score = 0;
      
        var vidas;
        
        vidas = this.add.text(16, 16, 'vida: 100', { fontSize: '32px', fill: '#000' });
        vidas.setDepth(10);
        this.input.setDefaultCursor('url(assets/spritesheets/cursor.png),pointer');
        var width = this.scale.width;
        var height = this.scale.height;

        this.level++;
        this.hasPlayerReachedStairs = false;

        // Genera un mundo aleatorio con algunas opciones adicionales:
        // - Las habitaciones solo deben tener dimensiones de números impares para que tengan un mosaico central.
        // - Las puertas deben estar al menos a 2 mosaicos de las esquinas, para que podamos colocar un mosaico de esquina en
        // a ambos lados de la ubicación de la puerta
        this.dungeon = new Dungeon(datosConfig.dungeon);
        
        // Crear un mapa de mosaicos en blanco con dimensiones que coincidan con la mazmorra
        const map = this.make.tilemap({
            tileWidth: 64,
            tileHeight: 64,
            width: this.dungeon.width,
            height: this.dungeon.height
        });

        const tileset = map.addTilesetImage("tiles", null, 64, 64, 0, 0);

        this.floorLayer = map.createBlankDynamicLayer("Floor", tileset);
        this.groundLayer = map.createBlankDynamicLayer("Ground", tileset);
        this.stuffLayer = map.createBlankDynamicLayer("Stuff", tileset);
        this.enemyLayer = map.createBlankDynamicLayer("Enemy", tileset);
        this.shadowLayer = map.createBlankDynamicLayer("Shadow", tileset).fill(TILES.BLANK).setDepth(5);
        
        this.tilemapVisibility = new TilemapVisibility(this.shadowLayer);

        this.dungeon.rooms.forEach(room => {
            const { x, y, width, height } = room;
            // Llena el suelo con baldosas en su mayoría limpias, pero ocasionalmente coloca una baldosa sucia
            // Consulte el ejemplo de "Aleatorización ponderada" para obtener más información sobre cómo usar weightedRandomize.
            // Esto se ha modificado para que todas las balsodas sean iguales, TODO en otra version se ensuciarán
            this.floorLayer.weightedRandomize(x, y, width, height, TILES.FLOOR);
        });

        // Usa la matriz de habitaciones generadas para colocar mosaicos en el mapa
        // Nota: usar una función de flecha aquí para que "this" todavía se refiera a nuestra escena
        this.dungeon.rooms.forEach(room => {
            const { x, y, width, height, left, right, top, bottom } = room;

            // Tiles de esquinas
            this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
            this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
            this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
            this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

            // Paredes, TODO en un futuro se ensuciarán
            this.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP);
            this.groundLayer.weightedRandomize(left + 1, top + 1, width - 2, 1, TILES.WALL.SECOND_TOP);
            this.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM);
            this.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT);
            this.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT);

            // Las mazmorras tienen habitaciones conectadas con puertas. Cada puerta tiene una x, y relativa a la
            // ubicación de la habitación. Cada dirección tiene una puerta diferente para el mapeo de mosaicos.
            var doors = room.getDoorLocations();// Return una matriz de {x, y} objetos
            for (var i = 0; i < doors.length; i++) {
                if (doors[i].y === 0) {
                    this.groundLayer.putTilesAt(TILES.DOOR.TOP, x + doors[i].x - 1, y + doors[i].y);
                } else if (doors[i].y === room.height - 1) {
                    this.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + doors[i].x - 1, y + doors[i].y);
                } else if (doors[i].x === 0) {
                    this.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + doors[i].x, y + doors[i].y - 2);
                } else if (doors[i].x === room.width - 1) {
                    this.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + doors[i].x, y + doors[i].y - 2);
                }
            }
        });
        
        // Separa las habitaciones en:
        // - La sala de inicio (índice = 0)
        // - Una habitación aleatoria que se designará como la habitación final (con escaleras y nada más)
        // - Una matriz del 90% de las habitaciones restantes, para colocar cosas al azar (dejando un 10% vacío)
        const rooms = this.dungeon.rooms.slice();
        const startRoom = rooms.shift();
        const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
        const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(0, rooms.length * 0.9);

        //Escaleras TODO
        this.stuffLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY);
        var enemies = [];
        //Cosas en las demas habitaciones TODO hacer correctamente
        otherRooms.forEach(room => {
           
            
            var rand = Math.random();
            if (rand <= 0.25) {
                // 25% de probabilidad de objeto
                this.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
            } else if (rand <= 0.5) {
                // 50% de probabilidad de que haya un objeto random en cualquier lugar de la habitación ... ¡excepto que no bloquees una puerta!
            
               
                const x = Phaser.Math.Between(room.left + 2, room.right - 2);
                const y = Phaser.Math.Between(room.top + 3, room.bottom - 2);
                var valor =this.stuffLayer.weightedRandomize(x, y, 1, 1, TILES.RANDOM_OBJECT);
                console.log(valor);
               
               //console.log(this.enemyLayer.weightedRandomize(x+1, y+1, 1, 1, TILES.ENEMY);
            } else {
                // 25% de 2 o 4 torres, dependiendo del tamaño de la habitación
                /*if (room.height >= 8) {
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2);
                } else {
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
                }*/
                // 25% de maceta
                this.stuffLayer.putTilesAt(TILES.TOWER, room.left + 1, room.top + 1);
            }
            enemies.push(room);
        });


        this.groundLayer.setCollision([45, 46, 47, 52, 53, 54, 55, 90, 91, 92, 93, 98, 99, 100]);
        this.stuffLayer.setCollisionByExclusion([-1]);

        //Encontró la salida
        this.stuffLayer.setTileIndexCallback(TILES.STAIRS, () => {
            this.stuffLayer.setTileIndexCallback(TILES.STAIRS, null);
            this.hasPlayerReachedStairs = true;
            this.player.freeze();
            const cam = this.cameras.main;
            cam.fade(250, 0, 0, 0);
            cam.once("camerafadeoutcomplete", () => {
                this.player.destroy();
                this.scene.restart();
            });
        });

        const playerRoom = startRoom;
        const x = map.tileToWorldX(playerRoom.centerX);
        const y = map.tileToWorldY(playerRoom.centerY);

        // Coloca al jugador en la primera habitación
        this.player = new Player(this, x, y);
        
        this.enemy = [];
        console.log(enemies);
        enemies.forEach(enemigo => {
            var e = enemigo;
            var a = map.tileToWorldX(e.centerX);
            var b = map.tileToWorldY(e.centerY);
            this.enemy.push(new Enemy(this,a ,b));
        });
      //  this.enemyshoot = new Enemyshoot(this, x+140, y+140);
        
        console.log(this.dungeon);

        // Mira las capas del jugador y del mapa de mosaicos para ver si hay colisiones, durante la duración de la escena
        this.physics.add.collider(this.player.sprite, this.groundLayer);
        this.physics.add.collider(this.player.sprite, this.stuffLayer);

        // Phaser admite varias cámaras, pero accededemos a la cámara predeterminada de esta manera
        const camera = this.cameras.main;

        camera.setZoom(1);

        // Restringe la cámara para que no se pueda mover fuera del ancho / alto de tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.startFollow(this.player.sprite);

        // Texto de ayuda que tiene una posición "fija" en la pantalla
        /*this.add
            .text(16, 16, `encuentra a trump.\nCurrent level: ${this.level}`, {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0).setDepth(5);
            */

        if (datosConfig.music) {
            
            const musicConfig = {
                mute: false,
                volume: 0.01,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: true,
                delay: 0
            }; // config es opcional
            var music = this.sound.add("backgroundMusic", musicConfig);
            // El sonido solo se activará cuando se pase a la escena de juego
            
             music.play();
        }

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        var barConfig = {x: 200, y: 100};
	   

    }
    update(time, delta) {
        if (this.hasPlayerReachedStairs) return;

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            console.log("pulsado");
            this.scene.pause();
            this.scene.launch('pause');
            this.scene.setVisible(false);
        }
        else if(this.player.end){
            this.scene.pause();
            this.scene.launch('end');
            this.scene.setVisible(false);
        }
        this.player.update();
        
        this.enemy.forEach(enemigo => {
            enemigo.update();
        });

        

        // Encuentra la habitación del jugador usando otro método de ayuda de la mazmorra que convierte
        // mazmorra XY (en unidades de cuadrícula) al objeto de sala correspondiente
        const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
        const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
        const playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);

        this.tilemapVisibility.setActiveRoom(playerRoom);
    }
}