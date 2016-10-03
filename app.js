var express = require('express');
var bodyParser = require('body-parser');
var superAgent = require('superagent');

var app = express();

// support json encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var privateKey = 'test_pr_demo';

app.post('/verify', function (request, result) {
    console.log('Transaction ID was: ', request.body.transaction_id); // we don't really need this here, is just an example

    superAgent.post('https://checkout.simplepay.ng/v2/payments/card/charge/')
        .set('Content-Type', 'application/json')
        .auth(privateKey, '')
        .send({token: request.body.sp_token, amount: request.body.sp_amount, amount_currency: request.body.sp_currency})
        .end(function (err, res) {
            if (err || !res.ok) {
                if (request.body.sp_status === 'true') {
                    // failed charge call, but card processed
                    result.redirect('/success/');
                } else {
                    result.redirect('/failed/');
                }
            } else {  // even is http status code is 200 we still need to check transaction had issues or not
                if (res.body.response_code === 20000) {
                    result.redirect('/success/');
                } else {
                    result.redirect('/failed/');
                }
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
