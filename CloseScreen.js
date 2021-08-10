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
        if (items["study"]== "english"){
            var text1= "GOOD JOB!\n";
            var text2= "\n\n CLICK HERE TO CONTINUE TO QUESTIONNAIRE";
            var HTMLpath= 'questionnaire.html';
        };
        if (items["study"]== "hebrew"){
            var text1= "!כל הכבוד\n";
            var text2= "\n\n לחצו כאן להמשך המשחק";
            var HTMLpath= 'Hquestionnaire.html';
        };
        this.add.text(window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, text1, {fontSize: 150, fontStyle: 'bold', color: 'black'}).setOrigin(0.5);
        this.add.text(window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, text2, {fontSize: 38, fontStyle:'bold',color:"black"}).setOrigin(0.5);
        this.input.on('pointerup', () => {
            console.log("Clicked");
            this.scene.stop('CloseScreen');
            window.open(HTMLpath, '_self')
        });
    };
    update()
    {};
}

game.scene.add('CloseScreen', CloseScreen, false);