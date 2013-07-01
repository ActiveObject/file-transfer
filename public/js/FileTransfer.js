(function (global) {

var isErrStatus = function (status) {
	var type = status / 100 | 0;
	return type === 4 || type === 5;
};

var FileTransfer = function (file, url, esUrl) {
	this.url = url;
	this.file = file;
	this.eventSource = new EventSource(esUrl);
	this.eventSource.addEventListener('connect', this.sendFile.bind(this), false);
	this.eventSource.addEventListener('error', function (event) {
		if (event.readyState === EventSource.CLOSED) {
			console.log('transfer complete');
		} else {
			this.error(event);
		}
	}.bind(this), false);
};

FileTransfer.create = function (file, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/dropbox');
	xhr.onload = function () {
		if (xhr.status === 201) {
			var data = JSON.parse(xhr.responseText);
			var url = xhr.getResponseHeader('Location');
			var transfer = new FileTransfer(file, url, data.es);
			callback(null, transfer);
		} else if (isErrStatus(xhr.status)) {
			callback(xhr);
		}
	};
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		name: file.name,
		size: file.size
	}));
};

FileTransfer.prototype.sendFile = function () {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', this.url);
	xhr.onload = function (event) {
		console.log('File %s has been successfully sent', this.file.name);
	}.bind(this);
	var formData = new FormData();
	formData.append('file', this.file);
	xhr.send(formData);
};

FileTransfer.prototype.error = function (err) {
	console.error(err);
};

global.FileTransfer = FileTransfer;

})(this);