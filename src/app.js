const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRoutes = require('./routes/api');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.use('/api', apiRoutes);

// Add the webhook route as requested by user explicitly
// "POST /webhooks/esimaccess"
app.use('/', apiRoutes); // apiRoutes already handles /webhooks/esimaccess

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;
