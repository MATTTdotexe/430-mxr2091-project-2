"use strict";

var handleWorkout = function handleWorkout(e) {
  e.preventDefault();

  if ($('#workoutType').val() == '' || $('#workoutDescr').val() == '' || $('#workoutDate').val() == '' || $('#workoutDuration').val() == '') {
    handleMessage('All fields are required.');
    return false;
  }

  sendAjax('POST', $('#workoutForm').attr('action'), $('#workoutForm').serialize(), function () {
    loadWorkoutsFromServer();
    $('#workoutForm').get(0).reset();
  });
  handleMessage('');
  return false;
};

var deleteWorkout = function deleteWorkout(e) {
  e.preventDefault();
  sendAjax('DELETE', $(e.target).attr('action'), $(e.target).serialize(), function () {
    loadWorkoutsFromServer();
  });
  handleMessage('');
  return false;
};

var WorkoutForm = function WorkoutForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "workoutForm",
      className: "container tile is-parent is-vertical box has-background-primary",
      name: "workoutForm",
      onSubmit: handleWorkout,
      action: "/workout",
      method: "POST"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "type"
    }, "Type: "), /*#__PURE__*/React.createElement("input", {
      id: "workoutType",
      className: "input is-medium",
      type: "text",
      name: "type",
      placeholder: "Workout Type"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "descr"
    }, "Description: "), /*#__PURE__*/React.createElement("input", {
      id: "workoutDescr",
      className: "input is-medium",
      type: "text",
      name: "descr",
      placeholder: "Workout Description"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "workoutDate"
    }, "Date of Workout: "), /*#__PURE__*/React.createElement("input", {
      id: "workoutDate",
      className: "input is-medium",
      type: "date",
      name: "workoutDate"
    })), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "duration"
    }, "Duration: "), /*#__PURE__*/React.createElement("input", {
      id: "workoutDuration",
      className: "input is-medium",
      type: "text",
      name: "duration",
      placeholder: "Workout Duration"
    })), /*#__PURE__*/React.createElement("input", {
      id: "_csrf",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("p", {
      className: "centerMe"
    }, /*#__PURE__*/React.createElement("input", {
      className: "button tag has-background-link is-medium makeWorkoutSubmit",
      type: "submit",
      value: "Submit"
    })))
  );
};

var WorkoutList = function WorkoutList(props) {
  // passes this to each of the forms for easy serialization to send to the server
  var csrf = document.querySelector('#_csrf').value;

  if (props.workouts.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "workoutList container tile is-parent is-vertical box has-background-primary"
      }, /*#__PURE__*/React.createElement("p", {
        className: "emptyWorkout"
      }, "No Workouts Uploaded"))
    );
  }

  var workoutNodes = props.workouts.map(function (workout) {
    return (/*#__PURE__*/React.createElement("div", {
        key: workout._id,
        className: "workout container tile is-parent is-vertical box has-background-primary"
      }, /*#__PURE__*/React.createElement("p", {
        className: "workoutType"
      }, " Type: ", workout.type, " "), /*#__PURE__*/React.createElement("p", {
        className: "workoutDescr"
      }, " Description: ", workout.descr, " "), /*#__PURE__*/React.createElement("p", {
        className: "workoutDate"
      }, " Date of Workout: ", workout.workoutDate, " "), /*#__PURE__*/React.createElement("p", {
        className: "workoutDuration"
      }, " Duration: ", workout.duration, " "), /*#__PURE__*/React.createElement("form", {
        name: "deleteForm",
        onSubmit: deleteWorkout,
        action: "/workout",
        method: "DELETE",
        className: "deleteForm"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: csrf
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_id",
        value: workout._id
      }), /*#__PURE__*/React.createElement("p", {
        className: "centerMe"
      }, /*#__PURE__*/React.createElement("input", {
        className: "deleteWorkoutSubmit button tag has-background-danger is-medium",
        type: "submit",
        value: "Delete"
      }))))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "workoutList"
    }, workoutNodes)
  );
};

var loadWorkoutsFromServer = function loadWorkoutsFromServer() {
  sendAjax('GET', '/getWorkouts', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(WorkoutList, {
      workouts: data.workouts
    }), document.querySelector('#workouts'));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(WorkoutForm, {
    csrf: csrf
  }), document.querySelector('#makeWorkout'));
  ReactDOM.render( /*#__PURE__*/React.createElement(WorkoutList, {
    workouts: []
  }), document.querySelector('#workouts'));
  loadWorkoutsFromServer();
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
