const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillGraph',
    database: process.env.COGNODB_URI ? 'configured' : 'not-configured'
  });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err);

  const isDbError =
    err && (
      /cognodb|neo4j|database|connection/i.test(err.message || '') ||
      err.code === 'ECONNREFUSED' ||
      err.code === 'ETIMEDOUT'
    );

  const message = isDbError ? 'Unable to connect to SkillGraph.' : (err.message || 'Something went wrong.');
  const statusCode = isDbError ? 503 : (err.statusCode || 500);

  res.status(statusCode).json({ message });
});

module.exports = app;
