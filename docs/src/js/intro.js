
import { datosConfig } from "./config.js";
export default class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: 'intro' });
    }

    create() {
        var width = this.scale.width;
        var height = this.scale.height;
        const instanciaScene = this.scene;
        this.add.image(width / 2, height / 2, 'final').setOrigin(0.5).setDepth(0).setScale(2);
        let gobackButton = this.add.text(width - 100, height - 50, '<Skip>',
            {
                fontSize: '20px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#FF0000"
            }).setDepth(1).setOrigin(0.5);

        this.add.image(width / 2, height / 2 - 190, 'titulo').setDepth(1).setOrigin(0.5).setScale(1);
        this.texto = this.add.text(width / 2, height + 100, this.game.cache.text.get('TextoInicio')).setDepth(2).setOrigin(0.5);
        this.texto.setScale(1.5);
        gobackButton.setInteractive();

        gobackButton.on('pointerover', function (value) {
            gobackButton.setScale(1.5);
        })

        gobackButton.on('pointerout', function (value) {
            gobackButton.setScale(1);
        })


        this.contador = 0;
        this.add.image(0, 0, 'final').setOrigin(0.01).setDepth(0).setScale(1.75);
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

        if (datosConfig.music) {

            const musicConfig = datosConfig.musicConfig;
            this.music = this.sound.add("musicaIntro", musicConfig);
            // El sonido solo se activará cuando se pase a la escena de juego

            this.music.play();
        }
        gobackButton.on('pointerup', function (value) {

            instanciaScene.start('game');
            this.music.destroy();
        }, this)
    }

    update() {

        if (this.contador < 17) {
            this.texto.y -= 0.3;
        }
        else {
            this.music.destroy();
            this.scene.start("game");
        }

    }

}
function onEvent() {
    this.contador += 1; // One second
    console.log(this.contador);
}