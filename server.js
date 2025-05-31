const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const uploadRouter = require('./routes/upload');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads folder statically (optional, mainly for debugging)
app.use('/uploads', express.static(uploadDir));

// Upload route
app.use('/upload', uploadRouter);

// Serve images by short id (no extension in URL)
app.get('/:id', (req, res) => {
  const id = req.params.id;
  try {
    const files = fs.readdirSync(uploadDir);
    const file = files.find(f => f.startsWith(id));
    if (!file) return res.status(404).send('Image not found');

    return res.sendFile(path.join(uploadDir, file));
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
