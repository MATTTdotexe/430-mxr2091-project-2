const handleError = (message) => {
	$('#errorMessage').text(message);
	$('#workoutMessage').animate({ width: 'toggle' }, 350);
};

const redirect = (response) => {
	$('#workoutMessage').animate({ width: 'hide' }, 350);
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
			handleError(messageObj.error);
		}
	});
};