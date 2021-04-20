const handleLogin = (e) => {
	e.preventDefault();

	// $('#workoutMessage').animate({ width: 'toggle' }, 350);

	if ($('#user').val() == '' || $('#pass').val() == '') {
		handleError('Username or password is empty.');
		return false;
	}

	console.log($('input[name=_csrf]').val());

	sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

	return false;
};

const handleSignup = (e) => {
	e.preventDefault();

	// $('#workoutMessage').animate({ width: 'toggle' }, 350);

	if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
		handleError('All fields are required.');
		return false;
	}

	if ($('#pass').val() !== $('#pass2').val()) {
		handleError('Passwords do not match.');
		return false;
	}

	sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

	return false;
};

const LoginWindow = (props) => {
	return (
		<form id="loginForm" name="loginForm" onSubmit={handleLogin}
		action="/login" method="POST" class="container tile is-child is-vertical box has-background-primary">
		
			<p><label htmlFor="username">Username: </label>
			<input id="user" class="input is-medium" type="text" name="username" placeholder="username"/></p>

			<p><label htmlFor="pass">Password: </label>
			<input id="pass" class="input is-medium" type="password" name="pass" placeholder="password"/></p>

			<input type="hidden" name="_csrf" value={props.csrf}/>

			<p class="centerMe"><input class="button tag has-background-link is-medium formSubmit" type="submit" value="Sign in"/></p>

		</form>
	);
};

const SignupWindow = (props) => {
	return (
		<form id="signupForm" name="signupForm" onSubmit={handleSignup}
		action="/signup" method="POST" class="container tile is-child is-vertical box has-background-primary">
		
			<p><label htmlFor="username">Username: </label>
			<input id="user" class="input is-medium" type="text" name="username" placeholder="username"/></p>

			<p><label htmlFor="pass">Password: </label>
			<input id="pass" class="input is-medium" type="password" name="pass" placeholder="password"/></p>

			<p><label htmlFor="pass2">Password: </label>
			<input id="pass2" class="input is-medium" type="password" name="pass2" placeholder="retype password"/></p>

			<input type="hidden" name="_csrf" value={props.csrf}/>

			<p class="centerMe"><input class="button tag has-background-link is-medium formSubmit" type="submit" value="Sign up"/></p>

		</form>
	);
};

const createLoginWindow = (csrf) => {
	ReactDOM.render(
		<LoginWindow csrf={csrf} />,
		document.querySelector('#content')
	);
};

const createSignupWindow = (csrf) => {
	ReactDOM.render(
		<SignupWindow csrf={csrf} />,
		document.querySelector('#content')
	);
};

const setup = (csrf) => {
	const loginButton = document.querySelector('#loginButton');
	const signupButton = document.querySelector('#signupButton');

	signupButton.addEventListener('click', (e) => {
		e.preventDefault();
		createSignupWindow(csrf);
		return false;
	});

	loginButton.addEventListener('click', (e) => {
		e.preventDefault();
		createLoginWindow(csrf);
		return false;
	});

	// default view
	createLoginWindow(csrf);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});