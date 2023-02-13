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
            enum: ['1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'C', 'P', 'DH'],
            default: '1B',
            required: true,
        },
        leagues: {
            type: [String],
            enum: [
                'American League',
                'National League',
                'Negro American League',
                'Negro National League',
                'Negro League',
            ],
            deafault: 'American League',
            required: true,
        },
        baseballHoF: {
            type: Boolean,
            default: false,
            required: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
)

module.exports = model('Player', playerSchema)
