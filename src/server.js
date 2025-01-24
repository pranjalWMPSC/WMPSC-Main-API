const express = require('express');
const app = express();
const port = 3000;

// ...existing code...
const dashboardRoutes = require('./routes/dashboard');

// ...existing code...
// Add this before other routes
app.use('/dashboard', dashboardRoutes);

// ...existing code...

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
