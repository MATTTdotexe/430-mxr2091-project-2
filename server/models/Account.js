const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    required: true,
    trim: true,
    default: 'standard',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  subscription: doc.subscription,
  _id: doc._id,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

// returns the subscription field of a provided id
AccountSchema.statics.subscriptionById = (Id, callback) => {
  const search = {
    _id: Id,
  };
  const proj = {
    subscription: 1,
  };

  return AccountModel.findOne(search, proj, callback);
};

AccountSchema.statics.changeSubscriptionById = (Id) => {
  const returnDocument = AccountModel.subscriptionById(Id, (err, doc) => {
    if (err) {
      console.log(err);
      return false;
    }

    if (!doc) {
      return false;
    }

    // flip the subscription field between standard and premium
    const search = {
      _id: Id,
    };
    if (doc.subscription === 'standard') {
      const update = {
        $set: { subscription: 'premium' },
      };

      AccountModel.updateOne(search, update, (err2, res) => {
        const result = res;
        if (err2) {
          console.log(err2);
          return false;
        }
        return result;
      });
    } else {
      const update = {
        $set: { subscription: 'standard' },
      };

      AccountModel.updateOne(search, update, (err2, res) => {
        const result = res;
        if (err2) {
          console.log(err2);
          return false;
        }
        return result;
      });
    }

    return true;
  });

  return returnDocument;
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => callback(salt, hash.toString('hex')));
};

AccountSchema.statics.authenticate = (username, password, callback) => {
  AccountModel.findByUsername(username, (err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    return validatePassword(doc, password, (result) => {
      if (result === true) {
        return callback(null, doc);
      }

      return callback();
    });
  });
};

AccountSchema.statics.changePassword = (Id, newpassword, newsalt) => {
  const search = {
    _id: Id,
  };
  const update = {
    $set: { password: newpassword, salt: newsalt },
  };

  // update the database fields for password and hash
  AccountModel.updateOne(search, update, (err, res) => {
    const result = res;
    if (err) {
      console.log(err);
      return false;
    }
    return result;
  });

  return true;
};

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
