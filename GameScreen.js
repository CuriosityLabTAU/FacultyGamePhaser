var text;

class GameScreen extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScreen' });
    };

    preload (){
        for(let f=0;f<gamestate.subjects.length;f++) {
//            this.load.atlas(gamestate.subjects[f]+ "img", "images/dino.png", "images/dino.json");
            let the_name = items['list'][gamestate.subjects[f]]['img']["1"].replace('_1.png', '');
            console.log(the_name);
            let the_img = "assets/" + items['study'] + "/" + the_name + ".png";
            let the_json = "assets/" + items['study'] + "/" + the_name + ".json";
            this.load.atlas(gamestate.subjects[f]+ "img", the_img, the_json);
            for(let a=1;a<9;a++) {
                this.load.audio(gamestate.subjects[f] + a, "assets/" + items['study'] + "/" + items['list'][gamestate.subjects[f]]['text'][a]['audio'])
            }
        }
        this.load.image("background", "assets/" + items['study'] + "/background.png")
    }

    create() {
        this.time.addEvent({
            delay: 120000,
            callback: ()=> {
                this.scene.stop("GameScreen");
                this.scene.start("CloseScreen");
            }
        });
//
        this.add.image(400, 300, 'background').setScale(1.7,1.6);

        var style = { font: "bold 24px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: 300, maxLines: 2, align: "center" };
        text = this.add.text(0, 520, "", style);

        gamestate.sub_img = [];
        for(let f=0;f<gamestate.subjects.length;f++) {
            gamestate.sub_img.push(this.physics.add.sprite(config['width'] * gamestate.sub_x[f], config['height'] * gamestate.sub_y[f], gamestate.subjects[f] + "img"))
            gamestate.sub_img[f].displayWidth= 150
            gamestate.sub_img[f].displayHeight=100
            var sub_a = []
            for(let a=1;a<9;a++) {
                sub_a.push(this.sound.add(gamestate.subjects[f] + a));
            }
            gamestate.sub_audio.push(sub_a);
            gamestate.sub_audio_counter.push(0);
        }
        for(let f=0;f<gamestate.subjects.length;f++) {
            gamestate.sub_img[f].setInteractive();
            this.input.setDraggable(gamestate.sub_img[f]);
            this.input.on('dragstart', function (pointer, gameObject) {
                gameObject.setTint(0xff0000);
             });
             this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                gameObject.x = dragX;
                gameObject.y = dragY;
             });
             this.input.on('dragend', function (pointer, gameObject) {
                gameObject.clearTint();
            });
            gamestate.sub_img[f].name = gamestate.subjects[f];
            console.log(f);
            gamestate.sub_img[f].setData('name', f);
        };

        for(let f=0;f<gamestate.subjects.length;f++){
            this.anims.create({
            key: gamestate.subjects[f]+"animate",
            frames: this.anims.generateFrameNames(gamestate.subjects[f]+"img", {start: 0, end: 9, zeropad: 1, prefix: "Idle_", suffix: ".png"}),
            frameRate: 8,
            repeat: -1
            });

            this.anims.create({
            key: gamestate.subjects[f]+"stop",
            frames: this.anims.generateFrameNames(gamestate.subjects[f]+"img", {start: 0, end: 0, zeropad: 1, prefix: "Idle_", suffix: ".png"}),
            frameRate: 0,
            repeat: 0
            })
        }
        this.input.on('gameobjectdown', onObjectClicked);

    };

    update() {
        if (gamestate.animationObject!=null) {
            if (!is_someone_playing()) {
                gamestate.sub_img[gamestate.animationTracker].anims.pause()
                //gamestate.animationObject.play(gamestate.subjects[gamestate.animationTracker]+"stop",true)
            }
        }
    };
};