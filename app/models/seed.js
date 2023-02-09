// use `npm run seed` to run this script

const mongoose = require('mongoose')
const Player = require('./player')
const db = require('../../config/db')

const startPets = [
    {
        name: 'Ty Cobb',
        positions: ['CF', 'RF'],
        leagues: ['American League'],
        baseballHoF: true,
    },
    {
        name: 'Satchel Paige',
        positions: ['P'],
        leagues: [
            'Negro American League',
            'Negro National League',
            'American League',
        ],
        baseballHoF: true,
    },
    {
        name: 'Shohei Ohtani',
        positions: ['P', 'DH'],
        leagues: ['American League'],
        baseballHoF: false,
    },
    {
        name: 'Roberto Clemente',
        positions: ['RF'],
        leagues: ['National League'],
        baseballHoF: true,
    },
]

// first we connect to the db
// then remove all pets
// then add the start pets
// and always close the connection, whether its a success or failure

mongoose
    .connect(db, {
        useNewUrlParser: true,
    })
    .then(() => {
        Player.deleteMany()
            .then(deletedPets => {
                console.log('the deleted pets:', deletedPets)
                // now we add our pets to the db
                Player.create(startPets)
                    .then(newPets => {
                        console.log('the new pets', newPets)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })
