const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const cors = require('cors');


const url = 'mongodb://127.0.0.1:27017'

// Make sure you place body-parser before your CRUD handlers!
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

const dbName = 'cv'
let db


MongoClient.connect(url, { useNewUrlParser: true })
    .then(client => {
        db = client.db(dbName)

        console.log(`Connected MongoDB: ${url}`)
        console.log(`Database: ${dbName}`)

        app.listen(3000, function () {
            console.log('listening on 3000')
        });

        app.get('/', (req, res) => {
            res.send(true);
            // ...
        });

        app.get('/personas', (req, res) => {
            if (req.query.q) {
                db.collection('personas').find({ $or: [{ 'nombreCompleto': { $regex: req.query.q.toUpperCase() } }, { 'nombreCompleto': { $regex: req.query.q.toLocaleLowerCase() } }] }).toArray()
                    .then(results => {
                        res.send(results)
                    })
                    .catch(error => console.error(error))
            } else {
                db.collection('personas').find().toArray()
                    .then(results => {
                        res.send(results)
                    })
                    .catch(error => console.error(error))
            }

            // ...
        });


        app.get('/municipios', (req, res) => {
            db.collection('municipios').find().toArray()
                .then(results => {
                    res.send(results)
                })
                .catch(error => console.error(error))
            // ...
        });

        app.post('/savePersona', (req, res) => {
            db.collection('personas').insertOne(req.body)
                .then(result => {
                    console.log(req.body);
                    res.send(result.insertedId)
                })
                .catch(error => console.error(error))
        });

        app.put('/updatePersona', (req, res) => {
            db.collection('personas').updateOne(
                { 'dui': req.body.dui },
                {
                    $set: {
                        'nombreCompleto': req.body.nombreCompleto,
                        'sexo': req.body.sexo,
                        'domicilio': req.body.domicilio
                    }
                }
            )
                .then(result => {
                    console.log(result);
                    res.send(result)
                })
                .catch(error => console.error(error))
        });
    })
    .catch(console.error)