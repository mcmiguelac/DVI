
import LoadScene from './src/js/loadScene.js'
import Game from './src/js/game.js';
import Inicio from './src/js/inicio.js';
import Options from './src/js/options.js';
import Pause from './src/js/pause.js';
import End from './src/js/end.js';
import Intro from './src/js/intro.js';
import FinalKillTrump from './src/js/finalKillTrump.js';
import { datosConfig } from "./src/js/config.js";
var config = {
    title: "Save the Donald",
    version: "0.0.9",
    type: Phaser.AUTO,
    transparent: true,
    width: datosConfig.width,
    height: datosConfig.height,
    pixelArt: true,
    backgroundColor: '#FFFFFF',
    input: { gamepad: true },
    scale: {
        mode: Phaser.Scale.FIT,
        /*mode: Phaser.Scale.RESIZE,*/
        autoCenter: Phaser.Scale.NO_CENTER
    },
    scene: [LoadScene, Inicio, Options, Pause, Game, End, Intro, FinalKillTrump],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    parent:'game'
};
new Phaser.Game(config);
