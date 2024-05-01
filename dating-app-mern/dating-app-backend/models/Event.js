//const mongoose = require('mongoose');
import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Event = mongoose.model('Event', eventSchema);
export default Event;