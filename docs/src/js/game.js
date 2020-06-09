import Player from "./player.js";
import Trump from "./trump.js";
import EnemyKiller from "./enemyKiller.js";
import EnemyNinja from "./enemyNinja.js";
import { datosConfig } from "./config.js";
import RoomFactory from "./roomFactory.js";


export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'game' });
        this.level = 0;
        this.score = 0;
    }

    init(data) {
        if (data.reinicio == true) {
            this.level = 0;
            this.score = 0;
        }
    }

    create() {
        this.victoria = false;
        this.input.setDefaultCursor('url(assets/spritesheets/cursor.png),pointer');
        var width = this.scale.width;
        var height = this.scale.height;
        this.level += 1;
        this.hasPlayerReachedTrump = false;

        this.textInfo6 = this.add.text(width / 2 - 300, height / 2 - 100, " ", {
            font: "25px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },

        }).setScrollFactor(0).setDepth(6);

        if (this.level != 1) {
            if (this.level == 2) {
                this.textInfo6.setText("Le encontraste pero ha huido ! Que raro... ")
                this.time.delayedCall(3000, function () {
                    this.textInfo6.setText(" ");
                }, [], this)
            }
            if (this.level == 3) {
                this.textInfo6.setText("Quizás huye porque Él sabe que es\n el culpable de todo...")
                this.time.delayedCall(3000, function () {
                    this.textInfo6.setText(" ");
                }, [], this);
            }
            this.configMapa.height = Math.round(this.configMapa.height * 1.5);
            this.configMapa.width = Math.round(this.configMapa.width * 1.5);
        } else {
            this.configMapa = {
                width: datosConfig.dungeon.width,
                height: datosConfig.dungeon.height,
                doorPadding: datosConfig.dungeon.doorPadding,
                rooms: datosConfig.dungeon.rooms
            };
            if (datosConfig.dificultad > 1) {
                this.configMapa.height = datosConfig.dungeon.height + Math.round(datosConfig.dungeon.height * (datosConfig.dificultad / 10));
                this.configMapa.width = datosConfig.dungeon.width + Math.round(datosConfig.dungeon.width * (datosConfig.dificultad / 10));
            } else {
                this.configMapa.height = datosConfig.dungeon.height;
                this.configMapa.width = datosConfig.dungeon.width;
            }
        }
        // Genera un mundo aleatorio con algunas opciones adicionales:
        // - Las habitaciones solo deben tener dimensiones de números impares para que tengan un mosaico central.
        // - Las puertas deben estar al menos a 2 mosaicos de las esquinas, para que podamos colocar un mosaico de esquina en
        // a ambos lados de la ubicación de la puerta

        this.dungeon = new Dungeon(this.configMapa);

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
            let alto = salaEnemigo.height;
            let ancho = salaEnemigo.width;

            let piezas_libres = 0;
            for (let i = 1; i < alto - 1; i++) {
                for (let j = 2; j < ancho - 1; j++) {
                    if (salaEnemigo.arrayOcupados[i][j] == 0)
                        piezas_libres++;
                }
            }

            let numero_enemigos = 0;
            switch (datosConfig.dificultad) {
                case 1:
                    numero_enemigos = piezas_libres / 10;
                    break;
                case 2:
                    numero_enemigos = piezas_libres / 7;
                    break;
                case 3:
                    numero_enemigos = piezas_libres / 6;
                    break;
                case 4:
                    numero_enemigos = piezas_libres / 5;
                    break;
                default:
                    numero_enemigos = piezas_libres / 5;
                    break;
            }

            let numero_colocados = 0;
            while (numero_colocados < numero_enemigos) {
                let rand_i = Math.round(Math.random() * (alto - 3)) + 2;
                let rand_j = Math.round(Math.random() * (ancho - 2)) + 1;
                if (salaEnemigo.arrayOcupados[rand_i][rand_j] == 0) {
                    let x = map.tileToWorldX(salaEnemigo.left + rand_j);
                    let y = map.tileToWorldY(salaEnemigo.top + rand_i);
                    let num = Math.floor(Math.random() * 10);
                    if (num < 5)
                        this.enemy.push(new EnemyNinja(this, x, y));
                    else this.enemy.push(new EnemyKiller(this, x, y));
                    salaEnemigo.arrayOcupados[rand_i][rand_j] = 5;
                    numero_colocados++;
                }
            }
        });

        var centroFinalX = map.tileToWorldX(this.endRoom.centerX);
        var centroFinalY = map.tileToWorldY(this.endRoom.centerY + 2);
        this.trump = new Trump(this, centroFinalX, centroFinalY);
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
            this.music.setLoop(true);
        }

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.textInfo = this.add.text(16, 16, `Encuentra a trump. Nivel: ${this.level} \nPuntuación: ${this.score}\nVidas: ${this.player.health}`, {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#FFFFFFAA"

        }).setScrollFactor(0).setDepth(5);
    }
    update(time, delta) {
        //Solo si no ha encontrado a trump
        if (!this.hasPlayerReachedTrump) {
            if (this.playerRoom == this.endRoom) {
                this.stuffLayerAtravesable.setCollisionByExclusion([-1]);
                //Descomentar si se quiere que la habitación final encierre al personaje
                //this.physics.add.collider(this.player.sprite, this.stuffLayerAtravesable);
                //this.physics.add.collider(this.trump.sprite, this.stuffLayerAtravesable);
                this.player.sprite.setSize(14, 25).setOffset(10, 5);
            }
            if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                this.scene.pause();
                this.scene.launch('pause', { game: this });
                this.scene.setVisible(false);
            }
            if (this.player.end) {
                this.scene.pause();

                this.player.destroy();
                this.music.destroy();
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

                this.enemy.forEach(enemigo => {
                    enemigo.update();
                });
                this.trump.update();
            }
        }

        this.textInfo.setText(`Encuentra a trump. Nivel: ${this.level} \nPuntuación: ${this.score}\nVidas: ${this.player.health}`);
        /*this.textInfo1.setText(`Encuentra a trump. Nivel: ${this.level} `);
        this.textInfo2.setText(`Puntuación: ${this.score} `);
        this.textInfo3.setText(`Vidas: ${this.player.health}`);*/

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