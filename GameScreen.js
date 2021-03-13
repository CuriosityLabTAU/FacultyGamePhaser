var text;

class GameScreen extends Phaser.Scene {
	constructor(){
		super({ key: 'GameScreen' });
    };

    preload (){
        this.load.setBaseURL('http://localhost:3000');

        for(let f=0;f<gamestate.subjects.length;f++) {
//            this.load.atlas(gamestate.subjects[f]+ "img", "images/dino.png", "images/dino.json");
            let the_name = '';
            if (items['list'][gamestate.subjects[f]]['img'].hasOwnProperty("0")) {
                gamestate.sub_animate.push(-1);
                the_name = items['list'][gamestate.subjects[f]]['img']["0"];
            } else {
                gamestate.sub_animate.push(-1);
                the_name = items['list'][gamestate.subjects[f]]['img']["1"].replace('_1.png', '');
            }
            console.log(the_name);
            let the_img = "assets/" + items['study'] + "/" + the_name + ".png";
            let the_json = "assets/" + items['study'] + "/" + the_name + ".json";
            this.load.atlas(gamestate.subjects[f]+ "img", the_img, the_json);
            for(let a=1;a<13;a++) {
                this.load.audio(gamestate.subjects[f] + '_' + a, "assets/" + items['study'] + "/" + items['list'][gamestate.subjects[f]]['text'][a]['audio']);
            }
        }
        this.load.image("background", "assets/" + items['study'] + "/background.png")
    }

    create() {
        game_logger('start', 'game', 'now');

        this.time.addEvent({
            delay: 120000,
            callback: ()=> {
                // save the facts that were listened to in session storage to transfer to questionnaire
                sessionStorage.setItem("questions", JSON.stringify(heardFacts));
                sessionStorage.setItem("logger", JSON.stringify(gamestate.game_sequence));
                game_end(this);
            }
        });

        this.add.image(
            window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, 'background')
            .setScale(
                window.innerWidth * window.devicePixelRatio / 1068,
                window.innerHeight * window.devicePixelRatio / 667);

        var font_size = window.innerWidth * window.devicePixelRatio * 0.02;
        var style = { font: "bold " + font_size + "px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle", wordWrap: true, wordWrapWidth: 300, maxLines: 3, align: "center" };
        text = this.add.text(window.innerWidth * window.devicePixelRatio * 0.1, window.innerHeight * window.devicePixelRatio * 0.8, "", style);
        if (items["study"]=="english"||items["study"]=="hebrew"){
            var imgRatio= 0.30;
            var fr= 4;
        };
        if (items["study"]=="dutch"){
            var imgRatio= 0.15;
            var fr= 10;
        };
        gamestate.sub_img = [];
        for(let f=0;f<gamestate.subjects.length;f++) {
            gamestate.sub_img.push(this.physics.add.sprite(config['width'] * gamestate.sub_x[f], config['height'] * gamestate.sub_y[f], gamestate.subjects[f] + "img"))
            gamestate.sub_img[f].displayWidth= window.innerWidth * window.devicePixelRatio * 0.15;
            gamestate.sub_img[f].displayHeight=window.innerHeight * window.devicePixelRatio * imgRatio;
            var sub_a = []
            for(let a=1;a<13;a++) {
                sub_a.push(this.sound.add(gamestate.subjects[f] + '_' + a));
                sub_a[a-1].once('complete', sound_ended);
            }
            gamestate.sub_audio.push(sub_a);
            gamestate.sub_audio_counter.push(0);

            gamestate.sub_text.push(
                this.add.text(gamestate.sub_img[f].x - (items['list'][gamestate.subjects[f]]['label'].length * font_size / 4.0),
                gamestate.sub_img[f].y + gamestate.sub_img[f].displayHeight / 2.0,
                items['list'][gamestate.subjects[f]]['label'], style))
        }
        for(let f=0;f<gamestate.subjects.length;f++) {
            gamestate.sub_img[f].setInteractive();
            this.input.setDraggable(gamestate.sub_img[f]);
            this.input.on('dragstart', function (pointer, gameObject) {
                gameObject.setTint(0xffffff); //0xffff
             });
             this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                var dx = gameObject.x - dragX;
                var dy = gameObject.y - dragY

                gameObject.x = dragX;
                gameObject.y = dragY;

                var f = gameObject.getData('name');
                gamestate.sub_text[f].x -= dx;
                gamestate.sub_text[f].y -= dy;
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
            frames: this.anims.generateFrameNames(gamestate.subjects[f]+"img", {start: 0, end: 12, zeropad: 1, prefix: "Idle_", suffix: ".png"}),
            frameRate: fr,//4, //10,
            repeat: gamestate.sub_animate[f]
            });

            this.anims.create({
            key: gamestate.subjects[f]+"stop",
            frames: this.anims.generateFrameNames(gamestate.subjects[f]+"img", {start: 1, end: 1, zeropad: 1, prefix: "Idle_", suffix: ".png"}),
            frameRate: 0,
            repeat: 0
            })
        }
        this.input.on('gameobjectdown', onObjectClicked);
        this.input.on('gameobjectup', onObjectUp);

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

game.scene.add('GameScreen', GameScreen, true);