"use strict";

var handleChangePassword = function handleChangePassword(e) {
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

var handleChangeSub = function handleChangeSub(e) {
  e.preventDefault();
  sendAjax('POST', $('#changeSubForm').attr('action'), $('#changeSubForm').serialize(), redirect);
  handleMessage('');
  return false;
};

var ChangePasswordWindow = function ChangePasswordWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "changePasswordForm",
      name: "changePasswordForm",
      onSubmit: handleChangePassword,
      action: "/changepw",
      method: "POST",
      className: "container tile is-child is-vertical box has-background-primary"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "username",
      className: "input is-medium",
      type: "text",
      name: "username",
      placeholder: "username"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
      id: "oldpass",
      className: "input is-medium",
      type: "password",
      name: "oldpass",
      placeholder: "current password"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "newpass",
      className: "input is-medium",
      type: "password",
      name: "newpass",
      placeholder: "new password"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Confirm New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "newpass2",
      className: "input is-medium",
      type: "password",
      name: "newpass2",
      placeholder: "retype new password"
    })), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("p", {
      className: "centerMe"
    }, /*#__PURE__*/React.createElement("input", {
      className: "button tag has-background-warning is-medium formSubmit",
      type: "submit",
      value: "Confirm"
    })))
  );
};

var ChangeSubscriptionWindow = function ChangeSubscriptionWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "changeSubForm",
      name: "changeSubForm",
      onSubmit: handleChangeSub,
      action: "/subscription",
      method: "POST",
      className: "container tile is-child is-vertical box has-background-primary"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("p", {
      className: "centerMe"
    }, /*#__PURE__*/React.createElement("input", {
      className: "button tag has-background-info is-medium formSubmit",
      type: "submit",
      value: "Change Subscription"
    })))
  );
};

var DisplaySubscriptionStatus = function DisplaySubscriptionStatus(props) {
  var typeofsub = props.sub === "standard";

  if (typeofsub) {
    return (/*#__PURE__*/React.createElement("p", {
        className: "centerMe",
        style: {
          color: "red"
        }
      }, "Standard Subscription")
    );
  } else {
    return (/*#__PURE__*/React.createElement("p", {
        className: "centerMe",
        style: {
          color: "red"
        }
      }, "Premium Subscription")
    );
  }
};

var createChangePasswordWindow = function createChangePasswordWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePasswordWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var createChangeSubscriptionWindow = function createChangeSubscriptionWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangeSubscriptionWindow, {
    csrf: csrf
  }), document.querySelector('#content'));
};

var loadSubscriptionFromServer = function loadSubscriptionFromServer() {
  sendAjax('GET', '/subscription', null, function (sub) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DisplaySubscriptionStatus, {
      sub: sub.sub
    }), document.querySelector('#status'));
  });
};

var setup = function setup(csrf) {
  var passwordOptionButton = document.querySelector('#passwordOptionButton');
  var subOptionButton = document.querySelector('#subOptionButton');
  passwordOptionButton.addEventListener('click', function (e) {
    e.preventDefault();
    createChangePasswordWindow(csrf);
    return false;
  });
  subOptionButton.addEventListener('click', function (e) {
    e.preventDefault();
    createChangeSubscriptionWindow(csrf);
    return false;
  }); // default view

  createChangeSubscriptionWindow(csrf);
  loadSubscriptionFromServer();
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
