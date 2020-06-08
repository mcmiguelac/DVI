import Player from "./player.js";
import Trump from "./trump.js";
import Enemy from "./enemy.js";
import TILES from "./tile-mapping.js";
import TilemapVisibility from "./tilemap-visibility.js";

import { datosConfig } from "./config.js";
import RoomFactory from "./roomFactory.js";


export default class Game extends Phaser.Scene {


    constructor() {
        super({ key: 'game' });
        this.level = 0;
        this.score = 0;
    }

    create() {
        //Creacion del cursor
        //var scoreText;
        //this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000000' }).setScrollFactor(0).setDepth(6);
        this.input.setDefaultCursor('url(assets/spritesheets/cursor.png),pointer');
        var width = this.scale.width;
        var height = this.scale.height;
        this.level++;
        this.hasPlayerReachedTrump = false;

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

        const html = this.dungeon.drawToHtml({
            empty: " ",
            wall: "📦",
            floor: "☁️",
            door: "🚪"
        });

        // Append the element to an existing element on the page
        document.body.appendChild(html);

        //tratamiento y construccion de las habitaciones
        const roomsFactory = new RoomFactory();
        roomsFactory.createNew(this, map);

        //const playerRoom = startRoom;
        const playerRoom = this.startRoom;
        const x = map.tileToWorldX(playerRoom.centerX);
        const y = map.tileToWorldY(playerRoom.centerY);

        // Coloca al jugador en la primera habitación
        this.player = new Player(this, x, y);

        this.enemy = [];
        this.otherRoomsFull.forEach(salaEnemigo => {
            var x = map.tileToWorldX(salaEnemigo.centerX);
            var y = map.tileToWorldY(salaEnemigo.centerY);
            this.enemy.push(new Enemy(this, x, y));
        });
        //this.enemyshoot = new Enemyshoot(this, x+140, y+140);

        var centroFinalX = map.tileToWorldX(this.endRoom.centerX);
        var centroFinalY = map.tileToWorldX(this.endRoom.centerY + 2);
        this.trump = new Trump(this, centroFinalX, centroFinalY);

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

        //Musica
        if (datosConfig.music) {

            const musicConfig = datosConfig.musicConfig;
            // config es opcional
            this.music = this.sound.add("backgroundMusic", musicConfig);
            // El sonido solo se activará cuando se pase a la escena de juego
            this.music.play();
        }

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        var barConfig = { x: 200, y: 100 };

        this.textInfo = this.add.text(16, 16, `Encuentra a trump. Nivel: ${this.level} Puntuación: ${this.score} Vidas ${this.player.health}`, {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#FFFFFFB0",

        }).setScrollFactor(0).setDepth(5);
    }
    update(time, delta) {
        //Solo si no ha encontrado las escaleras
        if (!this.hasPlayerReachedTrump) {

            if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                console.log("pulsado");
                this.scene.pause();
                this.scene.launch('pause');
                this.scene.setVisible(false);
            }

            if (this.player.end) {
                this.scene.pause();

                this.player.destroy();
                this.music.destroy();
                //TODO destoy todos los elementos
                this.enemy.forEach(enemigo => {
                    enemigo.destroy();
                });
                this.trump.destroy();
                this.scene.launch('end');
                this.scene.setVisible(false);
                this.level = 0;
                this.score = 0;
            } else {
                this.player.update();
                this.trump.update();

                this.enemy.forEach(enemigo => {
                    enemigo.update();
                });
            }
        }

        this.textInfo.setText(`Encuentra a trump. Nivel: ${this.level} Puntuación: ${this.score} Vidas ${this.player.health}`);

        // Encuentra la habitación del jugador usando otro método de ayuda de la mazmorra que convierte
        // mazmorra XY (en unidades de cuadrícula) al objeto de sala correspondiente
        const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
        const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
        const playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);
        if (this.playerRoom != playerRoom) {
            this.tilemapVisibility.setActiveRoom(playerRoom);
            this.playerRoom = playerRoom;
        }
    }
}