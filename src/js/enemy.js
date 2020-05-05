
/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/
export default class Enemy {
    constructor(scene, x, y) {
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.anguloSprite = 0;
        this.animation = "enemy-walk";
        this.sprite = scene.physics.add
            .sprite(x, y, "characters", 0)
            .setSize(30, 19)
            .setOffset(17, 45);

        const anims = scene.anims;
        anims.create({
            key: "enemy-walk",
            frames: anims.generateFrameNumbers("characters", { start: 46, end: 49 }),
            frameRate: 8,
            repeat: -1
        });
        anims.create({
            key: "enemy-walk-back",
            frames: anims.generateFrameNumbers("characters", { start: 65, end: 68 }),
            frameRate: 8,
            repeat: -1
        });

        var collider = this.scene.physics.add.collider(this.sprite, this.scene.player.sprite, function (sprite) {
            sprite.body.setVelocityX(0);
            sprite.body.setVelocityY(0);
        }, null, this);

        this.scene.physics.add.collider(this.sprite, this.scene.player.weapon.gun);

        this.scene.physics.add.overlap(this.sprite, this.scene.player.weapon.bullets, function (enemy, bullet) {
            this.matar(bullet);
        }, null, this.scene.player.weapon);
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

    update() {
        const sprite = this.sprite;
        var angleSprite = this.anguloSprite;

        var distancia = Phaser.Math.Distance.Between(sprite.x, sprite.y, this.scene.player.sprite.x, this.scene.player.sprite.y);

        if (distancia > 35 && distancia < 100) {
            this.scene.physics.moveToObject(this.sprite, this.scene.player.sprite, 100);
            //this.scene.physics.moveTo(sprite, this.scene.player.sprite.x, this.scene.player.sprite.y, 50);
        } else {
            this.sprite.body.setVelocityX(0);
            this.sprite.body.setVelocityY(0);
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
        if (angleDif > 50 || angleDif < -50) {
            angleSprite = angleSnapDeg;
            this.anguloSprite = angleSprite;

            switch (angleSprite) {
                case 0:
                    this.animation = "enemy-walk";
                    sprite.setFlipX(false);
                    break;
                case 90:
                    this.animation = "enemy-walk";
                    break;
                case 180:
                case -180:
                    this.animation = "enemy-walk";
                    sprite.setFlipX(true);
                    break;

                case -90:
                    this.animation = "enemy-walk-back";
                    break;
            }
        };

        if (this.anguloSprite == -90) {
            sprite.setTexture("characters", 64);
        } else {
            sprite.setTexture("characters", 46);
        };
    }

    destroy() {
        this.sprite.destroy();
    }
}
