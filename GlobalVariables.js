console.log(items);
let server_url = 'http://localhost:3000'

var gamestate= {};
gamestate= {};

gamestate.subjects = Object.keys(items['list']);
console.log(gamestate);

//        gamestate.subjects = ['animals', 'history', 'internet', 'environment', 'music', 'space', 'media', 'food', 'body'];
//        gamestate.wav_subjects = ['animals', 'history', 'internet', 'environment', 'music', 'space', 'media', 'food', 'body'];
        gamestate.sub_x = [0.1, 0.1, 0.35, 0.65, 0.35, 0.65, 0.9, 0.9, 0.5];
        gamestate.sub_y = [0.6, 0.2, 0.2, 0.2, 0.6, 0.6, 0.6, 0.2, 0.4];

        gamestate.sub_img = [];
        gamestate.sub_audio = [];
        gamestate.sub_text = [];
        gamestate.sub_audio_counter = [];
        gamestate.is_playing = null;
        gamestate.animationObject= null;
        gamestate.animationTracker= 0;
        gamestate.sub_music = [];

        // for logging
        gamestate.game_sequence = [];

function onObjectClicked(pointer,gameObject) {
    if (!is_someone_playing()) {
        console.log('gameObject', gameObject);
        var f = gameObject.getData('name');

        game_logger('down', gamestate.subjects[f], {'pos': '(' + gameObject.x + ',' + gameObject.y + ')'});

        gamestate.animationTracker= f;
        gamestate.animationObject= gameObject;
        console.log('f', f);
        console.log('animate', gamestate.subjects[f]+"animate");
        gameObject.play(gamestate.subjects[f]+"animate",true)

        var a = gamestate.sub_audio_counter[f];
        if (a < 9) {
            gamestate.sub_audio[f][a].play();
            game_logger('play', gamestate.subjects[f], items['list'][gamestate.subjects[f]]['text'][a+1]['audio']);

            is_playing = [gameObject.getData('name'), a];
            gamestate.sub_audio_counter[f] += 1;
        }
        console.log(items['list'][gamestate.subjects[f]]);
        console.log('a', a+1);
        text.setText(items['list'][gamestate.subjects[f]]['text'][a+1]["text"]);

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
    console.log('the_key', the_key);

    game_logger('stop', the_subject, items['list'][the_subject]['text'][a]['audio']);

    gamestate.sub_img[f].play(the_subject+"stop",true)

    is_playing = null;
    text.setText("");



};

async function game_logger(action, obj, comment) {
    let data = {
        'action': action,
        'obj': obj,
        'comment': comment
    }
    const response = await fetch(server_url + "/log/" + JSON.stringify(data));
    const myres = await response.text();
    return myres;
}

async function game_end() {
    const response = await fetch(server_url + "/end");
    const myres = await response.text();
    console.log(myres);
    return myres;
}