
/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/


export default class EnemyNinja {

    constructor(scene, x, y) {
        this.hit = false;
        this.vida = 0;
        this.end = false;
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.anguloSprite = 0;
        this.animation = "ninja-walk";
        this.sprite = scene.physics.add
            .sprite(x, y, "ninja", 0)
            .setSize(14, 25)
            .setOffset(10, 5);

        const anims = scene.anims;
        this.sprite.setScale(1.75);
        anims.create({
            key: "ninja-walk-back",
            frames: anims.generateFrameNumbers("ninja", { start: 0, end: 7 }),
            frameRate: 16,
            repeat: -1
        });
        anims.create({
            key: "ninja-walk",
            frames: anims.generateFrameNumbers("ninja", { start: 8, end: 15 }),
            frameRate: 16,
            repeat: -1
        });
        anims.create({
            key: "ninja-stand",
            frames: anims.generateFrameNumbers("ninja", { start: 16, end: 16 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, function (enemyNinja, player) {
            if (!this.scene.player.inmune) {
                //player.disableBody(true, true);
                this.scene.player.inmune = true;
                this.scene.player.health -= 1;
                if (this.scene.player.health == 0) {
                    this.scene.player.end = true;
                }
                this.scene.time.delayedCall(1000, function () {
                    this.scene.player.inmune = false;
                    this.scene.player.sprite.clearTint();

                }, [], this);
                this.scene.player.sprite.setTint(null);
                this.scene.player.sprite.setTintFill("0xfc2525")
            }


        }, null, this);

        /*this.scene.physics.add.overlap(this.sprite, this.scene.player.sprite, ganador, null, this.scene);
        function ganador(enemy, player)
        {
            this.hasPlayerReachedStairs = true;
            this.player.freeze();
            this.score+=100;
            this.cameras.main.fade(250, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => {
                this.player.destroy();
                this.scene.restart();
                //TODO destoy todos los elementos
            });
        }*/
        /*this.scene.physics.add.overlap(this.sprite, this.scene.player.sprite, ganador, null, this);
        function ganador(enemy, player)
        {
            this.scene.hasPlayerReachedStairs = true;
        }*/

        //TODO no se para que vale esto
        this.scene.physics.add.collider(this.sprite, this.scene.player.weapon.gun);
        this.scene.physics.add.overlap(this.sprite, this.scene.player.weapon.bullets, disparoCertero, null, this);

        function disparoCertero(enemyNinja, bullet) {
            //this.sprite.disableBody(true, true);
            //Puede que en un futuro cuando haya muchos enemigosnnecesitemos hacer un kill
            this.scene.player.weapon.matar(bullet);
            if (this.vida == 0) {
                enemyNinja.disableBody(true, true);
            }
            console.log(this.vida);
            this.vida -= 1;
            this.scene.score += 100;
            if (!this.hit) {
                //player.disableBody(true, true);
                this.hit = true;
                this.scene.time.delayedCall(100, function () {
                    this.hit = false;
                    this.sprite.clearTint();

                }, [], this);
                this.sprite.setTintFill("0xfc2525")
            }
        }
        this.sprite.anims.play('ninja-stand', true);
        
        this.scene.physics.add.collider(this.sprite, this.scene.groundLayer);
        this.scene.physics.add.collider(this.sprite, this.scene.stuffLayer);
        this.contador = 0;
        this.timedEvent = this.scene.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
        function onEvent() {
            this.contador += 1;
            if (this.contador == 50) this.contador = 0; // One second

        }
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
        if (!this.end) {
            const sprite = this.sprite;
            var angleSprite = this.anguloSprite;
            var cercano = false;
            var distancia = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);

            if (distancia > 20 && distancia < 300 && this.contador % 2 == 0) {
                this.scene.time.delayedCall(100, function () {
                    this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite, 300);
                    var SNAP_INTERVAL = Phaser.Math.PI2 / 4;

                    //Angulos en Radianes
                    var angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
                    var angleSnap = Phaser.Math.Snap.To(angle, SNAP_INTERVAL);
                    //Angulos en Grados
                    var angleSnapDeg = Phaser.Math.RadToDeg(angleSnap);
                    var angleDeg = Phaser.Math.RadToDeg(angle);

                    var angleDif = angleSprite - angleDeg;

                    angleSprite = angleSnapDeg;
                    this.anguloSprite = angleSprite;
                    cercano = true;
                    if (cercano) {
                        switch (angleSprite) {
                            case 0:
                                this.sprite.anims.play('ninja-walk', true);
                                sprite.setFlipX(false);
                                break;
                            case 90:
                                this.sprite.anims.play('ninja-walk', true);
                                break;
                            case 180:
                            case -180:
                                this.sprite.anims.play('ninja-walk', true);
                                sprite.setFlipX(true);
                                break;

                            case -90:
                                this.sprite.anims.play('ninja-walk-back', true);
                                break;
                                break;
                        }

                    }
                   
                }, [], this);
                this.sprite.body.setVelocityX(0);
                this.sprite.body.setVelocityY(0);

                //this.scene.physics.moveTo(sprite, this.scene.player.sprite.x, this.scene.player.sprite.y, 50);
            } else {
                cercano = false;
                this.sprite.body.setVelocityX(0);
                this.sprite.body.setVelocityY(0);
                this.sprite.anims.play('ninja-stand', true);
            }

            if (sprite.y < this.scene.player.sprite.y) {
                this.ocultar();
            } else {
                this.mostrar();
            }


            if (this.anguloSprite == -90) {
                // sprite.setTexture("characters", 64);
            } else {
                // sprite.setTexture("characters", 46);
            };
        }
    }

}

