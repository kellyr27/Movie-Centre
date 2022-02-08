const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Movie = require('../models/movie')

// Database connection
mongoose.connect('mongodb://localhost:27017/movie-centre-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Mongoose connection error: '))
    db.once('open', () => {
    console.log('Database connected.')
})


// Reads the file names
function readFileNames (dir) {
    return new Promise((res, rej) => {
        fs.readdir(path.join(__dirname,'../', dir), (err, data) => {
            if (err) {
                return rej(err)
            }
            res(data)
        })
    })
}

// Read the file contents
function readFileData (dir, file) {
    return new Promise ((res, rej) => {
        fs.readFile(path.join(__dirname,'../', dir, '/', file), 'utf8' , (err, data) => {
            if (err) {
                return rej(err)
            }
            res(data)
        })
    })
}

// Convert file contents to Objects
function convertCSVtoObject (fileRaw) {
    // Split file into rows
    const rows = fileRaw.split('\r\n')

    // Split row (currently a string) into an array (of strings)
    const rowsArray = []
    for (let row of rows) {
        
        let currentInDoubleQuotes = false
        let current = ''
        let currentArr = []
        
        // Iterate through characters in the string
        for (let char of row) {

            if (char === '"') {
                currentInDoubleQuotes = !currentInDoubleQuotes
            }

            // If currently in double quotes
            if (currentInDoubleQuotes) {
                current += char
            }
            // If not currently in double quotes
            else {
                if (char === ',') {
                    currentArr.push(current)
                    current = ''
                }
                else {
                    current += char
                }
            }
        }
        
        // Add array to rowsArray
        currentArr.push(current)
        rowsArray.push(currentArr)
        currentArr = []
    }
    
    // Remove empties and Headings
    const rowsArrayFiltered = []
    for (let row of rowsArray) {
        if (row[0]) {
            if (row[0].startsWith('tt')) {
                rowsArrayFiltered.push(row)
            }
        }
    }

    // Convert data to the correct types
    const objArr = []
    for (let row of rowsArrayFiltered) {
        
        let currentMovie = {}

        // Const
        currentMovie.constIMDB = row[0]

        // Your Rating
        // Check if it is inputted
        if (row[1]) {
            currentMovie.yourRating = parseInt(row[1])
        }

        // Date Rated
        // Check if it is inputted
        if (row[2]) {
            let dateRatedArr = row[2].split('/')

            // Check that the day is 2 digit string
            if (dateRatedArr[0].length === 1) {
                dateRatedArr[0] = '0' + dateRatedArr[0]
            }

            currentMovie.dateRated = Date.parse(`${dateRatedArr[2]}-${dateRatedArr[1]}-${dateRatedArr[0]}`)
        }

        // Title
        currentMovie.title = row[3]

        // URL
        currentMovie.url = row[4]

        // Title Type
        currentMovie.titleType = row[5]

        // IMDB Rating
        // Check if it is inputted
        if (row[6]) {
            currentMovie.imdbRating = parseFloat(row[6])
        }

        // Runtime (mins)
        currentMovie.runtime = parseInt(row[7])

        // Year
        currentMovie.year = parseInt(row[8])

        // Genres
        let genres = row[9]
        // Remove double quotes
        if (genres.charAt(0) === '"') {
            genres = genres.slice(1, -1)
        }
        currentMovie.genres = genres.split(', ')

        // Num Votes
        currentMovie.numVotes = parseInt(row[10])

        // Release Date
        let dateReleasedArr = row[11].split('/')

        // Check that the day is 2 digit string
        if (dateReleasedArr[0].length === 1) {
            dateReleasedArr[0] = '0' + dateReleasedArr[0]
        }

        currentMovie.releaseDate = Date.parse(`${dateReleasedArr[2]}-${dateReleasedArr[1]}-${dateReleasedArr[0]}`)

        // Directors
        let directors = row[12]
        // Check if it is inputted
        if (directors) {
            // Remove double quotes
            if (directors.charAt(0) === '"') {
                directors = directors.slice(1, -1)
            }
            currentMovie.directors = directors.split(', ')
        }

        // Add movie Object to Array
        objArr.push(currentMovie)
    }

    return objArr
}

// Delete everything in the existing Movie database
async function deleteDatabase () {
    return new Promise ((res, rej) => {
        Movie.deleteMany({})
            .then(msg => {
                console.log('Existing database deleted')
                res()
            })
            .catch(err => {
                console.error('Failed to delete existing movie database.')
                rej()
            })
    })
}

// 
async function run (isSeed) {

    // Delete everything in current directory
    await deleteDatabase()

    // Direct path based on whether test upload or not
    let dir
    if (isSeed) {
        dir = 'seeds'
    }
    else {
        dir = 'uploads'
    }

    const files = await readFileNames(dir)
    
    // Iterate through every file
    for (let file of files) {

        // If the file is not a csv, do nothing
        if (!file.endsWith('.csv')) {
            continue
        }

        let fileRaw = await readFileData(dir, file)
        let objectArray = convertCSVtoObject(fileRaw)
        
        // Iterate through movies and add to database
        for (let obj of objectArray) {
           
            // Check if movie is already in database
            let isDatabase = await Movie.find({constIMDB: obj.constIMDB}).exec()

            if (isDatabase.length === 0) {
                // Save movie to the database
                const movie = new Movie(obj)
                await movie.save()
            }
        }
        
    }
}

run(true)

module.exports = run