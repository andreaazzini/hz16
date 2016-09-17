var express = require('express')
  , app = express()
  , fs = require('fs')
  , bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.post('/images', function (req, res) {
  /*console.log(req.body.image)
  console.log(req.body.imgBase64)
  fs.readFile(req.files.image.path, function (err, data) {
    var newPath = __dirname + "/uploads/canvas.png";
    fs.writeFile(newPath, data, function (err) {
      if (err) throw err
      console.log('File saved.');
    });
  });*/
  req.body.image = req.body.image.replace(/^data:image\/jpeg+;base64,/, "");
  req.body.image = req.body.image.replace(/ /g, '+');

  if (!fs.existsSync('records')) {
    fs.mkdirSync('records');
  }

  fs.writeFile('records/image-' + req.body.index + '.jpeg', req.body.image, 'base64', function(err) {
    res.sendStatus(200);
  });
});

app.listen(app.get('port'), function() {
  console.log('App listening on port ' + app.get('port'));
});