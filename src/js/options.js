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

        this.add.image(0, height - 450, 'flagLGif').setOrigin(0.05).setDepth(0).setScale(1);
        this.add.image(width - 450, height - 450, 'flagRGif').setOrigin(0.05).setDepth(0).setScale(1);

        let musicaButton = this.add.text(width / 2, height / 2, '<Musica> ON',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"
            }).setDepth(1).setOrigin(0.5);
        let fullButton = this.add.text(width / 2, height / 2 + 100, '<Activar Pantalla Completa>',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"
            }).setDepth(1).setOrigin(0.5);

        let volumeInfo = this.add.text(width / 2 - 120, height / 2 + 50, '<Volumen>',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"
            }).setDepth(1).setOrigin(0.5);

        let diffInfo = this.add.text(width / 2 - 120, height / 2 + 150, '<Dificultad>',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"
            }).setDepth(1).setOrigin(0.5);

        let diffPlusButton = this.add.text(width / 2 + 70, height / 2 + 150, '+',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"

            }).setDepth(1).setOrigin(0.5);
        let diffValue = this.add.text(width / 2 + 120, height / 2 + 150, datosConfig.dificultad,
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#ffffff",
                backgroundColor: "#004dc9"
            }).setDepth(1).setOrigin(0.5);

        let diffMinButton = this.add.text(width / 2 + 170, height / 2 + 150, '-',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"
            }).setDepth(1).setOrigin(0.5);






        diffPlusButton.setInteractive();

        diffPlusButton.on('pointerover', function (value) {
            diffPlusButton.setScale(1.5);
        });

        diffPlusButton.on('pointerout', function (value) {
            diffPlusButton.setScale(1);
        });

        diffPlusButton.on('pointerup', function (value) {
            if (datosConfig.dificultad < 4) {
                datosConfig.dificultad++;
                diffValue.text = datosConfig.dificultad;
                //datosConfig.dungeon.height = datosConfig.dungeon.height +20;
                //datosConfig.dungeon.width = datosConfig.dungeon.width +20;
            }
        }, this);

        diffMinButton.setInteractive();

        diffMinButton.on('pointerover', function (value) {
            diffMinButton.setScale(1.5);
        });

        diffMinButton.on('pointerout', function (value) {
            diffMinButton.setScale(1);
        });

        diffMinButton.on('pointerup', function (value) {
            if (datosConfig.dificultad > 1) {
                datosConfig.dificultad--;
                //datosConfig.dungeon.height = datosConfig.dungeon.height - 20;
                //datosConfig.dungeon.width = datosConfig.dungeon.width - 20;
                diffValue.text = datosConfig.dificultad;
            }
        }, this);
        let volumePlusButton = this.add.text(width / 2 + 70, height / 2 + 50, '+',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#004dc9"

            }).setDepth(1).setOrigin(0.5);

        let volumeValue = this.add.text(width / 2 + 120, height / 2 + 50, datosConfig.musicConfig.volume * 100,
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#ffffff",
                backgroundColor: "#004dc9"
            }).setDepth(1).setOrigin(0.5);

        let volumeMinButton = this.add.text(width / 2 + 170, height / 2 + 50, '-',
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
            if (!datosConfig.musicConfig.mute) {
                datosConfig.musicConfig.mute = true;
                musicaButton.text = "<Musica> OFF"
            } else {
                datosConfig.musicConfig.mute = false;
                musicaButton.text = "<Musica> ON"
            }
        });

        fullButton.setInteractive();

        fullButton.on('pointerover', function (value) {
            fullButton.setScale(1.3);
        });

        fullButton.on('pointerout', function (value) {
            fullButton.setScale(1);
        });

        fullButton.on('pointerup', function (value) {
            if (!this.scale.isFullscreen) {
                this.scale.startFullscreen();
            }
        }, this);

        volumePlusButton.setInteractive();

        volumePlusButton.on('pointerover', function (value) {
            volumePlusButton.setScale(1.5);
        });

        volumePlusButton.on('pointerout', function (value) {
            volumePlusButton.setScale(1);
        });

        volumePlusButton.on('pointerup', function (value) {
            if (datosConfig.musicConfig.volume <= 0.95) {
                console.log(datosConfig.musicConfig.volume)
                datosConfig.musicConfig.volume = parseFloat((datosConfig.musicConfig.volume + 0.05).toFixed(2));
                console.log(datosConfig.musicConfig.volume)
                volumeValue.text = Math.round(datosConfig.musicConfig.volume * 100);
            }
        }, this);

        volumeMinButton.setInteractive();

        volumeMinButton.on('pointerover', function (value) {
            volumeMinButton.setScale(1.5);
        });

        volumeMinButton.on('pointerout', function (value) {
            volumeMinButton.setScale(1);
        });

        volumeMinButton.on('pointerup', function (value) {
            if (datosConfig.musicConfig.volume >= 0.05) {
                console.log(datosConfig.musicConfig.volume)
                datosConfig.musicConfig.volume = parseFloat((datosConfig.musicConfig.volume - 0.05).toFixed(2));
                console.log(datosConfig.musicConfig.volume)
                volumeValue.text = Math.round(datosConfig.musicConfig.volume * 100);
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