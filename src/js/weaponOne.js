import Weapon from "./weapon.js";
import { datosConfig } from "./config.js";

//Disparo unico representa al arma de un unico disparo cada cierto tiempo 
//y a una velocidad determinada, que sería el arma que tiene nuestro protagonista
export default class WeaponOne extends Weapon {
    constructor(scene, x, y) {
        super(scene, x, y);
    }

    shoot(direccion, x, y) {

        if (this.attackTimerPass) {
            const delayAttackSpeed = datosConfig.playerDelayAttackSpeed;
            const shotVelocity = datosConfig.playerShotVelocity;

            let bullet = this.bullets.getFirstDead(false);
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