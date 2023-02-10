const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messengerSchema = new Schema(
  {
    type: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    sessionString: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Messenger', messengerSchema);
