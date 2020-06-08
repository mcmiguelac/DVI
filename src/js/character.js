import Weapon from "./weapon.js";

/*
* Una clase que resume nuestra lógica de jugador. Crea, anima y mueve un sprite en
* respuesta a las teclas WASD. 
* método de actualización desde la actualización de la escena
* método de destruccion cuando haya terminado con el jugador
*/
export default class Character {
	constructor(scene, x, y) {
		this.scene = scene;
		this.x = x;
		this.y = y;
		this.anguloSprite = 0;
	}

	set animationName(name) {
		this.animation = name;
	}

	freeze() {
		this.sprite.body.moves = false;
	}

	destroy() {
		this.sprite.destroy();
	}

	ocultar() {
		this.sprite.setDepth(1);
	}

	mostrar() {
		this.sprite.setDepth(4);
	}
}
