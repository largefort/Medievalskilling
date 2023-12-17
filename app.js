const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Example route
app.get('/', (req, res) => {
  res.send('CORS enabled for all origins!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
