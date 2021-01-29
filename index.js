const express = require('express')
const bodyParse = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
var pathComp = require("express-static");
const path = require('path');
process.env.PWD = process.cwd();

const app = express()
const PORT = process.env.PORT || 2000;
app.use(bodyParse.json())
app.use(cors())

const mongoClient = mongoose.connect('mongodb+srv://admin:admin@myfisrtlerningapp.zbcua.mongodb.net/todo?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
mongoClient.then(res => {
    console.log('mongoConnected')
}).catch(err => console.log(err))
const Todo_schema = new mongoose.Schema({
    id: String,
    item: String,
    isEdit: Boolean
})
const TODO = mongoose.model('todo', Todo_schema, 'todo');

app.get('/getItems', async (req, res) => {
    await TODO.find({}).then((data) => res.json(data)).catch((err) => res.json(err))
})

app.post('/addItem', async (req, res) => {
    let items = {
        id: req.body.id,
        item: req.body.item
    }
    const insert_item = await TODO.insertMany([items]).then((data) => data).catch((err) => err)
    res.json(insert_item)
})

app.post('/updateItem', async (req, res) => {
    let items = {
        id: req.body.id,
        item: req.body.item
    }
    let findAndUpdate = await TODO.updateOne({ id: items.id }, items).then(data => data).catch(err => err)
    res.json(findAndUpdate.ok)
})

app.post('/remove', async (req, res) => {
    let id = req.body.id
    let removeItem = await TODO.deleteOne({ id: id }).then(data => data).catch(err => err)
    console.log(removeItem)
    res.json(removeItem.ok)
})
app.use(pathComp(process.env.PWD + '/client/build'))
app.get('/', function (req, res) {
    const index = path.join(process.env.PWD, '/client/build/index.html');
    console.log(path)
    res.sendFile(index);
});

app.listen(PORT, () => console.log(`Server Start on Port ${PORT}`))