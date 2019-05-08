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

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/welcome', (req, res) => {
    res.render('welcome');
})

app.post('/', urlencodedParser, (req, res) => {
    var url = "mongodb://localhost:27017";

    MongoClient.connect(url, async function (err, client) {
        if (err) throw err;

        var db = client.db('login');

        //MongoDB
        const users = await db.collection('data').find({user: req.body.user}).toArray();
        if (users.length) {
            const [user] = users;
            const isValid = await bcrypt.compare(req.body.pass, user.pass);
            console.log(isValid);
            if(isValid) {
                res.redirect('/welcome');
            } else {
                res.sendFile(__dirname+'/views/' + 'error.html');
                
            }
            
        } else {
            res.sendFile(__dirname+'/views/' + 'error.html');            
        }
    });
});

app.listen(3000);