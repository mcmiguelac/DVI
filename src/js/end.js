
/* 
Escena que se lanza cuando el personaje se queda sin vidas

Contiene un boton para volver a la escena inicial

// con setInteractive() hacemos que lo textos funciones como botones
// con pointOver y pointerOut hacemos que el texto se agrande cuando pasamos el raton por encima
*/
export default class End extends Phaser.Scene {
    constructor() {
        super({ key: 'end' });
    }
    create() {
        let width = this.scale.width;
        let height = this.scale.height;
        const instanciaScene = this.scene;
        this.add.image(width / 2, height / 2, 'final').setOrigin(0.5).setDepth(0).setScale(2);
        let gobackButton = this.add.text(width / 2, height / 2 - 50, '<Volver al inicio>',
            {
                fontSize: '60px',
                fontStyle: 'bold',
                fontFaminly: 'monospace',
                fill: "#d40000"
            }).setDepth(1).setOrigin(0.5);
        this.add.image(width / 2, height / 2 - 190, 'titulo').setDepth(1).setOrigin(0.5).setScale(1);

        gobackButton.setInteractive();

        gobackButton.on('pointerover', function (value) {
            gobackButton.setScale(1.5);
        })

        gobackButton.on('pointerout', function (value) {
            gobackButton.setScale(1);
        })

        gobackButton.on('pointerup', function (value) {
            instanciaScene.start('inicio');
            miniA.destroy();
        })

        this.add.image(0, 0, 'final').setOrigin(0.01).setDepth(0).setScale(1.75);

        let rand = Math.random();
        let miniA = this.physics.add.sprite(100, 100, 'trumpDead');
        miniA.setScale(2);
        miniA.setBounce(rand);
        miniA.setCollideWorldBounds(true);
        miniA.body.setGravityY(rand * 600 + 100)

    }
}