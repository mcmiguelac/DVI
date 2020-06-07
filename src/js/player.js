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
			key: "player-runRight-gunUp",
			frames: anims.generateFrameNumbers("characters", { start: 0, end: 7 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-runRight-gunDown",
			frames: anims.generateFrameNumbers("characters", { start: 8, end: 15 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-runRight-gunRight",
			frames: anims.generateFrameNumbers("characters", { start: 16, end: 23 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-runVertical-gunRight",
			frames: anims.generateFrameNumbers("characters", { start: 24, end: 31 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-runVertical-gunUp",
			frames: anims.generateFrameNumbers("characters", { start: 32, end: 39 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-stand",
			frames: anims.generateFrameNumbers("characters", { start: 40, end: 44 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-runVertical-gunDown",
			frames: anims.generateFrameNumbers("characters", { start: 45, end: 52 }),
			frameRate: 8,
			repeat: -1
		});
		anims.create({
			key: "player-stand-gunDown",
			frames: anims.generateFrameNumbers("characters", { start: 53, end: 57 }),
			frameRate: 5,
			repeat: -1
		});
		anims.create({
			key: "player-stand-gunUp",
			frames: anims.generateFrameNumbers("characters", { start: 58, end: 63 }),
			frameRate: 8,
			repeat: -1
		});
		this.sprite.setScale(1.75);

		this.keys = scene.input.keyboard.addKeys(
			{
				arriba: Phaser.Input.Keyboard.KeyCodes.W,
				abajo: Phaser.Input.Keyboard.KeyCodes.S,
				izq: Phaser.Input.Keyboard.KeyCodes.A,
				der: Phaser.Input.Keyboard.KeyCodes.D,
				fArriba: Phaser.Input.Keyboard.KeyCodes.UP,
				fAbajo: Phaser.Input.Keyboard.KeyCodes.DOWN,
				fIzq: Phaser.Input.Keyboard.KeyCodes.LEFT,
				fDer: Phaser.Input.Keyboard.KeyCodes.RIGHT
			});

		this.weapon = new Weapon(this.scene, this.sprite.x, this.sprite.y);
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

		// Arriba y Abajo

		// if(this.keys.arriba.isDown){
		// 	this.sprite.body.setVelocityY(-speed);
		// 	velocityY = -speed;
		// 	if(this.keys.fArriba.isDown){
		// 		this.sprite.anims.play('player-runVertical-gunUp', true);
		// 	}
		// 	else if(this.keys.fAbajo.isDown){
		// 		this.sprite.anims.play('player-runVertical-gunDown', true);
		// 	}
		// 	else if(this.keys.fIzq.isDown){
		// 		this.sprite.anims.play('player-runVertical-gunRight', true);
		// 		this.sprite.setFlipX(true);
		// 	}
		// 	else if(this.keys.fDer.isDown){
		// 		this.sprite.anims.play('player-runVertical-gunRight', true);
		// 		this.sprite.setFlipX(false);
		// 	}
		// 	else {
		// 		this.sprite.anims.play('player-runVertical-gunUp', true);
		// 		console.log("arriba");
		// 	}
		// }

		// else if(this.keys.abajo.isDown){
		// 	this.sprite.body.setVelocityY(speed);
		// 	velocityY = speed
		// 	if(this.keys.fArriba.isDown){
		// 		this.sprite.anims.play('player-runVertical-gunUp', true);
		// 	}
		// 	else if(this.keys.fAbajo.isDown){
		// 		this.sprite.anims.play('player-runVertical-gunDown', true);
		// 	}
		// 	else if(this.keys.fIzq.isDown){
		// 		this.sprite.anims.play('player-runVertical-gunRight', true);
		// 		this.sprite.setFlipX(true);
		// 	}
		// 	else if(this.keys.fDer.isDown){
		// 		this.sprite.anims.play('player-runVertical-gunRight', true);
		// 		this.sprite.setFlipX(false);
		// 	}
		// 	else this.sprite.anims.play('player-runVertical-gunDown', true);
		// }
		// // Derecha e izquierda
		//  if(this.keys.der.isDown){

		// 	this.sprite.body.setVelocityX(speed);
		// 	velocityX = speed;
		// 	if(this.keys.fArriba.isDown){
		// 		this.sprite.anims.play('player-runRight-gunUP', true);
		// 	}
		// 	else if(this.keys.fAbajo.isDown){
		// 		this.sprite.anims.play('player-runRight-gunDown', true);
		// 	}
		// 	else if(this.keys.fIzq.isDown){
		// 		this.sprite.anims.play('player-runRight-gunRight', true);
		// 		this.sprite.setFlipX(true);
		// 	}
		// 	else if(this.keys.fDer.isDown){
		// 		this.sprite.anims.play('player-runRight-gunRight', true);
		// 			this.sprite.setFlipX(false);
		// 		}
		// 		else {
		// 			this.sprite.anims.play('player-runRight-gunRight', true);
		// 			this.sprite.setFlipX(false);	
		// 		}

		// 	}
		// else if(this.keys.izq.isDown){
		// 	this.sprite.body.setVelocityX(-speed);
		// 	velocityX = -speed;
		// 	if(this.keys.fArriba.isDown){
		// 		this.sprite.anims.play('player-runRight-gunUP', true);
		// 		this.sprite.setFlipX(true);
		// 	}
		// 	else if(this.keys.fAbajo.isDown){
		// 		this.sprite.anims.play('player-runRight-gunDown', true);
		// 		this.sprite.setFlipX(true);
		// 	}
		// 	else if(this.keys.fIzq.isDown){
		// 		this.sprite.anims.play('player-runRight-gunRight', true);
		// 		this.sprite.setFlipX(true);
		// 	}
		// 	else if(this.keys.fDer.isDown){
		// 		this.sprite.anims.play('player-runRight-gunRight', true);
		// 		this.sprite.setFlipX(false);
		// 	}
		// 	else{
		// 		this.sprite.anims.play('player-runRight-gunRight', true);
		// 		this.sprite.setFlipX(true);	
		// 		} 

		//  }



		if (!this.keys.arriba.isDown && !this.keys.abajo.isDown && !this.keys.izq.isDown && !this.keys.der.isDown) {
			animacion = 'player-stand';
			quieto = true;
		}
		this.weapon.visible = false;

		//disparo
		if (this.keys.fArriba.isDown) {
			animacion = 'player-stand-gunUp';
			this.weapon.shoot(-90, this.sprite.x, this.sprite.y);
		}
		else if (this.keys.fAbajo.isDown) {
			animacion = 'player-stand-gunDown';
			this.weapon.shoot(90, this.sprite.x, this.sprite.y)
		}
		else if (this.keys.fIzq.isDown) {
			animacion = 'player-stand';
			this.sprite.setFlipX(true);
			this.weapon.shoot(180, this.sprite.x, this.sprite.y);

		}
		else if (this.keys.fDer.isDown) {
			animacion = 'player-stand';
			this.sprite.setFlipX(false);
			this.weapon.shoot(0, this.sprite.x, this.sprite.y)

		}

		var animacion;

		if (this.keys.arriba.isDown || this.keys.abajo.isDown) {

			if (this.keys.arriba.isDown) {

				this.sprite.body.setVelocityY(-speed);
				animacion = 'player-runVertical-gunUp';
				velocityY = -speed;
			}

			else if (this.keys.abajo.isDown) {
				this.sprite.body.setVelocityY(speed);
				animacion = 'player-runVertical-gunDown';
				velocityY = speed

			}

			if (this.keys.fArriba.isDown) {
				animacion = 'player-runVertical-gunUp';
			}
			else if (this.keys.fAbajo.isDown) {
				animacion = 'player-runVertical-gunDown';
			}
			else if (this.keys.fIzq.isDown) {
				animacion = 'player-runVertical-gunRight';
				this.sprite.setFlipX(true);
			}
			else if (this.keys.fDer.isDown) {
				animacion = 'player-runVertical-gunRight';
				this.sprite.setFlipX(false);
			}


		}
		// Derecha e izquierda
		if (this.keys.der.isDown || this.keys.izq.isDown) {
			var izq = false;
			if (this.keys.der.isDown) {
				izq = true;
				this.sprite.body.setVelocityX(speed);
				animacion = 'player-runRight-gunRight';
				this.sprite.setFlipX(false);
				velocityX = speed;
			}
			else if (this.keys.izq.isDown) {
				animacion = 'player-runRight-gunRight';
				this.sprite.setFlipX(true);
				this.sprite.body.setVelocityX(-speed);
				velocityX = -speed;

			}

			if (this.keys.fArriba.isDown) {
				animacion = 'player-runRight-gunUp';
				if (izq)
					this.sprite.setFlipX(false);
				else this.sprite.setFlipX(true);
			}
			else if (this.keys.fAbajo.isDown) {
				animacion = 'player-runRight-gunDown';
				if (izq)
					this.sprite.setFlipX(false);
				else this.sprite.setFlipX(true);
			}
			else if (this.keys.fIzq.isDown) {
				animacion = 'player-runRight-gunRight';
				if (izq)
					this.sprite.setFlipX(true);
				else this.sprite.setFlipX(true);
			}
			else if (this.keys.fDer.isDown) {
				animacion = 'player-runRight-gunRight';
				if (izq)
					this.sprite.setFlipX(false);
				else this.sprite.setFlipX(false);
			}
			else {
				animacion = 'player-runRight-gunRight';
				if (izq)
					this.sprite.setFlipX(false);
				else this.sprite.setFlipX(true);
			}

		}
		this.sprite.anims.play(animacion, true);



		// else if(this.keys.izq.isDown){
		// 	this.sprite.body.setVelocityX(-speed);
		// 	velocityX = -speed;
		// 	if(this.keys.fArriba.isDown){
		// 		this.sprite.anims.play('player-runRight-gunUp', true);

		// 	}
		// 	else if(this.keys.fAbajo.isDown){
		// 		this.sprite.anims.play('player-runRight-gunDown', true);

		// 	}
		// 	else if(this.keys.fIzq.isDown){
		// 		this.sprite.anims.play('player-runRight-gunRight', true);

		// 	}
		// 	else if(this.keys.fDer.isDown){
		// 		this.sprite.anims.play('player-runRight-gunRight', true);

		// 	}
		// 	else{
		// 		this.sprite.anims.play('player-runRight-gunRight', true);

		// 	} 


		//  if (this.keys.Sleft.isDown) {
		// 	if(!quieto)
		// 		this.sprite.anims.play('player-walk', true)
		// 	this.sprite.setFlipX(true);
		// 	this.weapon.setAngle(180)
		// 	this.weapon.shoot(180)
		// }
		// else if (this.keys.Sright.isDown) {
		// 	if(!quieto)
		// 		this.sprite.anims.play('player-walk', true)
		// 	this.sprite.setFlipX(false);
		// 	this.weapon.shoot(0)
		// 	this.weapon.setAngle(0)
		// }

		// if (this.keys.Sup.isDown) {
		// 	//if(!quieto)
		// 	//	this.sprite.anims.play('player-walk-back', true)
		// 	this.weapon.shoot(-90)
		// 	this.weapon.setAngle(-90)
		// }
		//  else if (this.keys.Sdown.isDown) {
		// 	if(!quieto)
		// 		this.sprite.anims.play('player-walk', true)
		// 	this.weapon.shoot(90)
		// 	this.weapon.setAngle(90)
		// }

		this.sprite.body.velocity.normalize().scale(speed);


	}

	destroy() {
		this.sprite.destroy();
	}
}
