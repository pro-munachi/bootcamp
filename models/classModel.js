const mongoose = require('mongoose')
const moment = require('moment')

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

    students: [
      {
        name: { type: mongoose.Schema.Types.ObjectId, required: true },
      },
    ],

    date: {
      type: String,
      required: true,
      default: moment(new Date()).format('YYYYMMDD'),
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
