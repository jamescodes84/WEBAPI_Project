import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  birthdate: { type: Date, required: true }, // Added birthdate as a required Date type
  events: [{ type: Schema.Types.ObjectId, ref: 'Event' }] // Array of event document references
});

const User = mongoose.model('User', userSchema);

export default User;
