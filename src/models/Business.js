import mongoose from 'mongoose';
const { Schema } = mongoose;

const businessSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\w\d\-]+\.)+[\w\d]+(\/.+)?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    },
    required: [false, 'Website URL not required']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  events: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Event' 
  }]
});

const Business = mongoose.model('Business', businessSchema);

export default Business;
