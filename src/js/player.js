import Weapon from "./weapon.js";

/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/
export default class Player {
	constructor(scene, x, y) {
		this.scene = scene;
		this.anguloSprite = 0;
		this.animation = "player-walk";
		this.sprite = scene.physics.add
			.sprite(x, y, "characters", 0)
			.setSize(30, 19)
			.setOffset(17, 45);

		const anims = scene.anims;
		anims.create({
			key: "player-walk",
			frames: anims.generateFrameNumbers("characters", { start: 23, end: 26 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-walk-back",
			frames: anims.generateFrameNumbers("characters", { start: 42, end: 45 }),
			frameRate: 8,
			repeat: -1
		});

		this.sprite.anims.play(this.animation);

		this.keys = scene.input.keyboard.addKeys(
			{
				up: Phaser.Input.Keyboard.KeyCodes.W,
				down: Phaser.Input.Keyboard.KeyCodes.S,
				left: Phaser.Input.Keyboard.KeyCodes.A,
				right: Phaser.Input.Keyboard.KeyCodes.D
			});

		this.weapon = new Weapon(this.scene, x, y);
	}

	freeze() {
		this.sprite.body.moves = false;
	}

	update() {
		const keys = this.keys;
		const sprite = this.sprite;
		const speed = 300;
		var angleSprite = this.anguloSprite;
		let velocityX = 0;
		let velocityY = 0;

		sprite.body.setVelocity(0);

		// Horizontal movement
		if (keys.left.isDown) {
			sprite.body.setVelocityX(-speed);
			velocityX = -speed;

		} else if (keys.right.isDown) {
			sprite.body.setVelocityX(speed);
			velocityX = speed;
		}

		// Vertical movement
		if (keys.up.isDown) {
			sprite.body.setVelocityY(-speed);
			velocityY = -speed;
		} else if (keys.down.isDown) {
			sprite.body.setVelocityY(speed);
			velocityY = speed;
		}

		sprite.body.velocity.normalize().scale(speed);
		//this.weapon.setPosition(this.sprite.x, this.sprite.y)
		this.weapon.setVelocity(velocityX, velocityY);

		var SNAP_INTERVAL = Phaser.Math.PI2 / 4;

		this.scene.input.on('pointermove', function (pointer) {

			//Angulos en Radianes
			var angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, pointer.worldX, pointer.worldY);
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
						this.animation = "player-walk";
						sprite.setFlipX(false);
						this.weapon.mostrar();
						break;
					case 90:
						this.animation = "player-walk";
						this.weapon.mostrar();
						break;
					case 180:
					case -180:
						this.animation = "player-walk";
						sprite.setFlipX(true);
						this.weapon.mostrar();
						break;

					case -90:
						this.animation = "player-walk-back";
						this.weapon.ocultar();
						break;
				}
			};

			//Angulo bala
			this.weapon.setAngle(angleDeg);
		}, this);

		//Disparar
		this.scene.input.on('pointerdown', function (pointer) {
			this.weapon.shoot();
		}, this);

		if (!keys.left.isDown && !keys.right.isDown && !keys.down.isDown && !keys.up.isDown) {
			sprite.anims.stop();
			if (this.anguloSprite == -90) {
				sprite.setTexture("characters", 41);
			} else {
				sprite.setTexture("characters", 23);
			};
		} else {
			sprite.anims.play(this.animation, true);
		}
	}

	destroy() {
		this.sprite.destroy();
	}
}
