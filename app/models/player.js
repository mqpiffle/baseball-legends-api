const mongoose = require('mongoose')

const { Schema, model } = mongoose

const playerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        positions: {
            type: [String],
            required: true,
        },
        leagues: {
            type: [String],
            required: true,
        },
        baseballHoF: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = model('Players', playerSchema)
