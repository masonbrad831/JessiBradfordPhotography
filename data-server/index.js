const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_DIR = path.join(__dirname, '../Data');

app.use(cors());
app.use(express.json());

// Helper to get file path
function getFilePath(resource) {
  return path.join(DATA_DIR, `${resource}.json`);
}

// GET all data for a resource
app.get('/api/:resource', (req, res) => {
  const filePath = getFilePath(req.params.resource);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') return res.status(404).json({ error: 'Not found' });
      return res.status(500).json({ error: 'Server error' });
    }
    try {
      console.log('Reading file:', filePath, 'Contents:', data); // Debug log
      res.json(JSON.parse(data));
    } catch (e) {
      console.error('JSON parse error:', e); // Debug log
      res.status(500).json({ error: 'Invalid JSON' });
    }
  });
});

// POST to create/replace data for a resource
app.post('/api/:resource', (req, res) => {
  const filePath = getFilePath(req.params.resource);
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true });
  });
});

// PATCH to update part of a resource (merge)
app.patch('/api/:resource', (req, res) => {
  const filePath = getFilePath(req.params.resource);
  fs.readFile(filePath, 'utf8', (err, data) => {
    let current = {};
    if (!err) {
      try { current = JSON.parse(data); } catch {}
    }
    const updated = { ...current, ...req.body };
    fs.writeFile(filePath, JSON.stringify(updated, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: 'Server error' });
      res.json({ success: true });
    });
  });
});

// DELETE a resource
app.delete('/api/:resource', (req, res) => {
  const filePath = getFilePath(req.params.resource);
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ error: 'Server error' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Data server running on http://localhost:${PORT}`);
}); 