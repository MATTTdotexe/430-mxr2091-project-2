const handleMessage = (message) => {
	$('#message').text(message);
};

const redirect = (response) => {
	window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
	$.ajax({
		cache: false,
		type: type,
		url: action,
		data: data,
		datType: 'json',
		success: success,
		error: function(xhr, status, error) {
			var messageObj = JSON.parse(xhr.responseText);
			handleMessage(messageObj.error);
		}
	});
};