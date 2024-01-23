const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true],
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Author is required.'],
      trim: true,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const User = model('User', userSchema)

module.exports = User
