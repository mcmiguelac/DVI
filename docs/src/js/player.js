/**
 * A class that wraps up our top down player logic. It creates, animates and moves a sprite in
 * response to WASD keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.anguloSprite = 0;
    this.animation = "player-walk";
    //this.prevVelocity = 0;

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

    this.sprite = scene.physics.add
      .sprite(x, y, "characters", 0)
      .setSize(22, 18)
      .setOffset(23, 45);

    this.sprite.anims.play(this.animation);

    //this.keys = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys(
      {
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
      });
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const speed = 300;
    var angleSprite = this.anguloSprite

    // Stop any previous movement from the last frame
    sprite.body.setVelocity(0);

    // Horizontal movement
    if (keys.left.isDown) {
      sprite.body.setVelocityX(-speed);
      //sprite.setFlipX(true);
    } else if (keys.right.isDown) {
      sprite.body.setVelocityX(speed);
      //sprite.setFlipX(false);
    }

    // Vertical movement
    if (keys.up.isDown) {
      sprite.body.setVelocityY(-speed);
      //this.prevVelocity = -1;
    } else if (keys.down.isDown) {
      sprite.body.setVelocityY(speed);
      //this.prevVelocity = 1;
    }

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(speed);

    /*
    // Update the animation last and give left/right/down animations precedence over up animations
    if (keys.left.isDown || keys.right.isDown || keys.down.isDown) {
      sprite.anims.play("player-walk", true);
    } else if (keys.up.isDown) {
      sprite.anims.play("player-walk-back", true);
    } else {
      sprite.anims.stop();

      // If we were moving & now we're not, then pick a single idle frame to use
      if (prevVelocity.y < 0) sprite.setTexture("characters", 42);
      else sprite.setTexture("characters", 23);
    }*/

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
        //console.log(angleDeg + " " + angleSnapDeg);

        switch (angleSprite) {
          case 0:
            this.animation = "player-walk";
            //sprite.anims.play("player-walk", true);
            sprite.setFlipX(false);
            break;
          case 90:
            this.animation = "player-walk";
            //sprite.anims.play("player-walk", true);
            break;
          case 180:
          case -180:
            //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
            this.animation = "player-walk";
            //sprite.anims.play("player-walk", true);
            sprite.setFlipX(true);
            break;

          case -90:
            //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
            this.animation = "player-walk-back";
            //sprite.anims.play("player-walk-back", true);
            break;
        }
      };
    }, this);


    /*if (!keys.left.isDown && !keys.right.isDown && !keys.down.isDown && !keys.up.isDown) {
      sprite.anims.stop();
      if (this.prevVelocity < 0) { 
        sprite.setTexture("characters", 42); 
      } else {
        sprite.setTexture("characters", 23);
      };
    }*/
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
