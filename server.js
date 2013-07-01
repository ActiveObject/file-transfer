var express = require('express');
var FilePipe = require('app/FilePipe');
var sse = require('app/sse');

var app = express();
app.use(express.static('public'));
app.use(express.json());
var BASE_URI = process.env.BASE_URI;

app.post('/dropbox', function (req, res) {
	var filePipe = FilePipe.create(req.body);
	res.set('Location', BASE_URI + filePipe.url);
	res.send(201, {
		"es": filePipe.eventStreamUrl
	});
});

app.get('/dropbox/:id', FilePipe.middleware, function (req, res) {
	res.status(200);
	req.filePipe.requestTransfer(res);
});

app.post('/dropbox/:id', FilePipe.middleware, function (req, res) {
	req.filePipe.sendFile(req, function (err) {
		if (err) {
			return res.status(404).send(err);
		}

		res.send(200);
	});
});

app.del('/dropbox/:id', FilePipe.middleware, function (req, res) {
	req.filePipe.destroy();
});

app.get('/dropbox/:id/es', FilePipe.middleware, function (req, res) {
	req.filePipe.subscribe(res);
	res.status(200).set(sse.headers);
});

var port = process.env.PORT || 8080;
app.listen(port, function (err) {
	if (err) return console.log('Error: ', err);
	console.log('server started at ' + port + ' port');
});