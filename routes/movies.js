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

router.put('/upload', multer({ storage: diskStorage }).single('photo'), (req, res) => {
    const file = req.file
    console.log(file)
    if (!file) {
        res.status(400).send({
            status: false,
            data: 'No file is selected.'
        })
        }
        movies[req.query.index].photo = req.file.path
        res.send(file)
})

// Create a PUT route to update photo to the database
router.put('/:id', upload.single('photo'), (req, res) => {
    const file = req.file
    if (!file){
        return res.status(400).json({
            status: false,
            data: 'No file is selected.'
        })
    }
    const photoPath = file.path

    const insertQuery = 'UPDATE movies SET photo = $1 WHERE id = $2 RETURNING *'

    pool.query(insertQuery, [photoPath, req.params.id], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({
                status: false,
                error: 'An error ocurred while processing your request.'
            })
        }

        const movies = result.rows[0]
        res.json({
            status: true,
            data: movies,
        })
    })
})

router.get('/movies', function (req, res){
    pool.query('SELECT * FROM movies', (error, results) => {
        if (error) {
            throw error
        }
        res.send(results.rows)
    })
})

module.exports = router