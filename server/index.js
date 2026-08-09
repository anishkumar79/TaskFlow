require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./routes/tasks'));
app.use('/users', require('./routes/users'));
app.use('/notifications', require('./routes/notifications'));

// Central error handler — keeps stack traces out of API responses.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`TaskFlow API listening on 0.0.0.0:${PORT}`));
