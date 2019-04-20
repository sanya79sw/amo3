const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const bcrypt = require('bcrypt');


var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/', urlencodedParser, function (req, res) {
    var url = "mongodb://localhost:27017";

    MongoClient.connect(url, async function (err, client) {
        if (err) throw err;

        var db = client.db('login');

        //MongoDB
        const users = await db.collection('data').find({user: req.body.user}).toArray();
        if (users.length) {
            const [user] = users;
            const isValid = await bcrypt.compare(req.body.pass, user.pass);
            
            
        } else {
            res.end('FAIL');
        }
    });
    res.render('index');
});

app.listen(3000);