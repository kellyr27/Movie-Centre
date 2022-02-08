// Step 1 - Determine what the file(s) in the directory are

// Step 2 - Check that the files are CSVs

// Step 3 - Upload data from each file

    // Convert the CSV to an array

        // Remove empties and Headings

    // Upload each movie into the database
        
        // Remove duplicates


// Step 4 - Delete files

const fs = require('fs')
const path = require('path')


// Reads the file names
function readFileNames () {
    return new Promise((res, rej) => {
        fs.readdir(path.join(__dirname,'../seeds'), (err, data) => {
            if (err) {
                return rej(err)
            }
            res(data)
        })
    })
}

// Read the file contents
function readFileData (file) {
    return new Promise ((res, rej) => {
        fs.readFile(path.join(__dirname,'../seeds/', file), 'utf8' , (err, data) => {
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

async function run () {
    const files = await readFileNames()
    
    // Iterate through every file
    for (let file of files) {

        // If the file is not a csv, do nothing
        if (!file.endsWith('.csv')) {
            continue
        }

        let fileRaw = await readFileData(file)
        let objectArray = convertCSVtoObject(fileRaw)
        
        
    }
}

run()

module.exports = run