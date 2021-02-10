class OpenScreen extends Phaser.Scene {
	constructor(){
		super({ key: 'OpenScreen' });
	};
	preload(){
//	    this.load.crossOrigin = "anonymous";
	    this.load.setBaseURL('http://localhost:3000');
        this.load.image("button1", "assets/blue_button01.png");
        this.load.image("button2", "assets/blue_button02.png");
        this.load.image("button3", "assets/blue_button03.png");
    };
    create(){

        this.add.text(200,200,"CLICK TO START", {fontSize: 38});
        this.add.image(350,260,"button1").setInteractive();
        this.input.on('pointerup', () => {
            console.log("Clicked");
            this.scene.stop('OpenScreen');
            this.scene.start('GameScreen');
         });
    };
    update()
    {};
}
