var strftime = require('strftime') // not required in browsers
var fs = require('fs');

var express = require("express");
var cors = require('cors');
var app = express();
var path = require('path');

var the_log = {};
var start_time = null;

app.use(cors())
app.use(express.static('assets'))

app.get('/assets/*', (req, res) => {
    console.log('Sending ', req.params['0']);
    var filename = path.join(__dirname + '/assets/' + req.params['0']);
    res.sendFile(filename);
})

function get_current_time() {
    var now = new Date();
    var ms = (now*1000).toString().slice(-9, -3);
    var the_time = strftime('%Y_%m_%d_%H_%M_%S_', now) + ms;
    return the_time;
}

app.get('/log/*', (req, res) => {
    var log = req.path.replace('/log/', '');
    log = log.split('%22').join('"');
    log = log.split('%7B').join('{');
    log = log.split('%7D').join('}');
    console.log('json', log);
    log = JSON.parse(log);
    add_log(log);
})

app.get('/start/*', (req, res) => {
    start_time = get_current_time()

    var participant_number = req.path.replace('/start/', '');
    add_log({
        'action': 'text',
        'obj': 'subject',
        'comment': participant_number.split('%22').join('')
    })

    console.log(the_log);
    start.push(get_current_time());

    res.send('received');
})

app.get('/end', (req, res) => {
    save_log();
    res.send('Saved');
})

app.listen(3000, function () {
    console.log("student site server running on port 3000");
})

var game_sequence = [];
var start = [];

function add_log(log) {
    var the_time = get_current_time();
    log['time'] = the_time
    the_log[the_time] = log;

    if (log['action'] === 'down') {
        if (game_sequence.length == 0) {  // for t0
            game_sequence.push([log['obj'], log['time']]);
            add_log({
                'action': 'data',
                'obj': 't0',
                'comment': the_time + ',' + start[0]
            })
        }
    }

    save_log();
}

function save_log() {
    fs.writeFile('data/' + start_time + '.log', JSON.stringify(the_log), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}