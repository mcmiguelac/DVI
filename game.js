export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'main' });



    }


    preload() {
        this.load.image('tileSet', 'assets/Tileset_Large.png');

        //Archivo JSON de mapa
        this.load.tilemap('mapa', 'assets/MapaFin.json', null, Phaser.Tilemap.TILED_JSON);
    }
    create() {
        this.mapa = this.add.tilemap('mapa');
        this.mapa.addTilesetImage('tileSet');
        this.fondo = this.mapa.createLayer('T1');
        this.adornos = this.mapa.createLayer('T2');
    }


    update(time, delta) {}

}