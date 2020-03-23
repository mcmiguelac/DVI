export default class Weapon {
    constructor(scene, x, y) {
        this.scene = scene;
        this.gun = this.scene.physics.add.sprite(x, y + 17, 'gun').setSize(1, 1);
        var musicAttackConfig = {
            mute: false,
            volume: 0.1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        };
        this.attackSpeed = 100;
        this.attackTimerPass = true;
        this.attackAudio = this.scene.sound.add("bulletAudio", musicAttackConfig);

        //Pool 50 bullets
        this.bullets = this.scene.add.group();
        for (let index = 0; index < 30; index++) {
            let bullet = this.scene.physics.add.sprite(this.gun.x, this.gun.y, 'bullet');
            this.scene.physics.add.collider(bullet, this.scene.groundLayer, function (bullet) {
                this.matar(bullet)
            }, null, this);
            this.scene.physics.add.collider(bullet, this.scene.stuffLayer, function (bullet) {
                this.matar(bullet)
            }, null, this);
            this.bullets.add(bullet);
            this.bullets.killAndHide(bullet);
        }

        this.gun.body.velocity.normalize().scale(300);
    }

    matar(bullet) {
        this.bullets.killAndHide(bullet);
    }

    revivir(x, y, bullet) {
        bullet.enableBody(true, x, y, true, true);
    }

    setVelocity(xSpeed, ySpeed) {
        this.gun.body.setVelocityX(xSpeed);
        this.gun.body.setVelocityY(ySpeed);
    }

    setPosition(x, y) {
        this.gun.body.reset(x, y + 17);
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

    shoot() {
        if (this.attackTimerPass) {
            var bullet = this.bullets.getFirstDead(false);
            this.revivir(this.gun.x, this.gun.y, bullet);
            bullet.angle = this.gun.angle;
            this.scene.physics.moveTo(bullet, this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY, 900);
            this.attackAudio.play();
            this.attackTimerPass = false;
            this.scene.time.delayedCall(this.attackSpeed, function () {
                this.attackTimerPass = true;
            }, [], this);
        }
    }
}