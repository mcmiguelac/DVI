import Character from "./character.js";
/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/
export default class Trump extends Character {
    constructor(scene, x, y) {
        super(scene, x, y)
        this.end = false;
        this.health = 25;
        super.animationName = "trump_quieto";
        this.sprite = scene.physics.add
            .sprite(x, y, "trump", 0)
            .setSize(19, 25)
            .setOffset(10, 10);

        const anims = scene.anims;
        this.sprite.setScale(2);
        anims.create({
            key: "trump_quieto",
            frames: anims.generateFrameNumbers("trump", { start: 0, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
        anims.create({
            key: "trump-walk",
            frames: anims.generateFrameNumbers("trump", { start: 9, end: 16 }),
            frameRate: 8,
            repeat: -1
        });
        anims.create({
            key: "enemy-stand-back",
            frames: anims.generateFrameNumbers("trump", { start: 17, end: 29 }),
            frameRate: 8,
            repeat: -1
        });
        anims.create({
            key: "enemy-stand",
            frames: anims.generateFrameNumbers("trump", { start: 30, end: 37 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, ganador, null, this.scene);
        function ganador(enemy, player) {
            // Define el nivel donde quieres que este el final de trump;
            // Los textos de historia estan hechos para 3 niveles

            if (this.level == 3) {
                this.music.destroy();
                this.scene.start('FinalkillTrump', { score: this.score, vidas: this.player.health });
            }

            else if (!this.hasPlayerReachedTrump) {
                this.hasPlayerReachedTrump = true;
                this.player.freeze();
                this.trump.freeze();
                this.score += 100;
                this.cameras.main.fade(250, 0, 0, 0);
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    this.player.destroy();
                    this.music.destroy();
                    this.scene.restart({ reinicio: false });
                    this.enemy.forEach(enemigo => {
                        enemigo.destroy();
                    });
                    this.trump.destroy();
                });
            }
        }

        this.sprite.anims.play(this.animation, true);



    }

}
