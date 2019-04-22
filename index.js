const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/welcome', (req, res) => {
    res.render('welcome');
});

app.post('/', urlencodedParser, (req, res) => {

    const url = 'mongodb://localhost:27017';

    MongoClient.connect(url, async function (err, client) {
        if(err) throw err;
    
        const db = client.db('login');
        const users = await db.collection('data').find({ user: req.body.user }).toArray();

        if(users.length) {
            let [user] = users;
            bcrypt.compare(req.body.pass, user.pass, (err, bool) => {
                if(err) throw err;
                if(bool) {
                    res.redirect('/welcome');
                }
            });
        }
        client.close();
    });
});



app.listen(3000);