path = require('path');
una = require('una');
jade = require('jade');

var app = una.app;
var express = una.express;

// Configure express to use the /public folder to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/screen',function(req,res){
	res.render('screen.jade');
});
app.get('/controller',function(req,res){
	res.render('controller.jade', {room_id: una.room_id});
})
una.listen(5000);