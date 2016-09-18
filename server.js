var express = require('express')
  , app = express()
  , fs = require('fs')
  , bodyParser = require('body-parser')
  , firebase = require("firebase");

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', express.static(__dirname));
app.use('/nacl', express.static(__dirname + '/nacl'));
app.use('/scripts', express.static(__dirname + '/node_modules'));

var config = {
  apiKey: "AIzaSyBGRJGQZxvO2Kq65fdpBtH8iQiiRdsew9Y",
  authDomain: "hz16-2e1dc.firebaseapp.com",
  databaseURL: "https://hz16-2e1dc.firebaseio.com",
  storageBucket: "hz16-2e1dc.appspot.com",
  messagingSenderId: "20674400046"
};
firebase.initializeApp(config);

app.post('/', function(req, res) {
  var email = req.body.email
    , password = req.body.password;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function() {
      res.sendStatus(200);
    })
    .catch(function(error) {
      res.sendStatus(404);
    });
})

app.post('/signup', function(req, res) {
  var email = req.body.email
    , password = req.body.password;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function() {
      var db = firebase.database();
      var ref = db.ref("users");
      var n;
      ref.once("value", function(snapshot) {
        n = snapshot.numChildren() + 1;
        ref.child(n.toString()).set({
          email: email,
          password: password
        });
        res.sendStatus(200);
      });
    })
    .catch(function(error) {
      console.log(error)
      res.sendStatus(500);
    });
})

app.listen(app.get('port'), function() {
  console.log('App listening on port ' + app.get('port'));
});
