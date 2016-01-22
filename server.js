/**
 * This file creaste by Ruby is for developing only.
 * By using "node server.js" commend after installing nodejs, you can run the server.
 * And you can access localhost:3000.
 */

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/user', function(req, res) {
  var user = {
    id: 001,
    username: 'ruby',
    region: "nodejs"
  };
  res.json(user);
});

app.post('/user', function(req, res) {
  var user = {
    id: req.body.id,
    username: req.body.username,
    region: req.body.region
  };
  console.log(user);
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
