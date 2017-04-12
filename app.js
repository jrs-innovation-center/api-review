const express = require('express')
const app = express()
const { getMed, listMedsByIngredient, addMed, updateMed, deleteMed } = require('./dal')
const { split } = require('ramda')
const bodyParser = require('body-parser')
const HTTPError = require('node-http-error')
const port = process.env.PORT || 8080
const cors = require('cors')

app.use(cors({
    credentials: true
}))
app.use(bodyParser.json())

///////////////////////
//   medications
//////////////////////

app.get('/medications', function(req, res, next) {
    const result = split(':', req.query.filter)
    listMedsByIngredient(result[1], function(err, meds) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.status(200).send(meds)
    })
})

app.post('/medications', function(req, res, next) {
    addMed(req.body, function(err, dalResponse) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.status(201).send(dalResponse)
    })
})

app.put('/medications/:id', function(req, res, next) {
    updateMed(req.body, function(err, dalResponse) {
        if (err) return next(new HTTPError(err.status, err.messsge, err))
        res.status(200).send(dalResponse)
    })
})

app.get('/medications/:id', function(req, res, next) {
    getMed(req.params.id, function(err, dalResponse) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.status(200).send(dalResponse)
    })
})

app.delete('/medications/:id', function(req, res, next) {
    deleteMed(req.params.id, function(err, dalResponse) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.status(200).send(dalResponse)

    })
})


app.get('/', function(req, res) {
    res.send('Welcome to the API!')
})

app.use(function(err, req, res, next) {
    console.log(req.method, " ", req.path, "error:  ", err)
    res.status(err.status || 500)
    res.send(err)
})

app.listen(port, function() {
    console.log("API is up and running on port ", port)
})
