// Packages and frameworks
const express = require('express')                          // Server
const methodOverride = require('method-override')           // Middleware used to use HTTP verbs such as PUT or DELETE
const ejsMate = require('ejs-mate')
const responseTime = require('response-time')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')
const path = require('path')                                // Path module
const app = express()

const userRoutes = require('./routes/users.js')
const uploadRoutes = require('./routes/upload.js')
const movieRoutes = require('./routes/movies.js')
const createdListsRoutes = require('./routes/createdLists.js')

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
app.set('view engine', 'ejs')                               // EJS set up
app.set('views', path.join(__dirname, 'views'))             // Views folder
app.engine('ejs', ejsMate)                                  // Use ejsMate with express

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Database connection
mongoose.connect('mongodb://localhost:27017/movie-centre-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose connection error: '))
db.once('open', async () => {
    console.log('Database connected.')
})


// Logger middleware
app.use(responseTime((req, res, time) => {
    console.log(`${req.method.padEnd(6)} ${res.statusCode} ${time.toFixed(1).padStart(7).padEnd(7+3)} ${req.originalUrl}`)
}))

// Flash middleware
app.use((req, res, next) => {
    req.requestTime = Date.now()
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    if (req.user) {
        res.locals.username = req.user.username
    }
    next()
})

// Routes
app.use('/', userRoutes)
app.use('/upload', uploadRoutes)
app.use('/movies', movieRoutes)
app.use('/created_lists', createdListsRoutes)

// Route does not exist
app.get('*', (req, res, next) => {
    next(new ExpressError('Page not found.', 404))
})

// Error middleware
app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if (!err.message) {
        err.message = 'Error. Something went wrong!'
    }
    res.status(statusCode).render('error', {pageTitle: 'Error Page', err})
})

// Server start
app.listen(3000, () => {
    console.log('Listening on Port 3000')
})