console.log(items);
var gamestate= {};
gamestate= {};

gamestate.subjects = Object.keys(items['list']);
console.log(gamestate);

//        gamestate.subjects = ['animals', 'history', 'internet', 'environment', 'music', 'space', 'media', 'food', 'body'];
//        gamestate.wav_subjects = ['animals', 'history', 'internet', 'environment', 'music', 'space', 'media', 'food', 'body'];
        gamestate.sub_x = [0.1, 0.4, 0.7, 0.25, 0.55, 0.85, 0.1, 0.4, 0.7];
        gamestate.sub_y = [0.2, 0.2, 0.2, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8];
        gamestate.sub_img = [];
        gamestate.sub_audio = [];
        gamestate.sub_audio_counter = [];
        gamestate.is_playing = null;
        gamestate.animationObject= null;
        gamestate.animationTracker= 0;
        gamestate.sub_music = [];

function onObjectClicked(pointer,gameObject) {
    if (!is_someone_playing()) {
        console.log(gameObject);
        var f = gameObject.getData('name');
        gamestate.animationTracker= f;
        gamestate.animationObject= gameObject;
        console.log(f);
        console.log(gamestate.subjects[f]+"animate");
        gameObject.play(gamestate.subjects[f]+"animate",true)
        var a = gamestate.sub_audio_counter[f];
        if (a < 9) {
            gamestate.sub_audio[f][a].play();
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
    gamestate.animationTracker= f;
    gamestate.animationObject= gameObject;
    console.log(f);
    console.log(gamestate.subjects[f]+"stop");
    gameObject.play(gamestate.subjects[f]+"stop",true)
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

function sound_ended(sound) {
    console.log('completed', sound);
    is_playing = null;

    text.setText("");
};

