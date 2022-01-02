const express = require('express')
const fileUpload = require('express-fileupload')
const methodOverride = require('method-override')
const app = express()
const path = require('path')
const fs = require('fs');
const { v4: uuid } = require('uuid')

const csv = require("../IMDB Filter/js/csvMaster.js")


app.use(fileUpload())

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))

// To parse incoming JSON in POST request body:
app.use(express.json())

// To 'fake' put/patch/delete requests:
app.use(methodOverride('_method'))

let master_list = []
const titles = ['Const_IMDB', 'Your Rating', 'Date Rated',  'Title', 'URL', 'Title Type', 'IMDb Rating', 'Runtime (mins)', 'Year', 'Genres', 'Num Votes', 'Release Date', 'Directors']
let movies_list = [{id: uuid(), title: "Star Trek", rating: 3},
    {id: uuid(), title: "Moon", rating: 5}, 
    {id: uuid(), title: "Pokemon", rating: 4}]

// Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/upload', (req, res) => {
    res.render('upload')
})

app.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/uploads/' + sampleFile.name;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err)
      }
      
      res.send('File uploaded!');
    });
    setTimeout(() => {
        master_list = csv()
        // console.log(master_list)
    }, 2000) 
  });

app.get('/movies', (req, res) => {
    res.render('index', { master_list, titles })
})

app.get('/movies/new', (req, res) => {
    res.render('new')
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = master_list.find(m => m["Const_IMDB"] === id)
    res.render('show', {movie, titles})
})

app.get('/movies/:id/edit', (req, res) => {
    const { id } = req.params
    const movie = movies_list.find(m => m.id === id)
    res.render('edit', {movie})
})

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params
    const newMovieRating = req.body.rating
    console.log(newMovieRating)
    const movie = movies_list.find(m => m.id === id)
    movie.rating = parseInt(newMovieRating)
    res.redirect('/movies')
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    movies_list = movies_list.filter(m => m.id !== id);
    res.redirect('/movies')
})

app.post('/movies', (req, res) => {
    const {movieTitle, movieRating} = req.body
    movies_list.push({title: movieTitle, rating: movieRating, id: uuid()})
    res.redirect('/movies')
})

app.listen(3000, () => {
    console.log('Listening on Port 3000')

    const directory = path.join(__dirname, '/uploads');

    fs.readdir(directory, (err, files) => {
        if (err) {
            throw err;
        }

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) {
                    throw err;
                }
            });
        }
    });
})


app.get('*', (req, res) => {
    res.redirect('/movies')
    // res.send("This path does not exist! Redirecting to /movies")
})