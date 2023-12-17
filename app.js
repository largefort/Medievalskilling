const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello, world! CORS is enabled for all origins.');
});

// Another example route
app.get('/data', (req, res) => {
  res.json({ message: 'This is a JSON response from your CORS-enabled server.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
