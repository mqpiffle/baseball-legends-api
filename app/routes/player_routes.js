// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Player = require('../models/player')

// this is a collection of methods that help us detect situations when we need
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /players
router.get('/players', requireToken, (req, res, next) => {
    Player.find()
        .then(players => {
            // `players` will be an array of Mongoose documents
            // we want to convert each one to a POJO, so we use `.map` to
            // apply `.toObject` to each one
            return players.map(playere => player.toObject())
        })
        // respond with status 200 and JSON of the player
        .then(examples => res.status(200).json({ players: players }))
        // if an error occurs, pass it to the handler
        .catch(next)
})

// SHOW
// GET /players/5a7db6c74d55bc51bdf39793
router.get('/players/:id', requireToken, (req, res, next) => {
    // req.params.id will be set based on the `:id` in the route
    Player.findById(req.params.id)
        .then(handle404)
        // if `findById` is succesful, respond with 200 and "player" JSON
        .then(player => res.status(200).json({ player: player.toObject() }))
        // if an error occurs, pass it to the handler
        .catch(next)
})

// CREATE
// POST /players
router.post('/player', requireToken, (req, res, next) => {
    // set owner of new player to be current user
    req.body.player.owner = req.user.id

    Player.create(req.body.player)
        // respond to succesful `create` with status 201 and JSON of new "player"
        .then(player => {
            res.status(201).json({ player: player.toObject() })
        })
        // if an error occurs, pass it off to our error handler
        // the error handler needs the error message and the `res` object so that it
        // can send an error message back to the client
        .catch(next)
})

// UPDATE
// PATCH /players/5a7db6c74d55bc51bdf39793
router.patch('/players/:id', requireToken, removeBlanks, (req, res, next) => {
    // if the client attempts to change the `owner` property by including a new
    // owner, prevent that by deleting that key/value pair
    delete req.body.player.owner

    Player.findById(req.params.id)
        .then(handle404)
        .then(player => {
            // pass the `req` object and the Mongoose record to `requireOwnership`
            // it will throw an error if the current user isn't the owner
            requireOwnership(req, player)

            // pass the result of Mongoose's `.update` to the next `.then`
            return player.updateOne(req.body.player)
        })
        // if that succeeded, return 204 and no JSON
        .then(() => res.sendStatus(204))
        // if an error occurs, pass it to the handler
        .catch(next)
})

// DESTROY
// DELETE /player/5a7db6c74d55bc51bdf39793
router.delete('/players/:id', requireToken, (req, res, next) => {
    Player.findById(req.params.id)
        .then(handle404)
        .then(player => {
            // throw an error if current user doesn't own `player`
            requireOwnership(req, player)
            // delete the player ONLY IF the above didn't throw
            player.deleteOne()
        })
        // send back 204 and no content if the deletion succeeded
        .then(() => res.sendStatus(204))
        // if an error occurs, pass it to the handler
        .catch(next)
})

module.exports = router
