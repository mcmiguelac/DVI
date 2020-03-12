import Player from "./player.js";
import TILES from "./tile-mapping.js";
import TilemapVisibility from "./tilemap-visibility.js";

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'main' });
    }

    preload() {
        //this.load.image('tileSet', 'assets/img/assets mapa/Tileset_Large.png');
        //this.load.spritesheet('playerA', 'assets/img/assets personaje/correrDerecha.png', { frameWidth: 15, frameHeight: 24 });
        //Archivo JSON de mapa
        //this.load.tilemapTiledJSON('mapa', 'assets/json/mapa.json');

        this.load.image("tiles", "assets/tilesets/tileset_completo_64px.png");

        /*this.load.spritesheet(
          "characters",
          "../../assets/spritesheets/buch-characters-64px-extruded.png",
          {
              frameWidth: 64,
              frameHeight: 64,
              margin: 1,
              spacing: 2
          }
         );*/

        this.load.spritesheet(
            "characters",
            "assets/spritesheets/buch-characters-64px.png",
            {
                frameWidth: 64,
                frameHeight: 64
            }
        );
    }
    create() {
        /*var map = this.make.tilemap({ key: 'mapa' });
        var tiles = map.addTilesetImage('Objetos', 'tileSet');
        var layer = map.createDynamicLayer("T1", tiles);
        var layer = map.createDynamicLayer("T2", tiles);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        var player = this.physics.add.sprite(10, 45, 'playerA');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        var cursors = this.input.keyboard.createCursorKeys();*/

        this.level++;
        this.hasPlayerReachedStairs = false;

        // Generate a random world with a few extra options:
        //  - Rooms should only have odd number dimensions so that they have a center tile.
        //  - Doors should be at least 2 tiles away from corners, so that we can place a corner tile on
        //    either side of the door location
        this.dungeon = new Dungeon({
            width: 100,
            height: 100,
            doorPadding: 3,
            rooms: {
                width: { min: 7, max: 10/*, onlyOdd: true*/ },
                height: { min: 7, max: 10, /*onlyOdd: true */ }
            }
        });

        //this.dungeon.drawToConsole();

        // Creating a blank tilemap with dimensions matching the dungeon
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

        const shadowLayer = map.createBlankDynamicLayer("Shadow", tileset).fill(TILES.BLANK);

        this.tilemapVisibility = new TilemapVisibility(shadowLayer);

        this.dungeon.rooms.forEach(room => {
            const { x, y, width, height } = room;
            // Fill the floor with mostly clean tiles, but occasionally place a dirty tile
            // See "Weighted Randomize" example for more information on how to use weightedRandomize.
            this.floorLayer.weightedRandomize(x, y, width, height, TILES.FLOOR);
        });

        // Use the array of rooms generated to place tiles in the map
        // Note: using an arrow function here so that "this" still refers to our scene
        this.dungeon.rooms.forEach(room => {
            const { x, y, width, height, left, right, top, bottom } = room;
            // Place the room corners tiles
            this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
            this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
            this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
            this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

            // Fill the walls with mostly clean tiles, but occasionally place a dirty tile
            this.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP);
            this.groundLayer.weightedRandomize(left + 1, top + 1, width - 2, 1, TILES.WALL.SECOND_TOP);
            this.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM);
            this.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT);
            this.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT);

            // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
            // room's location. Each direction has a different door to tile mapping.
            var doors = room.getDoorLocations(); // → Returns an array of {x, y} objects
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

        // Separate out the rooms into:
        //  - The starting room (index = 0)
        //  - A random room to be designated as the end room (with stairs and nothing else)
        //  - An array of 90% of the remaining rooms, for placing random stuff (leaving 10% empty)
        const rooms = this.dungeon.rooms.slice();
        const startRoom = rooms.shift();
        const endRoom = Phaser.Utils.Array.RemoveRandomElement(rooms);
        const otherRooms = Phaser.Utils.Array.Shuffle(rooms).slice(0, rooms.length * 0.9);

        // Place the stairs
        this.stuffLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY);

        // Place stuff in the 90% "otherRooms"
        otherRooms.forEach(room => {
            var rand = Math.random();
            if (rand <= 0.25) {
                // 25% chance of chest
                this.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
            } else if (rand <= 0.5) {
                // 50% chance of a pot anywhere in the room... except don't block a door!
                const x = Phaser.Math.Between(room.left + 2, room.right - 2);
                const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
                this.stuffLayer.weightedRandomize(x, y, 1, 1, TILES.RANDOM_OBJECT);
            } else {
                // 25% of either 2 or 4 towers, depending on the room size
                if (room.height >= 9) {
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2);
                } else {
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
                    this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
                }
            }
        });


        this.groundLayer.setCollision([45, 46, 47, 52, 53, 54, 55, 90, 91, 92, 93, 98, 99, 100]);
        this.stuffLayer.setCollisionByExclusion([-1]);
        //this.loorLayer.setCollisionByExclusion([-1]);

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

        // Place the player in the first room
        const playerRoom = startRoom;
        const x = map.tileToWorldX(playerRoom.centerX);
        const y = map.tileToWorldY(playerRoom.centerY);
        this.player = new Player(this, x, y);

        // Watch the player and tilemap layers for collisions, for the duration of the scene:
        this.physics.add.collider(this.player.sprite, this.groundLayer);
        //this.physics.add.collider(this.player.sprite, this.stuffLayer);

        // Phaser supports multiple cameras, but you can access the default camera like this:
        const camera = this.cameras.main;

        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.startFollow(this.player.sprite);

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, `Find the stairs. Go deeper.\nCurrent level: ${this.level}`, {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);
    }
    update(time, delta) {
        if (this.hasPlayerReachedStairs) return;

        this.player.update();

        // Find the player's room using another helper method from the dungeon that converts from
        // dungeon XY (in grid units) to the corresponding room object
        const playerTileX = this.groundLayer.worldToTileX(this.player.sprite.x);
        const playerTileY = this.groundLayer.worldToTileY(this.player.sprite.y);
        const playerRoom = this.dungeon.getRoomAt(playerTileX, playerTileY);

        this.tilemapVisibility.setActiveRoom(playerRoom);
    }
}