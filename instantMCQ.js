path = require('path');
una = require('una');
jade = require('jade');

var app = una.app;
var express = una.express;

// Configure express to use the /public folder to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/',function (req,res) {
	res.render('index');
});

app.get('/partials/:name', function (req,res){
	res.render('partials/'+ req.params.name);
});

app.use (function (req,res) {
	res.render('index');
});

una.listen(5000);