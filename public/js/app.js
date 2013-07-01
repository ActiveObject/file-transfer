(function (global) {

var addClass = function (el, className) {
	var classes = el.className.split(' ');
	el.className = classes.concat(className).join(' ');
	return el;
};

var formatSize = function (size, units) {
	if (size < 1024) return size.toFixed(1) + ' ' + units[0];
	return formatSize(size / 1024, units.slice(1));
};

var app = {
	init: function () {
		var inputEl = document.getElementById('file-input');
		var promptBoxEl = document.getElementById('prompt-box');
		var fileSelectEl = document.getElementById('file-select');
		var fileBoxEl = document.getElementById('file-box');
		var handler = app.handleFile.bind(null, inputEl, fileBoxEl);

		inputEl.addEventListener('change', handler, false);
		fileSelectEl.addEventListener('click', function (event) {
			inputEl.click();
			addClass(promptBoxEl, 'prompt-box-hidden');
			addClass(fileBoxEl, 'file-box-visible');
		}, false);
	},

	handleFile: function (inputEl, boxEl) {
		var file = inputEl.files[0];
		FileTransfer.create(file, function (err, transfer) {
			if (err) {
				return console.error(err);
			}

			boxEl.appendChild(app.renderTransferFile(file, transfer));
		});
	},

	renderTransferFile: function (file, transfer) {
		var tmpl = document.getElementById('file-box-tmpl').innerHTML;
		var el = document.createElement('div');
		el.className = 'file-to-transfer';
		el.innerHTML = tmpl.replace('#{NAME}', file.name)
			.replace('#{SIZE}', formatSize(file.size, ['байт', 'кБ', 'МБ', 'ГБ']))
			.replace('#{URL}', transfer.url);
		return el;
	}
};

global.app = app;

})(this);
