var express = require('express')
var router = express.Router()
var pool = require('../queries')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')

router.use(bodyParser.json())
router.use(express.json())

router.use('/upload', express.static(path.join(__dirname, 'upload')))

var movies = [
    //get data movie from database from table movies
    pool.query('SELECT * FROM movies', (err, result) => {
        if (err) {
            throw err
        }
        movies = result.rows
    })
]

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/upload'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: diskStorage })

module.exports = router