"use strict";

var handleWorkout = function handleWorkout(e) {
  e.preventDefault();

  if ($('#workoutType').val() == '' || $('#workoutDescr').val() == '' || $('#workoutDate').val() == '' || $('#workoutDuration').val() == '') {
    handleError('All fields are required.');
    return false;
  }

  sendAjax('POST', $('#workoutForm').attr('action'), $('#workoutForm').serialize(), function () {
    loadWorkoutsFromServer();
    $('#workoutForm').get(0).reset();
  });
  return false;
};

var deleteWorkout = function deleteWorkout(e) {
  e.preventDefault();
  sendAjax('DELETE', $(e.target).attr('action'), $(e.target).serialize(), function () {
    loadWorkoutsFromServer();
  });
  return false;
};

var WorkoutForm = function WorkoutForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "workoutForm",
      name: "workoutForm",
      onSubmit: handleWorkout,
      action: "/maker",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "type"
    }, "Type: "), /*#__PURE__*/React.createElement("input", {
      id: "workoutType",
      type: "text",
      name: "type",
      placeholder: "Workout Type"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "descr"
    }, "Description: "), /*#__PURE__*/React.createElement("input", {
      id: "workoutDescr",
      type: "text",
      name: "descr",
      placeholder: "Workout Description"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "workoutDate"
    }, "Date of Workout: "), /*#__PURE__*/React.createElement("input", {
      id: "workoutDate",
      type: "date",
      name: "workoutDate"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "duration"
    }, "Duration: "), /*#__PURE__*/React.createElement("input", {
      id: "workoutDuration",
      type: "text",
      name: "duration",
      placeholder: "Workout Duration"
    }), /*#__PURE__*/React.createElement("input", {
      id: "_csrf",
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeWorkoutSubmit",
      type: "submit",
      value: "Submit"
    }))
  );
};

var WorkoutList = function WorkoutList(props) {
  // passes this to each of the forms for easy serialization to send to the server
  var csrf = document.querySelector('#_csrf').value;

  if (props.workouts.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "workoutList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyWorkout"
      }, "No Workouts Uploaded"))
    );
  }

  var workoutNodes = props.workouts.map(function (workout) {
    return (/*#__PURE__*/React.createElement("div", {
        key: workout._id,
        className: "workout"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/logo-icon.png",
        className: "logoIcon"
      }), /*#__PURE__*/React.createElement("h4", {
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
        action: "/maker",
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
      }), /*#__PURE__*/React.createElement("input", {
        className: "deleteWorkoutSubmit",
        type: "submit",
        value: "Delete"
      })))
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

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#workoutMessage').animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $('#workoutMessage').animate({
    width: 'hide'
  }, 350);
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
      handleError(messageObj.error);
    }
  });
};
