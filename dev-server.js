require('dotenv').config();
const express = require('express');
const { handler } = require('./netlify/functions/server');

const app = express();
const PORT = process.env.PORT || 3000;

// Wrap Netlify function for local development
app.use('/.netlify/functions/server/*', async (req, res) => {
  try {
    const event = {
      path: req.path,
      httpMethod: req.method,
      headers: req.headers,
      queryStringParameters: req.query,
      body: JSON.stringify(req.body)
    };

    const context = {
      callbackWaitsForEmptyEventLoop: false
    };

    const response = await handler(event, context);
    
    res.status(response.statusCode).send(JSON.parse(response.body));
  } catch (error) {
    console.error('Dev server error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add redirect middleware
app.use('/api/*', (req, res) => {
  const newPath = req.path.replace('/api', '/.netlify/functions/server');
  req.url = newPath;
  app._router.handle(req, res);
});

app.listen(PORT, () => {
  console.log(`Development server running on port ${PORT}`);
});
