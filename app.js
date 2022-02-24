// Packages and frameworks
const express = require('express')                          // Web pplication framework
// const fileUpload = require('express-fileupload')            // Middleware used to upload files with express
const methodOverride = require('method-override')           // Middleware used to use HTTP verbs such as PUT or DELETE
const ejsMate = require('ejs-mate')                         // Use templating with EJS
// const morgan = require('morgan')
const responseTime = require('response-time')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Movie = require('./models/movie')
const List = require('./models/lists')
const User = require('./models/user')

const path = require('path')                                // Path module

const app = express()
// app.use(fileUpload())
// app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))
app.use(responseTime())
app.use(express.urlencoded({ extended: true }))             // To parse form data in POST request body
app.use(express.json())                                     // To parse incoming JSON in POST request body
app.use(methodOverride('_method'))                          // To 'fake' put/patch/delete requests
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'tempsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.set('view engine', 'ejs')                               // EJS set up
app.set('views', path.join(__dirname, 'views'))             // Views folder
app.engine('ejs', ejsMate)                                  // Use ejsMate with express


// Database connection
mongoose.connect('mongodb://localhost:27017/movie-centre-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error: '))
db.once('open', async () => {
    console.log('Database connected.')
    // Delete everything in the existing Movie database
    await Movie.deleteMany({})
        .then(msg => {
            console.log('Existing Movie database deleted')
        })
        .catch(err => {
            console.log('Failed to delete existing Movie database.')
        })
    // Delete everything in the existing List database
    await List.deleteMany({})
        .then(msg => {
            console.log('Existing List database deleted')
        })
        .catch(err => {
            console.log('Failed to delete existing List database.')
        })
})


// MIDDLEWARE
app.use(responseTime((req, res, time) => {
    console.log(`${req.method.padEnd(6)} ${res.statusCode} ${time.toFixed(1).padStart(7).padEnd(7+3)} ${req.originalUrl}`)
}))


app.use((req, res, next) => {
    // console.log('Middleware')
    // req.requestTime = Date.now()
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.get('/testuser', async (req, res) => {
    const user = new User({
        email: 'kelly@gmail.com',
        username: 'kellly'
    })
    const newUser = await User.register(user, 'chicken')
    res.send(newUser)
})


const userRoutes = require('./routes/users.js')
app.use('/', userRoutes)

// -------------------------------/UPLOAD-----------------------------------------------------------------------------------------

const uploadRoutes = require('./routes/upload.js')
app.use('/upload', uploadRoutes)

// -------------------------------/MOVIES-----------------------------------------------------------------------------------------

const movieRoutes = require('./routes/movies.js')
app.use('/movies', movieRoutes)

// -------------------------------/CREATED_LISTS-----------------------------------------------------------------------------------------

const createdListsRoutes = require('./routes/createdLists.js')
app.use('/created_lists', createdListsRoutes)

// -------------------------------SERVER/START-UP-----------------------------------------------------------------------------------------

app.listen(3000, () => {
    console.log('Listening on Port 3000')
})

// Redirect routes to /movies
app.get('*', (req, res, next) => {
    next(new ExpressError('Page not found.', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if (!err.message) {
        err.message = 'Error. Something went wrong!'
    }
    res.status(statusCode).render('error', {pageTitle: 'Error Page', err})
})