const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static assets from the project directory
app.use(express.static(path.join(__dirname), {
  extensions: ['html', 'htm']
}));

// Fallback route: serve index.html for non-asset routes
app.get('*', (req, res) => {
  if (req.path.includes('.')) {
    return res.status(404).send('Not Found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
