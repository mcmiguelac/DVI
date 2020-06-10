import { datosConfig } from "./config.js";

//Clase padre del arma
export default class Weapon {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.attackTimerPass = true;

        const musicAttackConfig = datosConfig.musicConfig;
        musicAttackConfig.loop = false;
        this.attackAudio = this.scene.sound.add("bulletAudio", musicAttackConfig);

        //Pool 200 bullets
        this.bullets = this.scene.add.group();

        for (let index = 0; index < 200; index++) {
            let bullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet').setDisplaySize(20, 20).setSize(4, 4);

            this.scene.physics.add.collider(bullet, this.scene.groundLayer, this.matar, null, this);
            this.scene.physics.add.collider(bullet, this.scene.stuffLayer, this.matar, null, this);
            this.scene.physics.add.collider(bullet, this.scene.stuffLayerAtravesable, this.matar, null, this);

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
}