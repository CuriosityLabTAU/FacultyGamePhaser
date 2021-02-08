var express = require("express");
var cors = require('cors')
var app = express();
var path = require('path');

app.use(cors())
app.use(express.static('assets'))

app.get('/assets/*', (req, res) => {
    console.log(req.params['0']);
    var filename = path.join(__dirname + '/assets/' + req.params['0']);
    res.sendFile(filename);
})

app.listen(3000, function () {
    console.log("student site server running on port 3000");
})