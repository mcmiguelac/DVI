import Character from "./character.js";
import WeaponMany from "./weaponMany.js";
import { datosConfig } from "./config.js";
/*
* Una clase que resume nuestra lógica de Trump. Crea, anima y mueve un sprite
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*
* Trump tiene dos comportamientos, si es un nivel cualquiera, no hace nada, 
* solo nos espera a que lo atrapemos, pero si es el nivel final, Trump nos atacará.
*/
export default class Trump extends Character {
    constructor(scene, x, y) {
        super(scene, x, y)
        this.end = false;
        this.hit = false;
        //Variacion con la dificultad
        switch (datosConfig.dificultad) {
            case 1:
                this.health = 50;
                break;
            case 2:
                this.health = 70;
                break;
            case 3:
                this.health = 90;
                break;
            case 4:
                this.health = 120;
                break;
            default:
                this.health = 70;
                break;
        }
        this.tocadoFinal = false;

        //Sprite y animaciones
        super.animationName = "trump_stand";
        this.sprite = scene.physics.add
            .sprite(x, y, "trump", 0)
            .setSize(14, 25).setOffset(10, 5);

        const anims = scene.anims;
        this.sprite.setScale(2);
        anims.create({
            key: "trump_stand",
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
            key: "trump-stand-back",
            frames: anims.generateFrameNumbers("trump", { start: 17, end: 29 }),
            frameRate: 8,
            repeat: -1
        });
        anims.create({
            key: "trump-walk-back",
            frames: anims.generateFrameNumbers("trump", { start: 30, end: 37 }),
            frameRate: 8,
            repeat: -1
        });

        //Disparamos a trump, con todo lo que provoca
        //La vida baja y si baja lo suficiente mata a trump o nada depende del nivel en que se encuentr
        this.scene.physics.add.overlap(this.sprite, this.scene.player.weapon.bullets, disparoCertero, null, this);

        function disparoCertero(trump, bullet) {
            this.scene.player.weapon.matar(bullet);
            if (this.health > 0) {
                this.health -= 1;
                if (!this.hit) {
                    this.hit = true;
                    this.scene.time.delayedCall(50, function () {
                        this.hit = false;
                        this.sprite.clearTint();
                    }, [], this);
                    this.sprite.setTintFill("0xfc2525")
                }
            } else {
                this.sprite.anims.play('trump_stand', true);
                this.scene.textInfo7 = this.scene.add.text(this.scene.scale.width / 2 - 300, this.scene.scale.height / 2 - 100, "Acercate y arresta al malvado Trump", {
                    font: "25px monospace",
                    fill: "#000000",
                    padding: { x: 20, y: 10 }
                }).setScrollFactor(0).setDepth(6);
                this.scene.time.delayedCall(3000, function () {
                    this.textInfo7.setText("");
                }, [], this.scene);
                this.scene.trump.freeze();
            }
        }

        //cuando el juegador toca a trump, si es un nivel cualquiera, pasa al siguiente nivel, pero
        //si es la escena final, pueden ocurrir dos cosas:
        //si ya el protagonista ha matado a trump y lo toca, lo detiene y finaliza el juego ganador
        //si el protagonista lo toca pero trump aun sigue vivo, resta 5 de vida al jugador.
        this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, ganador, null, this.scene);
        function ganador(enemy, player) {
            // Define el nivel donde quieres que este el final de trump;
            // Los textos de historia estan hechos para 3 niveles
            if (this.level == 3) {
                if (!this.hasPlayerReachedTrump && this.trump.health <= 0) {
                    this.hasPlayerReachedTrump = true;
                    this.music.destroy();
                    this.player.destroy();
                    this.enemy.forEach(enemigo => {
                        enemigo.destroy();
                    });
                    this.trump.destroy();
                    this.scene.start('FinalkillTrump', { score: this.score, vidas: this.player.health });
                } else {
                    if (!this.player.inmune) {
                        this.player.inmune = true;
                        this.player.health -= 5;
                        if (this.player.health <= 0) {
                            this.player.end = true;
                        }
                        this.time.delayedCall(1000, function () {
                            this.player.inmune = false;
                            this.player.sprite.clearTint();

                        }, [], this);
                        this.player.sprite.setTint(null);
                        this.player.sprite.setTintFill("0xfc2525")
                    }
                }
            } else {
                if (!this.hasPlayerReachedTrump) {
                    this.hasPlayerReachedTrump = true;
                    this.player.freeze();
                    this.trump.freeze();
                    this.score += 1000;
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
        }

        this.scene.physics.add.collider(this.sprite, this.scene.groundLayer);
        this.scene.physics.add.collider(this.sprite, this.scene.stuffLayer);

        this.sprite.anims.play(this.animation, true);

        //Arma Multiple de trump
        this.weapon = new WeaponMany(this.scene, this.sprite.x, this.sprite.y);

        //Cuando una bala de gtrump da a nuestro personaje, nuestra vida disminuye 
        //y si baja lo suficiente se acaba el juego con el final derrota
        this.scene.physics.add.overlap(this.scene.player.sprite, this.weapon.bullets, disparoCerteroBoss, null, this);

        function disparoCerteroBoss(enemy, bullet) {
            if (!this.scene.player.inmune) {
                this.scene.player.inmune = true;
                this.scene.player.health -= 1;
                if (this.scene.player.health <= 0) {
                    this.scene.player.end = true;
                }
                this.scene.time.delayedCall(1000, function () {
                    this.scene.player.inmune = false;
                    this.scene.player.sprite.clearTint();

                }, [], this);
                this.scene.player.sprite.setTint(null);
                this.scene.player.sprite.setTintFill("0xfc2525")
            }

            this.weapon.matar(bullet);
        }
    }

    update() {

        //Depende del nivel o trum está parado, o nos persigue y nos dispara
        if (!this.scene.player.end && this.scene.level == 3 && this.health > 0) {
            const sprite = this.sprite;
            let cercano = false;
            let distancia = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);

            if ((distancia > 10 && distancia < 200) || this.tocadoFinal) {
                this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite, 50);
                cercano = true;
                if (!this.tocadoFinal) {
                    this.scene.player.health = 20;
                    this.tocadoFinal = true;
                }
                this.weapon.shoot(this.sprite.x, this.sprite.y);
            } else {
                cercano = false;
                this.sprite.body.setVelocityX(0);
                this.sprite.body.setVelocityY(0);
                this.sprite.anims.play('trump_stand', true);
            }

            if (sprite.y < this.scene.player.sprite.y) {
                this.ocultar();
            } else {
                this.mostrar();
            }

            let SNAP_INTERVAL = Phaser.Math.PI2 / 4;

            //Angulos en Radianes
            let angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
            let angleSnap = Phaser.Math.Snap.To(angle, SNAP_INTERVAL);
            //Angulos en Grados
            let angleSnapDeg = Phaser.Math.RadToDeg(angleSnap);
            this.anguloSprite = angleSnapDeg;
            if (cercano) {
                switch (this.anguloSprite) {
                    case 0:
                        this.sprite.anims.play('trump-walk', true);
                        sprite.setFlipX(false);
                        break;
                    case 90:
                        this.sprite.anims.play('trump-walk', true);
                        break;
                    case 180:
                    case -180:
                        this.sprite.anims.play('trump-walk', true);
                        sprite.setFlipX(true);
                        break;

                    case -90:
                        this.sprite.anims.play('trump-walk-back', true);
                        break;
                }
            } else {
                switch (this.anguloSprite) {
                    case 0:
                        this.sprite.anims.play('trump_stand', true);
                        sprite.setFlipX(false);
                        break;
                    case 90:
                        this.sprite.anims.play('trump_stand', true);
                        break;
                    case 180:
                    case -180:
                        this.sprite.anims.play('trump_stand', true);
                        sprite.setFlipX(true);
                        break;

                    case -90:
                        this.sprite.anims.play('trump-stand-back', true);
                        break;
                }
            }
        } else if (this.health <= 0) {
            switch (this.anguloSprite) {
                case 0:
                    this.sprite.anims.play('trump_stand', true);
                    this.sprite.setFlipX(false);
                    break;
                case 90:
                    this.sprite.anims.play('trump_stand', true);
                    break;
                case 180:
                case -180:
                    this.sprite.anims.play('trump_stand', true);
                    this.sprite.setFlipX(true);
                    break;

                case -90:
                    this.sprite.anims.play('trump-stand-back', true);
                    break;
            }
        }
    }

}
