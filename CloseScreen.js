class CloseScreen extends Phaser.Scene {
	constructor(){
		super({ key: 'CloseScreen' });
	};

	preload(){
    };

    create(){
        this.add.text(200,200,"GAME COMPLETED", {fontSize: 38});
    };
    update()
    {};
}