var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs-extra')
var Inliner = require('inliner');
var open = require('open');


console.log('Copying libraries to /slides');
fs.copy('js', 'slides/js')
fs.copy('css', 'slides/css')
fs.copy('lib', 'slides/lib')
fs.copy('plugin', 'slides/plugin')


// Serve content
app.use('/', express.static(__dirname));


http.listen(3000, function(){
  console.log('listening on *:3000');
  open('http://127.0.0.1:3000/base.html');
});


// Get save-up events
io.on('connection', function(socket){
  socket.on('dlPage', function(msg){

    console.log('Received ' + msg.name + ' // length :' + msg.content.length);

    fs.writeFile('slides/'+msg.name+'.local.html', msg.content, function(err) {
      io.emit('isDlOk', 'ok');

      var url = 'http://127.0.0.1:3000/slides/'+msg.name+'.local.html'
      console.log('Inlining ' + url)

      var inliner = new Inliner(url, function(err, html) {
        if (err) console.log(err);
        fs.writeFile('slides/'+msg.name+'.inlined.html', html)
      });
    })
  });
});
