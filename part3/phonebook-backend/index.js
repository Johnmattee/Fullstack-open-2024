const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const app = express();

app.use(cors())
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
const format = ':method :url :status :res[content-length] - :response-time ms :body';
app.use(morgan(format));

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
];

app.get('/', (req, res) => {
    res.send('<h1>Welcome!</h1>');
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const time = new Date().toString();
    const entries = persons.length;
    res.send(`<p>Phonebook has info for ${entries} people<br><br>${time}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const person = req.body;
    person.id = Math.ceil(Math.random() * 1000).toString();
    const isExist = persons.some(item=>item.name === person.name)
    
    if(isExist){
        res.status(400).json({error:'name already exist'})
    }
   if(!person.name && !person.number){
        res.status(400).json({error: 'name or number is missing'})
    } 
    
        persons = persons.concat(person);
        res.json(person);
    
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
