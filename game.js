export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'main' });



    }


    preload() {
        this.load.image('sky', '/assets/Fondo-gris.png');

    }
    create() {
        var platforms;
        this.add.image(600, 300, 'sky');
    }


    update(time, delta) {}

}