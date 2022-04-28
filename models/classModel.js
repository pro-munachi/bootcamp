const mongoose = require('mongoose')

const classSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    type: {
      type: String,
      required: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    hasStarted: {
      type: Boolean,
      default: false,
    },

    students: [
      {
        name: { type: mongoose.Schema.Types.ObjectId, required: true },
      },
    ],

    date: {
      type: String,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

const Class = mongoose.model('Class', classSchema)

module.exports = Class
