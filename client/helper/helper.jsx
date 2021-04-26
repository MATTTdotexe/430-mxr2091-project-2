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

const DisplaySubscriptionStatus = (props) => {
	const typeofsub = props.sub === "standard";
	if (typeofsub) {
		return (
			<p className="centerMe" style={{color:"red"}}>Standard Subscription</p>
		);
	} else {
		return (
			<p className="centerMe" style={{color:"red"}}>Premium Subscription</p>
		);
	}
};

const loadSubscriptionFromServer = () => {
	sendAjax('GET', '/subscription', null, (sub) => {
		ReactDOM.render(
			<DisplaySubscriptionStatus sub={sub.sub} />, document.querySelector('#status')
		);

		let subText = document.querySelector('#status').innerText;

		if (subText === "Standard Subscription") {
			handleAdvertisement();
		}
	});
};

const Ad = () => {
	const availableAds = [
		"Advertisement: Buy overpriced clothing!!!",
		"Advertisement: Buy car insurance!!!",
		"Advertisement: Buy VPN service!!!",
		"Advertisement: Buy fast food!!!",
		"Advertisement: Buy this car at 30% APR!!!"
	];
	const randomAdIndex = Math.floor(Math.random() * availableAds.length);
	const randomAd = availableAds[randomAdIndex];

	return (
		<div className="container tile is-child is-vertical box has-background-warning">
			<p>{randomAd}</p>
		</div>
	);
};

const handleAdvertisement = (ad) => {
	ReactDOM.render(
		<Ad />, document.querySelector('#advertisement')
	);
};