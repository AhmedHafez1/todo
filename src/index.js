const express = require('express');
const { body, param } = require('express-validator');
const todos = require('./todos.js');
const validator = require('./middlewares/validator');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.get('/todos/:id', [param('id').isInt()], validator, (req, res) => {
  const todo = todos.find((todo) => todo.id === parseInt(req.params.id));
  if (!todo) {
    res.status(404).send('Todo not found');
  } else {
    res.json(todo);
  }
});

app.post(
  '/todos',
  [
    body('description')
      .isString()
      .withMessage('Description must be a string')
      .notEmpty()
      .withMessage('Description is required'),
    body('status')
      .optional()
      .isIn(['pending', 'completed'])
      .withMessage('Status must be "pending" or "completed"'),
  ],
  validator,
  (req, res) => {
    const todo = req.body;
    todo.id = todos.length + 1;
    todo.status = todo.status || 'pending';
    todos.push(todo);
    res.status(201).json(todo);
  }
);

app.put(
  '/todos/:id',
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description must be a string'),
    body('status')
      .isIn(['pending', 'completed'])
      .withMessage('Status must be "pending" or "completed"'),
  ],
  validator,
  (req, res) => {
    const todo = todos.find((todo) => todo.id === parseInt(req.params.id));
    if (!todo) {
      res.status(404).send('Todo not found');
    } else {
      todo.description = req.body.description ?? todo.description;
      todo.status = req.body.status ?? todo.status;
      res.json(todo);
    }
  }
);

app.delete('/todos/:id', (req, res) => {
  const todo = todos.find((todo) => todo.id === parseInt(req.params.id));
  if (!todo) {
    res.status(404).send('Todo not found');
  } else {
    todos.splice(todos.indexOf(todo), 1);
    res.status(204).send();
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
