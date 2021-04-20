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
		<form id="workoutForm" class="container tile is-parent is-vertical box has-background-primary" name="workoutForm" onSubmit={handleWorkout} action="/maker" method="POST">
		
			<p><label htmlFor="type">Type: </label>
			<input id="workoutType" class="input is-medium" type="text" name="type" placeholder="Workout Type"/></p>

			<p><label htmlFor="descr">Description: </label>
			<input id="workoutDescr" class="input is-medium" type="text" name="descr" placeholder="Workout Description"/></p>

			<p><label htmlFor="workoutDate">Date of Workout: </label>
			<input id="workoutDate" class="input is-medium" type="date" name="workoutDate"/></p>

			<p><label htmlFor="duration">Duration: </label>
			<input id="workoutDuration" class="input is-medium" type="text" name="duration" placeholder="Workout Duration"/></p>

			<input id="_csrf" type="hidden" name="_csrf" value={props.csrf}/>

			<p class="centerMe"><input class="button tag has-background-link is-medium makeWorkoutSubmit" type="submit" value="Submit"/></p>

		</form>
	);
};

const WorkoutList = function(props) {
	// passes this to each of the forms for easy serialization to send to the server
	const csrf = document.querySelector('#_csrf').value;

	if (props.workouts.length === 0) {
		return (
			<div class="workoutList container tile is-parent is-vertical box has-background-primary">
				<h3 className="emptyWorkout">No Workouts Uploaded</h3>
			</div>
		);
	}

	const workoutNodes = props.workouts.map(function(workout) {
		return (
			<div key={workout._id} class="workout container tile is-parent is-vertical box has-background-primary">
				<p className="workoutType"> Type: {workout.type} </p>
				<p className="workoutDescr"> Description: {workout.descr} </p>
				<p className="workoutDate"> Date of Workout: {workout.workoutDate} </p>
				<p className="workoutDuration"> Duration: {workout.duration} </p>

				<form name="deleteForm" onSubmit={deleteWorkout} action="/maker" method="DELETE" class="deleteForm">
					<input type="hidden" name="_csrf" value={csrf}/>
					<input type="hidden" name="_id" value={workout._id}/>
					<p class="centerMe"><input class="deleteWorkoutSubmit button tag has-background-danger is-medium" type="submit" value="Delete" /></p>
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