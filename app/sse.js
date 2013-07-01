exports.headers = {
  'Content-Type'  : 'text/event-stream',
  'Cache-Control' : 'no-cache',
  'Connection'    : 'keep-alive'
};

exports.createMessage = function (type, data) {
	var msg = JSON.stringify(data)
		.split('\n')
		.map(function (str) { return "data: " + str; })
		.concat('\n')
		.join('\n');

	return 'event: ' + type + '\n' + msg;
};
