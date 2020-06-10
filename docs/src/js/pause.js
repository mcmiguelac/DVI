



//Menu de pausa
//Podremos acceder pulsando en la barra espaciodora desde dentro del juego
/* 
Aqui podremos encontrar varias opciones
    - Continuar con el juego
    - Volver al menu de inicio

*/
// con setInteractive() hacemos que lo textos funciones como botones
// con pointOver y pointerOut hacemos que el texto se agrande cuando pasamos el raton por encima


// Encontramos una serie de sprites que apareceran de forma random cada vez que entremos en el menu  
// y tendran una fisica aleatoria.

export default class Pause extends Phaser.Scene {
    constructor() {
        super({ key: 'pause' });
    }

    init(data) {
        this.gameScene = data.game;
    }

    create() {
        let width = this.scale.width;
        let height = this.scale.height;
        const instanciaScene = this.scene;
        this.add.image(width / 2, height / 2, 'background').setOrigin(0.5).setDepth(0).setScale(2);
        let resumeButton = this.add.text(width / 2, height / 2 - 50, '<Resume>',
            {
                fontSize: '60px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#094ec0"
            }).setDepth(1).setOrigin(0.5);
        let exitButton = this.add.text(width / 2, height / 2, '<Exit>',
            {
                fontSize: '30px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#094ec0"
            }).setDepth(1).setOrigin(0.5);
        this.add.image(width / 2, height / 2 - 190, 'titulo').setDepth(1).setOrigin(0.5).setScale(1);

        resumeButton.setInteractive();

        resumeButton.on('pointerover', function (value) {
            resumeButton.setScale(1.5);
        });

        resumeButton.on('pointerout', function (value) {
            resumeButton.setScale(1);
        });

        resumeButton.on('pointerup', function (value) {
            instanciaScene.setVisible(true, 'game');
            instanciaScene.resume('game');
            instanciaScene.setVisible(false);
            miniA.destroy();
            miniB.destroy();
            miniC.destroy();
        });

        exitButton.setInteractive();

        exitButton.on('pointerover', function (value) {
            exitButton.setScale(1.3);
        });

        exitButton.on('pointerout', function (value) {
            exitButton.setScale(1);
        });

        exitButton.on('pointerup', function (value) {

            this.gameScene.player.destroy();
            this.gameScene.music.destroy();
            this.gameScene.enemy.forEach(enemigo => {
                enemigo.destroy();
            });
            this.gameScene.trump.destroy();
            instanciaScene.start('inicio');
            this.gameScene.level = 0;
            this.gameScene.score = 0;
            this.gameScene.destroy();
            miniA.destroy();
            miniB.destroy();
            miniC.destroy();
        }, this);

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