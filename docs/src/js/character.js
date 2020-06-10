/*Clase padre de todos los personajes*/
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
