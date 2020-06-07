
/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/
export default class Enemy {
    
    constructor(scene, x, y) {
        this.end = false;
        this.health = 25;
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

        this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, function (enemy, player) {
            player.disableBody(true,true);
            this.scene.player.end = true;
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

        function disparoCertero(enemy, bullet)
        {
            //this.sprite.disableBody(true, true);
            //Puede que en un futuro cuando haya muchos enemigosnnecesitemos hacer un kill
            enemy.disableBody(true, true);
            this.scene.player.weapon.matar(bullet);
            this.scene.score+=100;
        }   
        this.sprite.anims.play('enemy-stand', true);
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
        if(!this.end){
        const sprite = this.sprite;
        var angleSprite = this.anguloSprite;
        var cercano = false;
        var distancia = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);

        if (distancia > 20 && distancia < 250) {
            this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite, 100);
            cercano = true;
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
        var angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);
        var angleSnap = Phaser.Math.Snap.To(angle, SNAP_INTERVAL);
        //Angulos en Grados
        var angleSnapDeg = Phaser.Math.RadToDeg(angleSnap);
        var angleDeg = Phaser.Math.RadToDeg(angle);

        var angleDif = angleSprite - angleDeg;
        
            angleSprite = angleSnapDeg;
            this.anguloSprite = angleSprite;
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
    
}
