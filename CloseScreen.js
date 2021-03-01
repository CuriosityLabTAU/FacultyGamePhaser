class CloseScreen extends Phaser.Scene {
	constructor(){
		super({ key: 'CloseScreen' });
	};

	preload(){
    };

    create(){
        this.add.text(window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, "GAME FINISHED. CLICK HERE TO CONTINUE", {fontSize: 38});
        this.input.on('pointerup', () => {
            console.log("Clicked");
            this.scene.stop('CloseScreen');
            window.open('questionnaire.html', '_self');
         });
    };
    update()
    {};
}

game.scene.add('CloseScreen', CloseScreen, false);