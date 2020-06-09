import Character from "./character.js";
import { datosConfig } from "./config.js";
/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/

// Enemigo con apariencia "Ninja" que su comportamiento
// es perseguirte por intervalos.
export default class EnemyNinja extends Character{
    constructor(scene, x, y) {
        super(scene, x, y)
        switch (datosConfig.dificultad) {
			case 1:
                this.vida = 1;
				break;
			case 2:
				this.vida = 2;
				break;
			case 3:
			case 4:
				this.vida = 3;
				break;
			default:
				this.vida = 2;
				break;
		}

        this.hit = false;
        this.end = false;

        super.animationName ="ninja-stand";
        //selecionamos el sprite correspondiente
        this.sprite = scene.physics.add
            .sprite(x, y, "ninja", 0)
            .setSize(14, 25)
            .setOffset(10, 5);

        this.sprite.setScale(1.75);
        // animamos los sprites
        scene.anims.create({
            key: "ninja-walk-back",
            frames: scene.anims.generateFrameNumbers("ninja", { start: 0, end: 7 }),
            frameRate: 16,
            repeat: -1
        });
        scene.anims.create({
            key: "ninja-walk",
            frames: scene.anims.generateFrameNumbers("ninja", { start: 8, end: 15 }),
            frameRate: 16,
            repeat: -1
        });
        scene.anims.create({
            key: "ninja-stand",
            frames: scene.anims.generateFrameNumbers("ninja", { start: 16, end: 16 }),
            frameRate: 8,
            repeat: -1
        });
        // logica para hacer que nuestro personaje pierda vida y se ponga en rojo cuando reciba un hit de un enemigo 
        // y se quede durante un intervalo de tiempo invulnerable 
        this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, function (enemyNinja, player) {
            if (!this.scene.player.inmune) {
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
        // logica para hacer que el enmigo pierda vida por hit de bala y se ponga en rojo para que sea mas visual
        this.scene.physics.add.overlap(this.sprite, this.scene.player.weapon.bullets, disparoCertero, null, this);

        function disparoCertero(enemyNinja, bullet) {
            this.scene.player.weapon.matar(bullet);
            if (this.vida == 0) {
                enemyNinja.disableBody(true, true);
                this.scene.score += 100;
            }
            this.vida -= 1;
            if (!this.hit) {
                this.hit = true;
                this.scene.time.delayedCall(100, function () {
                    this.hit = false;
                    this.sprite.clearTint();

                }, [], this);
                this.sprite.setTintFill("0xfc2525")
            }
        }
        this.sprite.anims.play(this.animation, true);
        
        this.scene.physics.add.collider(this.sprite, this.scene.groundLayer);
        this.scene.physics.add.collider(this.sprite, this.scene.stuffLayer);
        this.contador = 0;
        this.timedEvent = this.scene.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
        function onEvent() {
            this.contador += 1;
            // para que los calculos de la logica no se hagan
            // muy grande cada vez que llega a 50 vuelve el contador a 0
            if (this.contador == 50) this.contador = 0; 

        }
    }
    update() {
        if (!this.end) {
            const sprite = this.sprite;
            var cercano = false;
            var distancia = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
            // Logica que implementa que el enemigo se mueva hacia la direccion donde esta el personaje 
            // en este caso cada dos segundos se movera hacia a el protragonista si esta en el rango de accion
            if (distancia > 20 && distancia < 300 && this.contador % 2 == 0) {
                this.scene.time.delayedCall(100, function () {
                    this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite, 300);
                    var SNAP_INTERVAL = Phaser.Math.PI2 / 4;

                    //Angulos en Radianes
                    var angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
                    var angleSnap = Phaser.Math.Snap.To(angle, SNAP_INTERVAL);
                    //Angulos en Grados
                    var angleSnapDeg = Phaser.Math.RadToDeg(angleSnap);
              
                    this.anguloSprite = angleSnapDeg;
                    cercano = true;
                    if (cercano) {
                        switch (this.anguloSprite) {
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
        }
    }

}

