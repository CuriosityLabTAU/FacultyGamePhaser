var config = {
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio, //800,
    height: window.innerHeight * window.devicePixelRatio, //600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [], //[GameScreen, CloseScreen], //OpenScreen
//    audio: {
//        disableWebAudio: fal
//    }
};

var game = new Phaser.Game(config);
