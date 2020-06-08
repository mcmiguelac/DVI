import { datosConfig } from "./config.js";
export default class Weapon {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;


        //No bajar mucho o causa fallo.
        this.attackTimerPass = true;

        const musicAttackConfig = datosConfig.musicConfig;
        musicAttackConfig.loop = false;
        this.attackAudio = this.scene.sound.add("bulletAudio", musicAttackConfig);

        //Pool 50 bullets
        this.bullets = this.scene.add.group();

        for (let index = 0; index < 50; index++) {
            let bullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet').setDisplaySize(20, 20).setSize(4, 4);

            this.scene.physics.add.collider(bullet, this.scene.groundLayer, this.matar, null, this);
            this.scene.physics.add.collider(bullet, this.scene.stuffLayer, this.matar, null, this);

            this.bullets.add(bullet);
            //this.bullets.killAndHide(bullet);
            this.matar(bullet);
        }
    }
    matar(bullet) {
        //this.bullets.killAndHide(bullet);
        this.bullets.kill(bullet);
        //bullet.body.setEnable(false);
        bullet.disableBody(true, true);
    }

    revivir(x, y, bullet) {
        bullet.enableBody(true, x, y, true, true);
    }

    setAngle(angle) {
        this.gun.angle = angle;
        if (angle < 0) angle = angle * (-1);
        if (angle > 90 && angle < 180) {
            this.gun.setFlipY(true);
        } else {
            this.gun.setFlipY(false);
        }
    }

    shoot(direccion, x, y) {

        if (this.attackTimerPass) {
            const delayAttackSpeed = 150;
            let shotVelocity = 1000;

            var bullet = this.bullets.getFirstDead(false);
            this.scene.physics.add.collider(bullet, this.scene.enemy, this.matar(bullet));
            this.revivir(x, y, bullet);
            // this.scene.physics.moveTo(bullet, x, y, shotVelocity);
            this.attackAudio.play();
            this.attackTimerPass = false; 
            this.scene.time.delayedCall(delayAttackSpeed, function () {
                this.attackTimerPass = true;
               // this.matar(bullet);
            }, [], this);

            //Matar pasado un tiempo (las balas no llegan lejos)
            // this.scene.time.delayedCall(1000, function () {
            //     this.matar(bullet);
            // }, [], this);

            switch (direccion) {
                case 0: bullet.body.setVelocityX(shotVelocity); bullet.angle = 0; break;
                case 90: bullet.body.setVelocityY(shotVelocity); bullet.angle = 90; break;
                case -90: bullet.body.setVelocityY(-shotVelocity); bullet.angle = 90; break;
                case 180: bullet.body.setVelocityX(-shotVelocity); bullet.angle = 0; break;
            }
        }
    }
}