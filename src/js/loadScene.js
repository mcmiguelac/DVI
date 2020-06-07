

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'loadScene' });
    }

    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        var width = this.scale.width;
        var height = this.scale.height;

        progressBox.fillStyle(0x000000, 0.6);
        progressBox.fillRect(width / 2 - 260, height / 2 + 15, 520, 50);

        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 20,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#000000'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 40,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#FFFFFF'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 100,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#000000'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x000000, 1);
            progressBar.fillRect(width / 2 - 250, height / 2 + 25, 500 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        this.loadAll();
    }

    loadAll() {
        //Menu Principal
        this.load.image("titulo", "assets/img/img/titulo.png");
        this.load.image("finTirania", "assets/img/img/finTirania.png");
        this.load.image("background", "assets/img/img/title_bg.png");
        this.load.image("final", "assets/img/img/title_bg_muerte.png");
        this.load.image("honor", "assets/img/img/honorBW.png");
        this.load.image("banderaNegra", "assets/img/img/flagsinfondoBW.png");
        this.load.image("trumpDead", "assets/img/img/trumpDead2.png");
        for (let index = 1; index <= 10; index++) {
            let name = "mini " + index;
            this.load.image(name, "assets/img/img/" + name + ".png");
        }

        //Game
        this.load.audio("backgroundMusic", "assets/audio/Capt-America-Theme.mp3");
        this.load.audio("musicaIntro", "assets/audio/musicaIntro.mp3");
        this.load.audio("himno", "assets/audio/himno.mp3");

        this.load.image("tiles", "assets/tilesets/tileset.png");

        this.load.spritesheet(
            "characters",
            "assets/spritesheets/definitivo.png",
            {
                frameWidth: 32,
                frameHeight: 32
            }
        );
        this.load.spritesheet(
            "enemigo",
            "assets/spritesheets/enemigo.png",
            {
                frameWidth: 32,
                frameHeight: 32
            }
        );
        this.load.spritesheet(
            "vidaPlayer",
            "assets/spritesheets/healthbar.png",
            {
                frameWidth: 660,
                frameHeight: 184
            }
        );
        


        //Menú ajustes
        this.load.image("flagLGif", "assets/img/img/flagL.gif");
        this.load.image("flagRGif", "assets/img/img/flagR.gif");

        //Arma
        this.load.audio("bulletAudio", ["assets/audio/laser1.ogg", "assets/audio/pistolShoot.wav"])
        this.load.spritesheet(
            "pistola",
            "assets/spritesheets/pistola_anim.png",
            {
                frameWidth: 48,
                frameHeight: 32
            }
        );
        this.load.image("bullet", "assets/spritesheets/bullet_1.png");



        this.load.text('TextoInicio', 'assets/texts/textoInicio.txt');
        //cargar fuentes
    }   

    create() {
        this.scene.start('inicio');
    }
}