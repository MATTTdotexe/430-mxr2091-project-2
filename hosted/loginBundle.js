"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($('#user').val() == '' || $('#pass').val() == '') {
    handleMessage('Username or password is empty.');
    return false;
  } // console.log($('input[name=_csrf]').val());


  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  handleMessage('');
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleMessage('All fields are required.');
    return false;
  }

  if ($('#pass').val() !== $('#pass2').val()) {
    handleMessage('Passwords do not match.');
    return false;
  }

  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
  handleMessage('');
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "container tile is-child is-vertical box has-background-primary"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      className: "input is-medium",
      type: "text",
      name: "username",
      placeholder: "username"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      className: "input is-medium",
      type: "password",
      name: "pass",
      placeholder: "password"
    })), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("p", {
      className: "centerMe"
    }, /*#__PURE__*/React.createElement("input", {
      className: "button tag has-background-link is-medium formSubmit",
      type: "submit",
      value: "Sign in"
    })))
  );
};

var SignupWindow = function SignupWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "container tile is-child is-vertical box has-background-primary"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      className: "input is-medium",
      type: "text",
      name: "username",
      placeholder: "username"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      className: "input is-medium",
      type: "password",
      name: "pass",
      placeholder: "password"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      className: "input is-medium",
      type: "password",
      name: "pass2",
      placeholder: "retype password"
    })), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("p", {
      className: "centerMe"
    }, /*#__PURE__*/React.createElement("input", {
      className: "button tag has-background-link is-medium formSubmit",
      type: "submit",
      value: "Sign up"
    })))
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector('#loginButton');
  var signupButton = document.querySelector('#signupButton');
  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  }); // default view

  createLoginWindow(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleMessage = function handleMessage(message) {
  $('#message').text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    datType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleMessage(messageObj.error);
    }
  });
};
