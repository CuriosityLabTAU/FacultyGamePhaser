let server_url = 'http://localhost:3000'
var heardFacts= [];
var gamestate= {};
gamestate.subjects = Object.keys(items['list']);
gamestate.sub_x = [0.1, 0.1, 0.35, 0.65, 0.35, 0.65, 0.9, 0.9, 0.5];
gamestate.sub_y = [0.6, 0.2, 0.2, 0.2, 0.6, 0.6, 0.6, 0.2, 0.4];
gamestate.sub_img = [];
gamestate.sub_animate = [];
gamestate.sub_audio = [];
gamestate.sub_text = [];
gamestate.sub_audio_counter = [];
gamestate.is_playing = null;
gamestate.animationObject= null;
gamestate.animationTracker= 0;
gamestate.sub_music = [];
gamestate.the_end = false;

// for logging
gamestate.game_sequence = {};

function onObjectClicked(pointer,gameObject) {
    if (!is_someone_playing()) {
        var f = gameObject.getData('name');

        game_logger('down', gamestate.subjects[f], {'pos': '(' + gameObject.x + ',' + gameObject.y + ')'});

        gamestate.animationTracker= f;
        gamestate.animationObject= gameObject;
        gameObject.play(gamestate.subjects[f]+"animate",true)

        var a = gamestate.sub_audio_counter[f];
        if (a < 13) {
            console.log('should be playing now', items['list'][gamestate.subjects[f]]['text'][a+1]['audio'].toString().slice(0, -4));
            gamestate.sub_audio[f][a].play();
            game_logger('play', gamestate.subjects[f], items['list'][gamestate.subjects[f]]['text'][a+1]['audio']);
            var num= a+1
            heardFacts.push(gamestate.subjects[f]+num.toString());
            gamestate.is_playing = [gameObject.getData('name'), a];
            gamestate.sub_audio_counter[f] += 1;
            text.setText(items['list'][gamestate.subjects[f]]['text'][a+1]["text"]);
        }

    }
};

function onObjectUp(pointer,gameObject) {
    console.log(gameObject);
    var f = gameObject.getData('name');

    game_logger('up', gamestate.subjects[f], {'pos': '(' + gameObject.x + ',' + gameObject.y + ')'});

    gamestate.animationTracker= f;
    gamestate.animationObject= gameObject;
    console.log(f);
    console.log(gamestate.subjects[f]+"stop");
//    gameObject.play(gamestate.subjects[f]+"stop",true)
};

function is_someone_playing() {
    for(let f=0;f< gamestate.subjects.length;f++) {
        for(let a=1;a<9;a++) {
            if (gamestate.sub_audio[f][a-1].isPlaying) {
                return true;
            }
        }
    }
    return false;
};

function sound_ended(sound, x) {
    console.log('completed', sound);
    var the_key = sound.key.split('_');
    var the_subject = the_key[0];
    var f = gamestate.subjects.findIndex((e) => e === the_subject);
    var a = parseInt(the_key[1]);
    game_logger('stop', the_subject, items['list'][the_subject]['text'][a]['audio']);

    try{
        gamestate.sub_img[f].play(the_subject+"stop",true)
        gamestate.is_playing = null;
        text.setText("");
        if(this_is_the_end()) {
            log_data();
        }
    } catch {
        console.log('probably end game');
    }
};

function game_logger(action, obj, comment) {
    let data = {
        'action': action,
        'obj': obj,
        'comment': comment,
    }
    var now = new Date();
    var now_str = (now*1000).toString();
    var t = 0;
    while (gamestate.game_sequence.hasOwnProperty(now_str)) {
        t += 1;
        now_str = (now*1000 + t).toString();
    }
    gamestate.game_sequence[now_str] = data;
    console.log(gamestate.game_sequence);
}

function this_is_the_end() {
    console.log('this is the end', gamestate.is_playing, gamestate.the_end)
    if(gamestate.is_playing === null && gamestate.the_end) {
        return true;
    } else {
        return false;
    }
}

function game_end(scene) {
    console.log('game end');
    gamestate.the_end = true;
    gamestate.game_scene = scene;
    if(this_is_the_end()) {
        log_data();
    }
}

async function log_data(){
    console.log('log data');
    game_logger('end', 'game', 'now');

    const response = await fetch(server_url + "/log/" + JSON.stringify(gamestate.game_sequence));
    const myres = await response.text();
    console.log(myres);

    gamestate.game_scene.scene.stop("GameScreen");
    gamestate.game_scene.scene.start("CloseScreen");

    return myres;
}

//    for(let f=0;f< gamestate.subjects.length;f++) {
//        for(let a=1;a<9;a++) {
//            if (gamestate.sub_audio[f][a-1].isPlaying) {
//                game_logger('stop', gamestate.subjects[f], items['list'][gamestate.subjects[f]]['text'][a]['audio']);
//            }
//        }
//    }


//    const response = await fetch(server_url + "/end");
//    const myres = await response.text();
//    console.log(myres);
//    return myres;
//}