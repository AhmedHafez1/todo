const express = require('express');
const { body, param } = require('express-validator');
const validator = require('./middlewares/validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/todos', async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

app.get('/todos/:id', [param('id').isInt()], validator, async (req, res) => {
  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(req.params.id) },
  });

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
  async (req, res) => {
    const { description, status } = req.body;
    const todo = await prisma.todo.create({ data: { description, status } });

    res.status(201).json(todo);
  }
);

app.put(
  '/todos/:id',
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('description')
      .isString()
      .withMessage('Description must be a string')
      .notEmpty()
      .withMessage('Description is required'),
    body('status')
      .isIn(['pending', 'completed'])
      .withMessage('Status must be "pending" or "completed"')
      .notEmpty()
      .withMessage('Status is required'),
  ],
  validator,
  async (req, res) => {
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(req.params.id) },
      data: {
        description: req.body.description || todo.description,
        status: req.body.status || todo.status,
      },
    });
    res.json(updatedTodo);
  }
);

app.delete('/todos/:id', async (req, res) => {
  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!todo) {
    return res.status(404).send('Todo not found');
  }
  await prisma.todo.delete({ where: { id: parseInt(req.params.id) } });
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
