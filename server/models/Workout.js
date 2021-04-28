const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let WorkoutModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to a real mongo ID
const convertId = mongoose.Types.ObjectId;
const escapeChars = (string) => _.escape(string).trim();

const WorkoutSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    maxLength: 64,
    trim: true,
    set: escapeChars,
  },
  descr: {
    type: String,
    required: false,
    maxLength: 128,
    trim: true,
    set: escapeChars,
  },
  workoutDate: {
    type: String,
    required: true,
    maxLength: 64,
    trim: true,
    set: escapeChars,
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

WorkoutSchema.statics.toAPI = (doc) => ({
  type: doc.type,
  descr: doc.descr,
  workoutDate: doc.workoutDate,
  duration: doc.duration,
});

WorkoutSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return WorkoutModel.find(search).select('type descr workoutDate duration').lean().exec(callback);
};

WorkoutSchema.statics.deleteByWorkoutID = (workoutID, callback) => {
  const myquery = {
    _id: workoutID,
  };

  return WorkoutModel.deleteOne(myquery, callback);
};

WorkoutModel = mongoose.model('Workout', WorkoutSchema);

module.exports.WorkoutModel = WorkoutModel;
module.exports.WorkoutSchema = WorkoutSchema;
