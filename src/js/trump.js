
/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/
//TODO hacer que esto sea trump
export default class Trump {
    constructor(scene, x, y) {
        this.end = false;
        this.health = 25;
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.anguloSprite = 0;
        this.animation = "enemy-walk";
        this.sprite = scene.physics.add
            .sprite(x, y, "enemigo", 0)
            .setSize(19, 25)
            .setOffset(10, 10);

        const anims = scene.anims;
        this.sprite.setScale(1.75);
        anims.create({
            key: "enemy-walk-back",
            frames: anims.generateFrameNumbers("enemigo", { start: 22, end: 29 }),
            frameRate: 8,
            repeat: -1
        });
        anims.create({
            key: "enemy-walk",
            frames: anims.generateFrameNumbers("enemigo", { start: 30, end: 37 }),
            frameRate: 8,
            repeat: -1
        });
        anims.create({
            key: "enemy-stand-back",
            frames: anims.generateFrameNumbers("enemigo", { start: 9, end: 21 }),
            frameRate: 8,
            repeat: -1
        });
        anims.create({
            key: "enemy-stand",
            frames: anims.generateFrameNumbers("enemigo", { start: 0, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, ganador, null, this.scene);
        function ganador(enemy, player) {
            if (!this.hasPlayerReachedTrump) {
                this.hasPlayerReachedTrump = true;
                this.player.freeze();
                this.trump.freeze();
                this.score += 100;
                this.cameras.main.fade(250, 0, 0, 0);
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    this.player.destroy();
                    this.music.destroy();
                    this.scene.restart();
                    //TODO destoy todos los elementos
                    this.enemy.forEach(enemigo => {
                        enemigo.destroy();
                    });
                    this.trump.destroy();
                });
            }
        }

        this.sprite.anims.play('enemy-stand', true);
    }

    freeze() {
        this.sprite.body.moves = false;
    }

    ocultar() {
        this.sprite.setDepth(1);
    }

    mostrar() {
        this.sprite.setDepth(4);
    }
    destroy() {
        this.sprite.destroy();
    }
    update() {
    }

}
