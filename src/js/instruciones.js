


//Menu de Inicio
/* 
Aqui podremos encontrar varias opciones
    - Iniciar partida
    - Entrar al Menu de opciones
    

*/
// con setInteractive() hacemos que lo textos funciones como botones
// con pointOver y pointerOut hacemos que el texto se agrande cuando pasamos el raton por encima


// Encontramos una serie de sprites que apareceran de forma random cada vez que entremos en el menu  
// y tendran una fisica aleatoria.

export default class Instrucciones extends Phaser.Scene {
    constructor() {
        super({ key: 'instrucciones' });
    }
    create() {
        var width = this.scale.width;
        var height = this.scale.height;
        const instanciaScene = this.scene;
        //this.add.image(width / 2, height / 2, 'background').setOrigin(0.5).setDepth(0).setScale(2);
        this.add.image(0, 0, 'background').setOrigin(0.01).setDepth(0).setScale(1.75).setAlpha(0.2);

        this.add.text(500, 50, 'Instrucciones',
            {
                fontSize: '40px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        this.add.text(362, 100, 'Tu objetivo aquí es dirigir al intrepido protagonista',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);
        var protagonista = this.physics.add.sprite(665, 100, "characters", 40);

        this.add.text(812, 100, 'a traves del laberinto',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        this.add.text(190, 150, 'utilizando las teclas',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        this.add.image(330, 120, 'wasd').setOrigin(0.01).setDepth(0).setScale(0.1);

        this.add.text(width / 2 + 173, 150, 'para dirigirlo a traves de toda la casa blanca,',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        this.add.text(width / 2 - 5, 200, 'con el objetivo de encontrar a Trump    y "salvarle", pero en nuestro viaje nos',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        var trump = this.physics.add.sprite(490, 200, "trump", 0);

        this.add.text(width / 2 - 2, 250, 'encontraremos con temibles enemigos          que desean evitar nuestro objetivo ',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        var enemigo1 = this.physics.add.sprite(485, 250, "ninja", 16);
        var enemigo2 = this.physics.add.sprite(523, 250, "enemigo", 0);

        this.add.text(width / 2 - 2, 300, 'pero nosotros tenemos un arma con la que acabar con ellos, solo tenemos que usar',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        this.add.text(width / 2 - 100, 350, 'las teclas             para disparar.        !Suerte Camarada¡',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        this.add.image(210, 325, 'keys').setOrigin(0.01).setDepth(0).setScale(0.1);

        this.add.text(width / 2 - 100, 410, 'AHH lo olvidaba, si necesitas una pausa solo tienes que pulsar',
            {
                fontSize: '18px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#000000"
            }).setDepth(1).setOrigin(0.5);

        this.add.image(730, 330, 'spacebar').setOrigin(0.01).setDepth(0).setScale(0.14);

        /*let playButton = this.add.text(width / 2, height / 2 - 50, '<Play>',
            {
                fontSize: '60px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#094ec0"
            }).setDepth(1).setOrigin(0.5);
        let optionsButton = this.add.text(width / 2, height / 2, '<Options>',
            {
                fontSize: '30px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#094ec0"
            }).setDepth(1).setOrigin(0.5);*/

        let exitButton = this.add.text(width - 60, height - 50, '<Volver>',
            {
                fontSize: '15px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#d40000"
            }).setDepth(1).setOrigin(0.5);

        exitButton.setInteractive();

        exitButton.on('pointerover', function (value) {
            exitButton.setScale(1.3);
        });

        exitButton.on('pointerout', function (value) {
            exitButton.setScale(1);
        });

        exitButton.on('pointerup', function (value) {
            instanciaScene.start('inicio');
        }, this);

        /*playButton.setInteractive();

        playButton.on('pointerover', function (value) {
            playButton.setScale(1.5);
        })

        playButton.on('pointerout', function (value) {
            playButton.setScale(1);
        })

        playButton.on('pointerup', function (value) {
            instanciaScene.start('intro');
            miniA.destroy();
            miniB.destroy();
            miniC.destroy();
        })

        optionsButton.setInteractive();

        optionsButton.on('pointerover', function (value) {
            optionsButton.setScale(1.3);
        })

        optionsButton.on('pointerout', function (value) {
            optionsButton.setScale(1);
        })

        optionsButton.on('pointerup', function (value) {
            instanciaScene.start('options');
            miniA.destroy();
            miniB.destroy();
            miniC.destroy();
        })*/
    }
}