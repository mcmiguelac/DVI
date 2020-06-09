
// Variable que utilizamos para la configuracion inicial 
export var datosConfig = {
    music: true,
    width: 1024, // altura y ancho de la escena.
    height: 512, // 
    dungeon: {
        width: 30, // ancho maximo del nivel
        height: 30, // altura  maxima del nivel
        doorPadding: 3,
        rooms: { 
            width: { min: 6, max: 18 }, // tamaño maximo y minimo de las habitaciones
            height: { min: 7, max: 10 }
        }
    },
    // configuracion de la musica
    musicConfig: {
        mute: false,
        volume: 0.05,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
    },
    dificultad: 1
}