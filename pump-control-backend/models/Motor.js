const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MotorSchema = new Schema({
  name: { type: String, required: true },
  ref: { type: String, required: true },
  status: { type: String, default: 'off' },
  heure: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/ }, 
  date: { type: Date },
});

module.exports = mongoose.model('Motor', MotorSchema);
