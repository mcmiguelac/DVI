export default class Weapon {
    constructor(scene, x, y) {
        this.scene = scene;
        this.gun = scene.physics.add
            .sprite(x, y+17, "pistola", 0)
            .setSize(70, 40)
            .setOffset(-10, 10)
            .setDisplaySize(20, 15)
            .setFlipX(true);
            
        var musicAttackConfig = {
            mute: false,
            volume: 0.1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        };

        const anims = scene.anims;
		anims.create({
			key: "shot",
			frames: anims.generateFrameNumbers("pistola", { start: 1, end: 0 }),
			frameRate: 7,
			repeat: 0
        });

        this.scene.physics.add.collider(this.gun, this.scene.groundLayer);
		this.scene.physics.add.collider(this.gun, this.scene.stuffLayer);
        
        this.attackSpeed = 100;
        this.attackTimerPass = true;
        this.attackAudio = this.scene.sound.add("bulletAudio", musicAttackConfig);

        //Pool 50 bullets
        this.bullets = this.scene.add.group();
        for (let index = 0; index < 30; index++) {
            let bullet = this.scene.physics.add.sprite(this.gun.x, this.gun.y, 'bullet').setDisplaySize(7, 4);
            this.scene.physics.add.collider(bullet, this.scene.groundLayer, function (bullet) {
                this.matar(bullet)
            }, null, this);
            this.scene.physics.add.collider(bullet, this.scene.stuffLayer, function (bullet) {
                this.matar(bullet)
            }, null, this);
            this.bullets.add(bullet);
            this.bullets.killAndHide(bullet);
        }
    }

    ocultar(){
        this.gun.setDepth(-1);
    }

    mostrar(){
        this.gun.setDepth(1);
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
        this.gun.body.velocity.normalize().scale(300);
    }

    setPosition(x, y) {
        //TODO Depende del angulo de la pistola, la posicion deberia cambiar
        this.gun.body.reset(x, y+17);
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

            this.gun.anims.play("shot", true);

            this.revivir(this.gun.x, this.gun.y, bullet);
            bullet.angle = this.gun.angle;
            this.scene.physics.moveTo(bullet, this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY, 900);
            this.attackAudio.play();
            this.attackTimerPass = false;
            this.scene.time.delayedCall(this.attackSpeed, function () {
                this.attackTimerPass = true;
            }, [], this);

           //this.gun.setTexture("pistola", 0);
        }
    }
}