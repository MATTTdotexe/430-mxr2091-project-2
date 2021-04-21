const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const settingsPage = (req, res) => {
  res.render('settings', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password.' });
    }

    // save account information
    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/workout' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/workout' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred.' });
    });
  });
};

const changepw = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.oldpass = `${req.body.oldpass}`;
  req.body.newpass = `${req.body.newpass}`;
  req.body.newpass2 = `${req.body.newpass2}`;

  // verify all fields are present
  if (!req.body.username || !req.body.oldpass || !req.body.newpass || !req.body.newpass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // verify new password is entered correctly
  if (req.body.newpass !== req.body.newpass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  // verify username
  if (req.session.account.username !== req.body.username) {
    return res.status(400).json({ error: 'Wrong username.' });
  }

  // authenticate old password
  Account.AccountModel.authenticate(req.body.username, req.body.oldpass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password.' });
    }

    return res.json({ message: 'Authentication successful.' });
  });

  // encrypt the new password
  Account.AccountModel.generateHash(req.body.newpass, (salt, hash) => {
    const newAccountData = {
      salt,
      password: hash,
    };

    const { _id } = req.session.account;
    Account.AccountModel.changePassword(_id, newAccountData.password, newAccountData.salt);

    // log the user out so that they must now log in with their new password
    return res.json({ redirect: '/logout' });
  });

  return res.json({ message: 'Password change successful.' });
};

const getsub = (request, response) => {
  const req = request;
  const res = response;

  const { subscription } = req.session.account;

  return res.json({ sub: subscription });
};

const changesub = (request, response) => {
  const req = request;
  const res = response;

  // changes the subscription field in the database where the id equals _id
  const success = Account.AccountModel.changeSubscriptionById(req.session.account._id);

  if (!success) {
    return res.status(400).json({ error: 'Subscription change failed.' });
  }

  // edit the session
  if (req.session.account.subscription === 'standard') {
    req.session.account.subscription = 'premium';
  } else {
    req.session.account.subscription = 'standard';
  }

  // reload the page to reflect changes
  return res.json({ redirect: '/settings' });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports = {
  loginPage,
  settingsPage,
  login,
  logout,
  signup,
  changepw,
  getsub,
  changesub,
  getToken,
};
