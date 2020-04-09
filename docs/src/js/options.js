import { datosConfig } from "./config.js";
export default class Options extends Phaser.Scene {
    constructor() {
        super({ key: 'options' });
    }

    //TODO hacer acorde con el ancho y el alto.
    create() {
        const instanciaScene = this.scene;
        var width = this.scale.width;
        var height = this.scale.height;
        
        this.add.image(0, height-450, 'flagLGif').setOrigin(0.05).setDepth(0).setScale(1);
        this.add.image(width - 450, height-450, 'flagRGif').setOrigin(0.05).setDepth(0).setScale(1);

        let musicaButton = this.add.text(width / 2, height / 2, '<Musica> ON',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"
            }).setDepth(1).setOrigin(0.5);
        let otroButton = this.add.text(width / 2, height / 2 +100, '<Activar Pantalla Completa>',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"
            }).setDepth(1).setOrigin(0.5);

        let atrasButton = this.add.text(width / 2, height / 2 + 200, '<Volver>',
            {
                fontSize: '20px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#d40000"
            }).setDepth(1).setOrigin(0.5);

        musicaButton.setInteractive();

        musicaButton.on('pointerover', function (value) {
            musicaButton.setScale(1.3);
        });

        musicaButton.on('pointerout', function (value) {
            musicaButton.setScale(1);
        });

        musicaButton.on('pointerup', function (value) {
            if(datosConfig.music){
                datosConfig.music = false;
                musicaButton.text = "<Musica> OFF"
            }else{
                datosConfig.music = true;
                musicaButton.text = "<Musica> ON"
            }
        });

        otroButton.setInteractive();

        otroButton.on('pointerover', function (value) {
            otroButton.setScale(1.3);
        });

        otroButton.on('pointerout', function (value) {
            otroButton.setScale(1);
        });

        otroButton.on('pointerup', function (value) {
            if(!this.scale.isFullscreen){
                this.scale.startFullscreen();
            }
        }, this);
        
        atrasButton.setInteractive();

        atrasButton.on('pointerover', function (value) {
            atrasButton.setScale(1.3);
        })

        atrasButton.on('pointerout', function (value) {
            atrasButton.setScale(1);
        })

        atrasButton.on('pointerup', function (value) {
            instanciaScene.start('inicio');
        })
    }

    update(time, delta) {

    }
}