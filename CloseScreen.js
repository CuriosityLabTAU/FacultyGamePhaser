class CloseScreen extends Phaser.Scene {
	constructor(){
		super({ key: 'CloseScreen' });
	};

	preload(){
	    this.load.image("background", "assets/" + items['study'] + "/background.png")
    };

    create(){
        this.add.image(
            window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, 'background')
            .setScale(
                window.innerWidth * window.devicePixelRatio / 1068,
                window.innerHeight * window.devicePixelRatio / 667);

        this.add.text(window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, "GOOD JOB!\n", {fontSize: 150, fontStyle: 'bold', color: 'black'}).setOrigin(0.5);
        this.add.text(window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, "\n\n CLICK HERE TO CONTINUE TO QUESTIONNAIRE", {fontSize: 38, fontStyle:'bold',color:"black"}).setOrigin(0.5);
        this.input.on('pointerup', () => {
            console.log("Clicked");
            this.scene.stop('CloseScreen');
            if (items["study"]=="english"){
                window.open('questionnaire.html', '_self');
            };
            if (items["study"]=="hebrew"){
                window.open('Hquestionnaire.html', '_self');
            }
            
         });
    };
    update()
    {};
}

game.scene.add('CloseScreen', CloseScreen, false);