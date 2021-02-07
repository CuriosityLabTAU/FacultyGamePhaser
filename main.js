var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [OpenScreen, GameScreen, CloseScreen],
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);
