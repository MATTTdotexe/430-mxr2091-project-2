const handleWorkout = (e) => {
	e.preventDefault();

	if ($('#workoutType').val() == '' || $('#workoutDescr').val() == '' || $('#workoutDate').val() == '' || $('#workoutDuration').val() == '') {
		handleError('All fields are required.');
		return false;
	}

	sendAjax('POST', $('#workoutForm').attr('action'), $('#workoutForm').serialize(), function() {
		loadWorkoutsFromServer();
		$('#workoutForm').get(0).reset();
	});

	return false;
};

const deleteWorkout = (e) => {
	e.preventDefault();

	sendAjax('DELETE', $(e.target).attr('action'), $(e.target).serialize(), function() {
		loadWorkoutsFromServer();
	});

	return false;
};

const WorkoutForm = (props) => {
	return (
		<form id="workoutForm" name="workoutForm" onSubmit={handleWorkout} action="/maker" method="POST" className="mainForm">
		
			<label htmlFor="type">Type: </label>
			<input id="workoutType" type="text" name="type" placeholder="Workout Type"/>

			<label htmlFor="descr">Description: </label>
			<input id="workoutDescr" type="text" name="descr" placeholder="Workout Description"/>

			<label htmlFor="workoutDate">Date of Workout: </label>
			<input id="workoutDate" type="date" name="workoutDate"/>

			<label htmlFor="duration">Duration: </label>
			<input id="workoutDuration" type="text" name="duration" placeholder="Workout Duration"/>

			<input id="_csrf" type="hidden" name="_csrf" value={props.csrf}/>
			<input className="makeWorkoutSubmit" type="submit" value="Submit"/>

		</form>
	);
};

const WorkoutList = function(props) {
	// passes this to each of the forms for easy serialization to send to the server
	const csrf = document.querySelector('#_csrf').value;

	if (props.workouts.length === 0) {
		return (
			<div className="workoutList">
				<h3 className="emptyWorkout">No Workouts Uploaded</h3>
			</div>
		);
	}

	const workoutNodes = props.workouts.map(function(workout) {
		return (
			<div key={workout._id} className="workout">
				<img src="/assets/img/logo-icon.png" className="logoIcon" />
				<h4 className="workoutType"> Type: {workout.type} </h4>
				<p className="workoutDescr"> Description: {workout.descr} </p>
				<p className="workoutDate"> Date of Workout: {workout.workoutDate} </p>
				<p className="workoutDuration"> Duration: {workout.duration} </p>

				<form name="deleteForm" onSubmit={deleteWorkout} action="/maker" method="DELETE" className="deleteForm">
					<input type="hidden" name="_csrf" value={csrf}/>
					<input type="hidden" name="_id" value={workout._id}/>
					<input className="deleteWorkoutSubmit" type="submit" value="Delete" />
				</form>
			</div>
		);
	});

	return (
		<div className="workoutList">
			{workoutNodes}
		</div>
	);
};

const loadWorkoutsFromServer = () => {
	sendAjax('GET', '/getWorkouts', null, (data) => {
		ReactDOM.render(
			<WorkoutList workouts={data.workouts} />, document.querySelector('#workouts')
		);
	});
};

const setup = function(csrf) {
	ReactDOM.render(
		<WorkoutForm csrf={csrf} />, document.querySelector('#makeWorkout')
	);

	ReactDOM.render(
		<WorkoutList workouts={[]} />, document.querySelector('#workouts')
	);

	loadWorkoutsFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});