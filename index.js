const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const requestLogger = (req, _res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
};

app.use(requestLogger);

let notes = [
  {
    "id": "7de6",
    "name": "Ruben",
    "number": "56151"
},
{
    "id": "8183",
    "name": "Humberto",
    "number": "03215641"
},
{
    "id": "2300",
    "name": "Luis",
    "number": "654651"
},
{
    "id": "9514",
    "name": "Fran",
    "number": "5451023230"
},
{
    "id": "7efa",
    "name": "Tomas",
    "number": "5432514534"
},
{
    "id": "1f31",
    "name": "Jose",
    "number": "1111111"
}
  ];

app.get('/', (_req, res) => {
    res.send('<h1>API REST FROM NOTES</h1>');
});

app.get('/persons', (_req, res) => {
    res.json(notes);
});

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
});

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0;
    return maxId + 1;
};

app.post('/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    notes = [...notes, note];
    res.json(note);
});

app.put('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const note = notes.find(note => note.id === id);
    if (!note) {
        return res.status(404).end();
    }

    const updatedNote = {
        ...note,
        important: body.important
    };

    notes = notes.map(note => note.id !== id ? note : updatedNote);
    res.json(updatedNote);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});