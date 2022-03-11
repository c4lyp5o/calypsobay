const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create the schema
const baySchema = new Schema({
    name: String,
    created_at: String,
    created_by: String,
    uniqueID: String,
    itsPath: String,
    itsSize: Number
});

const userSchema = new Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
  });

const Bay = mongoose.model('Bay', baySchema);
const User = mongoose.model('User', userSchema);

module.exports = { Bay, User };