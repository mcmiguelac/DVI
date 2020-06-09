import Weapon from "./weapon.js";
export default class WeaponMany extends Weapon {
    constructor(scene, x, y) {
        super(scene, x, y);
    }

    shoot(x, y) {
        if (this.attackTimerPass) {
            const delayAttackSpeed = Math.random()*2500 + 500;
            const shotVelocity = Math.random()*150 + 150;
            let num = 0;
            while (num < 8) {
                var bullet = this.bullets.getFirstDead(false);
                this.scene.physics.add.collider(bullet, this.scene.player, this.matar(bullet));
                this.revivir(x, y, bullet);
                // this.attackAudio.play();
                this.attackTimerPass = false;
                this.scene.time.delayedCall(delayAttackSpeed, function () {
                    this.attackTimerPass = true;
                }, [], this);

                switch (num) {
                    case 0:
                        bullet.body.setVelocityX(0);
                        bullet.body.setVelocityY(shotVelocity);
                        bullet.angle = 90;
                        break;
                    case 1:
                        bullet.body.setVelocityX(shotVelocity);
                        bullet.body.setVelocityY(shotVelocity);
                        bullet.angle = 45;
                        break;
                    case 2:
                        bullet.body.setVelocityX(shotVelocity);
                        bullet.body.setVelocityY(0);
                        bullet.angle = 0;
                        break;
                    case 3:
                        bullet.body.setVelocityX(shotVelocity);
                        bullet.body.setVelocityY(-shotVelocity);
                        bullet.angle = -45;
                        break;
                    case 4:
                        bullet.body.setVelocityX(0);
                        bullet.body.setVelocityY(-shotVelocity);
                        bullet.angle = 90;
                        break;
                    case 5:
                        bullet.body.setVelocityX(-shotVelocity);
                        bullet.body.setVelocityY(-shotVelocity);
                        bullet.angle = 45;
                        break;
                    case 6:
                        bullet.body.setVelocityX(-shotVelocity);
                        bullet.body.setVelocityY(0);
                        bullet.angle = 0;
                        break;
                    case 7:
                        bullet.body.setVelocityX(-shotVelocity);
                        bullet.body.setVelocityY(shotVelocity);
                        bullet.angle = -45;
                        break;
                }
                bullet.body.velocity.normalize().scale(shotVelocity);
                num++;
            }
        }
    }
}