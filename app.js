var express = require('express');
var bodyParser = require('body-parser');
var superAgent = require('superagent');

var app = express();

// support json encoded bodies
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var privateKey = 'test_pr_demo';

app.post('/verify', function (request, result) {
    superAgent.post('https://checkout.simplepay.ng/v1/payments/verify/')
        .set('Content-Type', 'application/json')
        .auth(privateKey, '')
        .send({token: request.body.token})
        .end(function (err, res) {
            if (err || !res.ok) {
                result.redirect('/failed/');
            } else {
                result.redirect('/success/');
            }
        });
});

app.get('/success', function (req, res) {
    res.sendFile(__dirname + '/public/success.html');
});

app.get('/failed', function (req, res) {
    res.sendFile(__dirname + '/public/failed.html');
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, function () {
    console.log('Started SimplePay demo app on port 3000!');
});
