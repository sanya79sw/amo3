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

    MongoClient.connect(url, function (err, client) {
        if (err) throw err;

        var db = client.db('login');
        
        //MongoDB
        db.collection('data').findOne({}, function (err, result) {

            if (err) throw err;
            console.log(`Login: ${req.body.user}`);
            console.log(`Password: ${req.body.pass}`);
            
            //Crypt password
            bcrypt.compare(req.body.pass, result.pass, (err, res) => {
                if (err) throw err;
                if(req.body.user === result.user && res == true) {
                    console.log('Welcome');
                } else console.log("User name or password incorrect");
            });
            client.close();
        });
    });
    res.render('index');
});

app.listen(3000);