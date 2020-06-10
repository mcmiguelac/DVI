


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

export default class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: 'inicio' });
    }
    create() {
        let width = this.scale.width;
        let height = this.scale.height;
        const instanciaScene = this.scene;
        this.add.image(width / 2, height / 2, 'background').setOrigin(0.5).setDepth(0).setScale(2);
        let playButton = this.add.text(width / 2, height / 2 - 70, '<Play>',
            {
                fontSize: '60px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#094ec0"
            }).setDepth(1).setOrigin(0.5);

        playButton.setInteractive();

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
        });

        let optionsButton = this.add.text(width / 2, height / 2 - 20, '<Options>',
            {
                fontSize: '30px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#094ec0"
            }).setDepth(1).setOrigin(0.5);
        this.add.image(width / 2, height / 2 - 190, 'titulo').setDepth(1).setOrigin(0.5).setScale(1);

        optionsButton.setInteractive();

        optionsButton.on('pointerover', function (value) {
            optionsButton.setScale(1.3);
        });

        optionsButton.on('pointerout', function (value) {
            optionsButton.setScale(1);
        });

        optionsButton.on('pointerup', function (value) {
            instanciaScene.start('options');
            miniA.destroy();
            miniB.destroy();
            miniC.destroy();
        });

        let instruccionesButton = this.add.text(width / 2, height / 2 + 10, '<Como jugar>',
            {
                fontSize: '15px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#094ec0"
            }).setDepth(1).setOrigin(0.5);

        instruccionesButton.setInteractive();

        instruccionesButton.on('pointerover', function (value) {
            instruccionesButton.setScale(1.3);
        });

        instruccionesButton.on('pointerout', function (value) {
            instruccionesButton.setScale(1);
        });

        instruccionesButton.on('pointerup', function (value) {
            instanciaScene.start('instrucciones');
            miniA.destroy();
            miniB.destroy();
            miniC.destroy();
        });

        this.add.image(0, 0, 'background').setOrigin(0.01).setDepth(0).setScale(1.75);

        let rand = Math.random();
        let miniA = this.physics.add.sprite(100, 100, 'mini ' + Math.floor(rand * 10 + 1));
        miniA.setBounce(rand);
        miniA.setCollideWorldBounds(true);
        miniA.body.setGravityY(rand * 600 + 100);

        rand = Math.random();
        let miniB = this.physics.add.sprite(400, 300, 'mini ' + Math.floor(rand * 10 + 1));
        miniB.setBounce(rand);
        miniB.setCollideWorldBounds(true);
        miniB.body.setGravityY(rand * 600 + 100);
        miniB.setFlipX(true);

        rand = Math.random();
        let miniC = this.physics.add.sprite(900, 200, 'mini ' + Math.floor(rand * 10 + 1));
        miniC.setBounce(rand);
        miniC.setCollideWorldBounds(true);
        miniC.body.setGravityY(rand * 600 + 100);
        miniC.setFlipX(true);
    }
}