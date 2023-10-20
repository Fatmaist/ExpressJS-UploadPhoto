var express = require('express')
var app = express()
var pool = require('./queries')
var movies = require('./routes/movies')

app.use('/movies', movies)

pool.connect((err, res) => {
    console.log(err)
    console.log('connected')
})

app.listen(3000)