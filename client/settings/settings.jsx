const handleChangePassword = (e) => {
	e.preventDefault();

	if ($('#username').val() == '' || $('#oldpass').val() == '' || $('#newpass').val() == '' || $('#newpass2').val() == '') {
		handleMessage('All fields are required.');
		return false;
	}

	if ($('#newpass').val() !== $('#newpass2').val()) {
		handleMessage('Passwords do not match.');
		return false;
	}

	sendAjax('POST', $('#changePasswordForm').attr('action'), $('#changePasswordForm').serialize(), redirect);

	handleMessage('');

	return false;
};

const handleChangeSub = (e) => {
	e.preventDefault();

	sendAjax('POST', $('#changeSubForm').attr('action'), $('#changeSubForm').serialize(), redirect);

	handleMessage('');

	return false;
};

const ChangePasswordWindow = (props) => {
	return (
		<form id="changePasswordForm" name="changePasswordForm" onSubmit={handleChangePassword}
		action="/changepw" method="POST" className="container tile is-child is-vertical box has-background-primary">

			<p><label htmlFor="pass">Username: </label>
			<input id="username" className="input is-medium" type="text" name="username" placeholder="username"/></p>

			<p><label htmlFor="pass">Old Password: </label>
			<input id="oldpass" className="input is-medium" type="password" name="oldpass" placeholder="current password"/></p>

			<p><label htmlFor="pass2">New Password: </label>
			<input id="newpass" className="input is-medium" type="password" name="newpass" placeholder="new password"/></p>

			<p><label htmlFor="pass2">Confirm New Password: </label>
			<input id="newpass2" className="input is-medium" type="password" name="newpass2" placeholder="retype new password"/></p>

			<input type="hidden" name="_csrf" value={props.csrf}/>

			<p className="centerMe"><input className="button tag has-background-warning is-medium formSubmit" type="submit" value="Confirm"/></p>

		</form>
	);
};

const ChangeSubscriptionWindow = (props) => {
	return (
		<form id="changeSubForm" name="changeSubForm" onSubmit={handleChangeSub}
			action="/subscription" method="POST" className="container tile is-child is-vertical box has-background-primary">

			<input type="hidden" name="_csrf" value={props.csrf}/>

			<p className="centerMe"><input className="button tag has-background-info is-medium formSubmit" type="submit" value="Change Subscription"/></p>

		</form>
	);
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
}

const createChangePasswordWindow = (csrf) => {
	ReactDOM.render(
		<ChangePasswordWindow csrf={csrf} />,
		document.querySelector('#content')
	);
};

const createChangeSubscriptionWindow = (csrf) => {
	ReactDOM.render(
		<ChangeSubscriptionWindow csrf={csrf} />,
		document.querySelector('#content')
	);
};

const loadSubscriptionFromServer = () => {
	sendAjax('GET', '/subscription', null, (sub) => {
		ReactDOM.render(
			<DisplaySubscriptionStatus sub={sub.sub} />, document.querySelector('#status')
		);
	});
};

const setup = (csrf) => {
	const passwordOptionButton = document.querySelector('#passwordOptionButton');
	const subOptionButton = document.querySelector('#subOptionButton');

	passwordOptionButton.addEventListener('click', (e) => {
		e.preventDefault();
		createChangePasswordWindow(csrf);
		return false;
	});

	subOptionButton.addEventListener('click', (e) => {
		e.preventDefault();
		createChangeSubscriptionWindow(csrf);
		return false;
	});

	// default view
	createChangeSubscriptionWindow(csrf);
	loadSubscriptionFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});