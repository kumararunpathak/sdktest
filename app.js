var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
    res.redirect('/index.html');
});

app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
});




