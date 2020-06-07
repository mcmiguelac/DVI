
/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/
import Weapon from "./weapon.js";

export default class EnemyShoot {
    
    constructor(scene, x, y) {
        this.health = 25;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.anguloSprite = 0;
        this.animation = "enemy-walk";
        this.sprite = scene.physics.add
            .sprite(x, y, "a", 0)
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

        this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, function (sprite) {
            this.scene.player.sprite.disableBody(true,true);
        }, null, this);
        
       
        
        this.scene.physics.add.collider(this.sprite, this.scene.player.weapon.gun);
        
        this.scene.physics.add.overlap(this.sprite, this.scene.player.weapon.bullets, collectStar, null, this);

        function collectStar (enemy, bullet)
        {
            this.sprite.disableBody(true, true);
            bullet.disableBody(true, true);
        }   
        this.sprite.anims.play('enemy-stand', true);

        this.bullets = this.scene.add.group();
        for (let index = 0; index < 30; index++) {
            let bullet = this.scene.physics.add.sprite(x, y, 'bullet').setDisplaySize(20, 20).setSize(4, 4);
            /*this.scene.physics.add.collider(bullet, this.scene.groundLayer, function (bullet) {
                this.matar(bullet)
            }, null, this);*/
            
            this.scene.physics.add.collider(bullet, this.scene.groundLayer, this.matar, null, this);
            this.scene.physics.add.collider(bullet, this.scene.stuffLayer, this.matar, null, this);

           
            this.bullets.add(bullet);
            this.bullets.killAndHide(bullet);
        }
    }

    freeze() {
        this.sprite.body.moves = false;
    }

    ocultar(){
        this.sprite.setDepth(1);
    }
    
    mostrar(){
        this.sprite.setDepth(4);
    }
    destroy() {
        this.sprite.destroy();
    }
    update() {
        if(this.health < 0) 
        this.sprite.destroy();
        else{
        const sprite = this.sprite;
        var angleSprite = this.anguloSprite;
        var cercano = false;
        var distancia = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
        var angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
        var angleSnap = Phaser.Math.Snap.To(angle, SNAP_INTERVAL);
        //Angulos en Grados
        var angleSnapDeg = Phaser.Math.RadToDeg(angleSnap);
        var angleDeg = Phaser.Math.RadToDeg(angle);

        var angleDif = angleSprite - angleDeg;
        
        angleSprite = angleSnapDeg;
        this.anguloSprite = angleSprite;

        if (distancia > 20 && distancia < 250) {
            this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite, 100);
            cercano = true;
            this.shoot(angleDeg);

            //this.scene.physics.moveTo(sprite, this.scene.player.sprite.x, this.scene.player.sprite.y, 50);
        } else {
            cercano = false;
            this.sprite.body.setVelocityX(0);
            this.sprite.body.setVelocityY(0);
            this.sprite.anims.play('enemy-stand', true);
        }

        if(sprite.y < this.scene.player.sprite.y){
            this.ocultar();
        }else{
            this.mostrar();
        }

        var SNAP_INTERVAL = Phaser.Math.PI2 / 4;

        //Angulos en Radianes
       
        if(cercano){
            switch (angleSprite) {
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
                break;
            }
        
        }
        if (this.anguloSprite == -90) {
           // sprite.setTexture("characters", 64);
        } else {
           // sprite.setTexture("characters", 46);
        };
    }
    }
    shoot( direccion) {
        
        if (this.attackTimerPass) {
            let x = this.scene.input.x + this.scene.cameras.main.scrollX;
            let y = this.scene.input.y + this.scene.cameras.main.scrollY;
            let shotVelocity = 500;

            var bullet = this.bullets.getFirstDead(false);

            //this.scene.physics.add.collider(bullet, this.scene.enemy, this.matar(bullet));

            this.gun.anims.play("shot", true);

            this.revivir(this.gun.x, this.gun.y, bullet);
            bullet.angle = this.gun.angle;
            
            switch(direccion){
                case 0: bullet.body.setVelocityX(shotVelocity); break;
                case 90:  bullet.body.setVelocityY(shotVelocity);break;
                case -90: bullet.body.setVelocityY(-shotVelocity); break;
                case 180:  bullet.body.setVelocityX(-shotVelocity);break;
            }
           // this.scene.physics.moveTo(bullet, x, y, shotVelocity);
            this.attackAudio.play();
            this.attackTimerPass = false;
            this.scene.time.delayedCall(this.attackSpeed, function () {
                this.attackTimerPass = true;
            }, [], this);

            //Matar pasado un tiempo (las balas no llegan lejos)
            this.scene.time.delayedCall(1000, function () {
                this.matar(bullet);
            }, [], this);
        }
    }
    
}
