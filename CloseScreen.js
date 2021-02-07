class CloseScreen extends Phaser.Scene {
	constructor(){
		super({ key: 'CloseScreen' });
	};

	preload(){
    };

    create(){
        this.add.text(200,200,"THE END", {fontSize: 38});
    };
    update()
    {};
}