import Character from "./character.js";
import { datosConfig } from "./config.js";
// Enemigo con apariencia "Killer" que su comportamiento  es perseguirte constantemente

export default class EnemyKiller extends Character{
    constructor(scene, x, y) {
        super(scene, x, y)
        switch (datosConfig.dificultad) {
			case 1:
                this.vida = 2;
				break;
			case 2:
				this.vida = 3;
				break;
			case 3:
                this.vida = 4;
				break;
			case 4:
				this.vida = 5;
				break;
			default:
				this.vida = 3;
				break;
		}

        this.hit = false;
        this.end = false;

        super.animationName ="enemy-stand";
        //selecionamos el sprite correspondiente
        this.sprite = scene.physics.add
            .sprite(x, y, "enemigo", 0)
            .setSize(14, 25)
            .setOffset(10, 5);
        // hacemos el sprite mas grande
        this.sprite.setScale(1.75);
         // animamos los sprites
        scene.anims.create({
            key: "enemy-walk-back",
            frames: scene.anims.generateFrameNumbers("enemigo", { start: 22, end: 29 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: "enemy-walk",
            frames: scene.anims.generateFrameNumbers("enemigo", { start: 30, end: 37 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: "enemy-stand-back",
            frames: scene.anims.generateFrameNumbers("enemigo", { start: 9, end: 21 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: "enemy-stand",
            frames: scene.anims.generateFrameNumbers("enemigo", { start: 0, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
        // logica para hacer que nuestro personaje pierda vida y se ponga en rojo cuando reciba un hit de un enemigo 
        // y se quede durante un intervalo de tiempo invulnerable 
        this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, function (enemy, player) {
            if (!this.scene.player.inmune) {
                this.scene.player.inmune = true;
                this.scene.player.health -= 1;
                if(this.scene.player.health==0){
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

        function disparoCertero(enemy, bullet) {
            this.scene.player.weapon.matar(bullet);
            this.vida -= 1;
            if( this.vida <= 0){
                enemy.disableBody(true, true);
                this.scene.score += 100;
            }
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

    }
    update() {
        if (!this.end) {
            const sprite = this.sprite;
            var cercano = false;
            var distancia = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
            // logica que implemtenta que si el enemigo estan en el rango de accion se mueve hacia el personaje todo el rato
            if (distancia > 20 && distancia < 250) {
                this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite, 100);
                cercano = true;
            } else  {
                cercano = false;
                this.sprite.body.setVelocityX(0);
                this.sprite.body.setVelocityY(0);
                this.sprite.anims.play('enemy-stand', true);
            }

            if (sprite.y < this.scene.player.sprite.y) {
                this.ocultar();
            } else {
                this.mostrar();
            }

            var SNAP_INTERVAL = Phaser.Math.PI2 / 4;

            //Angulos en Radianes
            var angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
            var angleSnap = Phaser.Math.Snap.To(angle, SNAP_INTERVAL);
            //Angulos en Grados
            var angleSnapDeg = Phaser.Math.RadToDeg(angleSnap);
            this.anguloSprite = angleSnapDeg;
            // calculamos la animacion que vamos a usar en funcion del angulo entre en el enemigo y el personaje
            if (cercano) {
                switch (this.anguloSprite) {
                    case 0:
                        this.sprite.anims.play('enemy-walk', true);
                        sprite.setFlipX(false);
                        break;
                    case 90:
                        this.sprite.anims.play('enemy-walk', true);
                        break;
                    case 180:
                    case -180:
                        this.sprite.anims.play('enemy-walk', true);
                        sprite.setFlipX(true);
                        break;

                    case -90:
                        this.sprite.anims.play('enemy-walk-back', true);
                        break;
                }

            }
        }
    }

}
