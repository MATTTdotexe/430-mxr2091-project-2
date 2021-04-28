const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getWorkouts', mid.requiresLogin, controllers.Workout.getWorkouts);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/workout', mid.requiresLogin, controllers.Workout.workoutPage);
  app.post('/workout', mid.requiresLogin, controllers.Workout.workout);
  app.delete('/workout', mid.requiresLogin, controllers.Workout.delete);
  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);
  app.post('/changepw', mid.requiresSecure, mid.requiresLogin, controllers.Account.changepw);
  app.get('/subscription', mid.requiresLogin, controllers.Account.getsub);
  app.post('/subscription', mid.requiresSecure, mid.requiresLogin, controllers.Account.changesub);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('*', controllers.Account.errorPage);
};

module.exports = router;
