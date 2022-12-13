const express = require('express')
const {request, response} = require("express");
const app = express()

let  persons= [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())

app.use(requestLogger)

app.get('/api/persons', (req, res) => {
    res.json(persons)

})
//get method
app.get('/info', (request, response) => {
    const timezoneOffset =new Date().toString()
    console.log(timezoneOffset);
    response.send(`<div>
          <p>Phonebook has info for ${persons.length} people</p>
        </div>
        <div>
          <p>${timezoneOffset}</p>
        </div>`
    )
})

//post method
app.post('/api/persons', (req,res) =>{
    const body = req.body
    console.log("value of body is ", body)
    const generateId = () => {
        const maxId = persons.length > 0
            ? Math.max(...persons.map(n => n.id))
            : 0
        return maxId + 1
    }
    console.log(generateId)
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const content = {
        id: generateId(),
        name: body.name,
        number: body.number

    }

    console.log(body)
    allPersons= persons.concat(content)
    console.log(allPersons)

    response.json(allPersons)


})

//delete method
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    let filteredPersons = persons.filter(data => data.id !== id)
    console.log(filteredPersons)

    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const foundId = persons.find(data => data.id === id)

    if (foundId) {
        response.json(foundId)
    } else {
        response.status(404).end()
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const nameMissing = (req, res) =>{
    res.status(404).send({
        error: "name must be unique"
    })
}
app.use(nameMissing)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
