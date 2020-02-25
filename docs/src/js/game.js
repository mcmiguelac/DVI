export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'main' });
    }

    preload() {
        this.load.image('tileSet', 'assets/img/assets mapa/Tileset_Large.png');
        this.load.spritesheet('playerA', 'assets/img/assets personaje/ataque.png', { frameWidth: 23, frameHeight: 83 });
        //Archivo JSON de mapa
        this.load.tilemapTiledJSON('mapa', 'assets/json/mapa.json');
    }
    create() {
        var map = this.make.tilemap({ key: 'mapa' });
        var tiles = map.addTilesetImage('Objetos', 'tileSet');
        var layer = map.createDynamicLayer("T1", tiles);
        var layer = map.createDynamicLayer("T2", tiles);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        var player = this.physics.add.sprite(10, 45, 'playerA');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        var cursors = this.input.keyboard.createCursorKeys();
    }
    update(time, delta) {}
}