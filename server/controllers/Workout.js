const models = require('../models');

const { Workout } = models;

const makerPage = (req, res) => {
  Workout.WorkoutModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), workouts: docs });
  });
};

const makeWorkout = (req, res) => {
  if (!req.body.type || !req.body.descr || !req.body.duration || !req.body.workoutDate) {
    return res.status(400).json({ error: 'Type, description, duration, and date are required.' });
  }

  const workoutData = {
    type: req.body.type,
    descr: req.body.descr,
    duration: req.body.duration,
    workoutDate: req.body.workoutDate,
    owner: req.session.account._id,
  };

  const newWorkout = new Workout.WorkoutModel(workoutData);

  const workoutPromise = newWorkout.save();

  workoutPromise.then(() => res.json({
    redirect: '/maker',
  }));

  workoutPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Workout already exists.' });
    }

    return res.status(400).json({ error: 'An error occured.' });
  });

  return workoutPromise;
};

const deleteWorkout = (req, res) => {
  if (!req.body._id) {
    return res.status(400).json({ error: 'ID to delete is required.' });
  }

  Workout.WorkoutModel.deleteByWorkoutID(req.body._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }
    return false;
  });

  return res.json({ message: 'The workout was deleted successfully.' });
};

const getWorkouts = (request, response) => {
  const req = request;
  const res = response;

  return Workout.WorkoutModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.json({ workouts: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeWorkout;
module.exports.delete = deleteWorkout;
module.exports.getWorkouts = getWorkouts;
