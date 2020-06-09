import Weapon from "./weapon.js";
export default class WeaponOne extends Weapon{
    constructor(scene, x, y) {
        super (scene, x, y);
    }
    
    shoot(direccion, x, y) {

        if (this.attackTimerPass) {
            const delayAttackSpeed = 200;
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