export default class Gun {
 
    constructor(scene, x, y) {

        this.scene = scene;
        this.anguloSprite = 0;

        this.gun = this.scene.physics.add.sprite(x,y+17,'gun').setSize(30, 19).setOffset(17, 11);
       // this.bullet = this.scene.physics.add.sprite(x,y,'bullet');
      
  
      //this.keys = scene.input.keyboard.createCursorKeys();
      this.keys = scene.input.keyboard.addKeys(
        {
          up: Phaser.Input.Keyboard.KeyCodes.W,
          down: Phaser.Input.Keyboard.KeyCodes.S,
          left: Phaser.Input.Keyboard.KeyCodes.A,
          right: Phaser.Input.Keyboard.KeyCodes.D
        });
      this.mouse= this.scene.input.mousePointer;
     this.control = false;
    this.bullet;
     this.scene.musicBulletConfig={
        mute: false,
            volume: 0.001,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
      }
     
    }  
    freeze() {
      this.gun.body.moves = false;
    }
  
    update() {
      const keys = this.keys;
      const speed = 300;
      const gun = this.gun;
      var bulletAudio = this.scene.sound.add("bulletAudio", this.scene.musicBulletConfig);

      var bullet = this.bullet;
      // Stop any previous movement from the last frame
      this.scene.input.on('pointerdown', (pointer) => {
        //for fire again
        bullet = this.scene.physics.add.sprite(gun.x,gun.y,'bullet');
        this.scene.physics.add.collider(bullet, this.scene.groundLayer ,function (bullet) {
          bullet.destroy();
        });
        this.scene.physics.add.collider(bullet, this.scene.stuffLayer,function (bullet) {
          bullet.destroy();
        });
        var angle = Phaser.Math.Angle.Between(gun.x, gun.y, this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY);
        var angleDeg = Phaser.Math.RadToDeg(angle);
        bullet.angle = angleDeg;
        bullet.setFlipY(true);
        this.scene.physics.moveTo(bullet,this.scene.input.x + this.scene.cameras.main.scrollX, this.scene.input.y + this.scene.cameras.main.scrollY,900);
        bulletAudio.play();
      
        
      });
     
      gun.body.setVelocity(0);
      // Horizontal movement
      if (keys.left.isDown) {
       
       gun.body.setVelocityX(-speed);
        //sprite.setFlipX(true);
      } else if (keys.right.isDown) {
        
        gun.body.setVelocityX(speed);
        //sprite.setFlipX(false);
      }
  
      // Vertical movement
      if (keys.up.isDown) {
       
        gun.body.setVelocityY(-speed);
      } else if (keys.down.isDown) {
        
        gun.body.setVelocityY(speed);
        //this.prevVelocity = 1;
      }
  
      // Normalize and scale the velocity so that sprite can't move faster along a diagonal
      gun.body.velocity.normalize().scale(speed);
     // gun.body.velocity.normalize().scale(speed);
  
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
  
     
     
    
      
    
  
      this.scene.input.on('pointermove', function (pointer) {
        
        //Angulos en Radianes
        var angle = Phaser.Math.Angle.Between(gun.x, gun.y, pointer.worldX, pointer.worldY);
        
        var angleDeg = Phaser.Math.RadToDeg(angle);
        gun.angle =angleDeg
        
        if(angleDeg < 0 ) angleDeg = angleDeg*(-1);
       
        if(angleDeg > 90 && angleDeg < 180){
          gun.setFlipY(true);
        }
        else gun.setFlipY(false);
        
      
      }, this);
  
  /*
      if (!keys.left.isDown && !keys.right.isDown && !keys.down.isDown && !keys.up.isDown) {
        sprite.anims.stop();
        if (this.prevVelocity < 0) { 
          sprite.setTexture("characters", 42); 
        } else {
          sprite.setTexture("characters", 23);
        };
      }
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
      */

     
      
     
    }
    destroy() {
      
     this.gun.destroy();
    }
    
}