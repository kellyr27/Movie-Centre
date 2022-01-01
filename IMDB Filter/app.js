const express = require('express')
const res = require('express/lib/response')
const methodOverride = require('method-override')
const app = express()
const path = require('path')
const { v4: uuid } = require('uuid')

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))

// To parse incoming JSON in POST request body:
app.use(express.json())

// To 'fake' put/patch/delete requests:
app.use(methodOverride('_method'))

let movies_list = [{id: uuid(), title: "Star Trek", rating: 3},
    {id: uuid(), title: "Moon", rating: 5}, 
    {id: uuid(), title: "Pokemon", rating: 4}]

// Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/movies', (req, res) => {
    res.render('index', { movies_list })
})

app.get('/movies/new', (req, res) => {
    res.render('new')
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies_list.find(m => m.id === id)
    res.render('show', {movie})
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
})


app.get('*', (req, res) => {
    res.redirect('/movies')
    // res.send("This path does not exist! Redirecting to /movies")
})