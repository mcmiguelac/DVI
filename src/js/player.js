import Weapon from "./weapon.js";

/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/
export default class Player {
	constructor(scene, x, y) {
		this.end = false;
		this.health = 6;
		this.scene = scene;
		this.anguloSprite = 0;
		this.animation = "player-stand";
		this.sprite = scene.physics.add
			.sprite(x, y, "characters", 0)
			.setSize(16, 16)
			.setOffset(10, 10)
			.setDepth(2);

		const anims = scene.anims;
		anims.create({
			key: "player-walk",
			frames: anims.generateFrameNumbers("characters", { start: 20, end: 27 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-walk-back",
			frames: anims.generateFrameNumbers("characters", { start: 0, end: 7 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-stand-back",
			frames: anims.generateFrameNumbers("characters", { start: 8, end: 14 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-stand",
			frames: anims.generateFrameNumbers("characters", { start: 15, end: 19 }),
			frameRate: 8,
			repeat: -1
		});
		this.sprite.setScale(1.75);
		
		this.keys = scene.input.keyboard.addKeys(
			{
				up: Phaser.Input.Keyboard.KeyCodes.W,
				down: Phaser.Input.Keyboard.KeyCodes.S,
				left: Phaser.Input.Keyboard.KeyCodes.A,
				right: Phaser.Input.Keyboard.KeyCodes.D,
				Sup: Phaser.Input.Keyboard.KeyCodes.UP,
				Sdown: Phaser.Input.Keyboard.KeyCodes.DOWN,
				Sleft: Phaser.Input.Keyboard.KeyCodes.LEFT,
				Sright: Phaser.Input.Keyboard.KeyCodes.RIGHT
			});

		this.weapon = new Weapon(this.scene, x, y);
		this.sprite.anims.play(this.animation);
	}

	freeze() {
		this.sprite.body.moves = false;
	}

	update() {
		let quieto = false;
		const speed = 300;
		let velocityX = 0;
		let velocityY = 0;
		this.sprite.body.setVelocity(0);
		
		// Horizontal movement
		if(this.keys.left.isDown) {
			if (this.keys.up.isDown) {
				this.sprite.anims.play('player-walk-back', true);
				this.sprite.setFlipX(false);
				this.sprite.body.setVelocityY(-speed);
				velocityY = -speed;
				quieto = false;
			}
			else {this.sprite.anims.play('player-walk', true)
			this.sprite.setFlipX(true);}
			this.sprite.body.setVelocityX(-speed);
			velocityX = -speed;
			quieto = false;
		}
		else if (this.keys.right.isDown) {
			if (this.keys.up.isDown) {
				this.sprite.anims.play('player-walk-back', true)
				this.sprite.body.setVelocityY(-speed);
				this.sprite.setFlipX(true);
				velocityY = -speed;
				quieto = false;
			}
			else{
				this.sprite.anims.play('player-walk', true)
			this.sprite.setFlipX(false);}
			this.sprite.body.setVelocityX(speed);
			velocityX = speed;
			quieto = false;
		}
		
		// Vertical movement
		if (this.keys.up.isDown) {
			this.sprite.anims.play('player-walk-back', true)
			this.sprite.body.setVelocityY(-speed);
			velocityY = -speed;
			quieto = false;
		}
		 else if (this.keys.down.isDown) {
			this.sprite.anims.play('player-walk', true)
			this.sprite.body.setVelocityY(speed);
			velocityY = speed;	
			quieto = false;
		}
		if (!this.keys.left.isDown && !this.keys.right.isDown && !this.keys.down.isDown && !this.keys.up.isDown) {
			this.sprite.anims.play('player-stand', true);
			quieto = true;
		}
		
		if (this.keys.Sleft.isDown) {
			if(!quieto)
				this.sprite.anims.play('player-walk', true)
			this.sprite.setFlipX(true);
			this.weapon.setAngle(180)
			this.weapon.shoot(180)
		}
		else if (this.keys.Sright.isDown) {
			if(!quieto)
				this.sprite.anims.play('player-walk', true)
			this.sprite.setFlipX(false);
			this.weapon.shoot(0)
			this.weapon.setAngle(0)
		}
		
		if (this.keys.Sup.isDown) {
			//if(!quieto)
			//	this.sprite.anims.play('player-walk-back', true)
			this.weapon.shoot(-90)
			this.weapon.setAngle(-90)
		}
		 else if (this.keys.Sdown.isDown) {
			if(!quieto)
				this.sprite.anims.play('player-walk', true)
			this.weapon.shoot(90)
			this.weapon.setAngle(90)
		}
		this.sprite.body.velocity.normalize().scale(speed);
		this.weapon.setVelocity(velocityX, velocityY);
	
	}

	destroy() {
		this.sprite.destroy();
	}
}
