var uuid = require('uuid');
var sse = require('app/sse');

var FilePipe = function (name, size) {
	this.name = name;
	this.size = size;
	this.id = uuid.v4();
	this.url = '/dropbox/' + this.id;
	this.eventStreamUrl = this.url + '/es';
};

FilePipe._store = {};

FilePipe.create = function (params) {
	var fp = new FilePipe(params.name, params.size);
	FilePipe._store[fp.id] = fp;
	return fp;
};

FilePipe.has = function (id) {
	return FilePipe._store.hasOwnProperty(id);
};

FilePipe.get = function (id) {
	return FilePipe._store[id];
};

FilePipe.remove = function (id) {
	if (FilePipe.has(id)) {
		return delete FilePipe._store[id];
	}
	return false;
};

FilePipe.middleware = function (req, res, next) {
	if (req.params && req.params.id) {
		if (FilePipe.has(req.params.id)) {
			req.filePipe = FilePipe.get(req.params.id);
			next();
		} else {
			res.send(404);
		}
	} else {
		next();
	}
};

FilePipe.prototype.subscribe = function (res) {
	this.eventStreamResponse = res;
	this.eventStreamResponse.socket.on('close', this.destroy.bind(this));
};

FilePipe.prototype.requestTransfer = function (res) {
	this.targetResponse = res;
	this.eventStreamResponse.write(sse.createMessage('connect', {}));
	return this;
};

FilePipe.prototype.sendFile = function (sourceRequest, callback) {
	this.targetResponse.attachment(this.name);

	sourceRequest.on('error', function (err) {
		callback(err);
	});

	sourceRequest.on('end', function () {
		callback(null);
	});

	sourceRequest.pipe(this.targetResponse);
	return this;
};

FilePipe.prototype.destroy = function () {
	if (this.eventStreamResponse) {
		this.eventStreamResponse.socket.end();
	}

	if (this.targetResponse) {
		this.targetResponse.end();
	}

	FilePipe.remove(this.id);
	return this;
};

module.exports = FilePipe;