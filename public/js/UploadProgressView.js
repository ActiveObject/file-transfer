(function (global) {

var UploadProgressView = function (transfer) {
	this.el = this.render();
	transfer.onprogress = this.update.bind(this);
	// transfer.onfinish = function () {
	// 	setTimeout(this.destroy.bind(this), 2000);
	// }.bind(this);
};

UploadProgressView.prototype.update = function (percentage) {
	this.progressBarEl.style.width = percentage + '%';
	this.progressPercentEl.innerHTML = percentage + '%';
	return this;
};

UploadProgressView.prototype.destroy = function () {
	var parentEl = this.el.parentNode;
	parentEl.removeChild(this.el);
	return this;
};

UploadProgressView.prototype.render = function () {
	var el = document.createElement('div');
	el.className = 'upload-progress-wrapper';

	var progressBarEl = document.createElement('div');
	progressBarEl.className = 'upload-progress';

	var progressPercentEl = document.createElement('div');
	progressPercentEl.className = 'upload-progress-desc';

	el.appendChild(progressBarEl);
	el.appendChild(progressPercentEl);
	this.progressBarEl = progressBarEl;
	this.progressPercentEl = progressPercentEl;
	return el;
};

UploadProgressView.prototype.appendTo = function (parentEl) {
	parentEl.appendChild(this.el);
	return this;
};

global.UploadProgressView = UploadProgressView;

})(this);