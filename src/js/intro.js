/* Clase que implementa la escena de introduccion al juego,
Te introduce en la trama del juego con un pequeño texto introductorio 
Es posible omitirlo inGame
 */
// con setInteractive() hacemos que lo textos funciones como botones
// con pointOver y pointerOut hacemos que el texto se agrande cuando pasamos el raton por encima

import { datosConfig } from "./config.js";
export default class Intro extends Phaser.Scene {
    constructor() {
        super({ key: 'intro' });
    }

    create() {
        var width = this.scale.width;
        var height = this.scale.height;
        const instanciaScene = this.scene;
        this.add.image(width / 2, height / 2, 'final').setOrigin(0.5).setDepth(0).setScale(2);
        //boton de skip
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
        //hace que el texto sea interactivo, es decir , que pueda ser utilizado como un boton
        gobackButton.setInteractive();

        gobackButton.on('pointerover', function (value) {
            gobackButton.setScale(1.5);
        })

        gobackButton.on('pointerout', function (value) {
            gobackButton.setScale(1);
        })


        this.contador = 0;
        this.add.image(0, 0, 'final').setOrigin(0.01).setDepth(0).setScale(1.75);

        //generamos un evento de tiempo que en especial es un contador de segundos
        //Designamos el tiempo que tardara en ejecutarse con Delay :1000 ms yque se repita varias veces con loop :true;
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: contador_de_segundos, callbackScope: this, loop: true });
        //generamos la musica de la introduccion
        if (datosConfig.music) {
            const musicConfig = datosConfig.musicConfig;
            this.music = this.sound.add("musicaIntro", musicConfig);
            this.music.play();
        }
        //lanzamos la siguiente escena si pulsamos el boton
        gobackButton.on('pointerup', function (value) {

            instanciaScene.start('game', { reinicio: true });
            this.music.destroy();
        }, this)
    }

    update() {
        if (this.contador < 17) {
            this.texto.y -= 0.3;
        }
        //si pasa el tiempo indicado sale la nueva escena
        else {
            this.music.destroy();
            this.scene.start("game", { reinicio: true });
        }
    }
}

function contador_de_segundos() {
    this.contador += 1; // One second
}