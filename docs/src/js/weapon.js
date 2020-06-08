import { datosConfig } from "./config.js";
export default class Weapon {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

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
            this.matar(bullet);
        }
    }
    matar(bullet) {
        this.bullets.kill(bullet);
        bullet.disableBody(true, true);
    }

    revivir(x, y, bullet) {
        bullet.enableBody(true, x, y, true, true);
    }

    setAngle(angle) {
        if (angle < 0) angle = angle * (-1);
    }

    shoot(direccion, x, y) {

        if (this.attackTimerPass) {
            const delayAttackSpeed = 150;
            const shotVelocity = 1000;

            var bullet = this.bullets.getFirstDead(false);
            this.scene.physics.add.collider(bullet, this.scene.enemy, this.matar(bullet));
            this.revivir(x, y, bullet);
            this.attackAudio.play();
            this.attackTimerPass = false;
            this.scene.time.delayedCall(delayAttackSpeed, function () {
                this.attackTimerPass = true;
            }, [], this);

            switch (direccion) {
                case 0: bullet.body.setVelocityX(shotVelocity); bullet.angle = 0; break;
                case 90: bullet.body.setVelocityY(shotVelocity); bullet.angle = 90; break;
                case -90: bullet.body.setVelocityY(-shotVelocity); bullet.angle = 90; break;
                case 180: bullet.body.setVelocityX(-shotVelocity); bullet.angle = 0; break;
            }
        }
    }
}