var express = require('express')
var app = express()
var pool = require('./models/queries')
var movies = require('./routes/movies')
var cors = require('cors')

app.use('/movies', movies)
app.use(cors())

pool.connect((err, res) => {
    console.log(err)
    console.log('connected')
})

app.listen(3000, function (){
    console.log('server running')
})