const express = require('express');
const basicAuth = require('express-basic-auth');
const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');
const { spawn } = require('child_process');
const { parseBookmarks, getAllBookmarks, getStats } = require('./parse-bookmarks');

const app = express();
const PORT = 8080;
const WORKSPACE = '/home/administrator/vayron';

// Basic auth middleware
app.use(basicAuth({
  users: { 'vayron': 'mission-control-2026' },
  challenge: true,
  realm: 'Mission Control'
}));

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Recursive file scanner
async function scanDirectory(dir, extensions = []) {
  const results = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules, .git, etc
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }
      
      if (entry.isDirectory()) {
        const subResults = await scanDirectory(fullPath, extensions);
        results.push(...subResults);
      } else if (entry.isFile()) {
        if (extensions.length === 0 || extensions.some(ext => entry.name.endsWith(ext))) {
          const stats = await fs.stat(fullPath);
          results.push({
            name: entry.name,
            path: fullPath.replace(WORKSPACE, ''),
            fullPath: fullPath,
            size: stats.size,
            modified: stats.mtime.toISOString()
          });
        }
      }
    }
  } catch (err) {
    console.error(`Error scanning ${dir}:`, err.message);
  }
  
  return results;
}

// Get all documents
app.get('/api/documents', async (req, res) => {
  try {
    const docs = await scanDirectory(WORKSPACE, ['.md', '.txt', '.json']);
    
    // Sort by modified date, newest first
    docs.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await scanDirectory(WORKSPACE, ['.jpg', '.jpeg', '.png', '.gif', '.webp']);
    
    // Sort by modified date, newest first
    images.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get file content
app.get('/api/file/*', async (req, res) => {
  try {
    const filePath = path.join(WORKSPACE, req.params[0]);
    
    // Security check - ensure path is within workspace
    if (!filePath.startsWith(WORKSPACE)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve images
app.get('/image/*', async (req, res) => {
  try {
    const filePath = path.join(WORKSPACE, req.params[0]);
    
    // Security check
    if (!filePath.startsWith(WORKSPACE)) {
      return res.status(403).send('Access denied');
    }
    
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Search documents
app.get('/api/search', async (req, res) => {
  const query = req.query.q?.toLowerCase();
  
  if (!query) {
    return res.json([]);
  }
  
  try {
    const docs = await scanDirectory(WORKSPACE, ['.md', '.txt', '.json']);
    const results = [];
    
    for (const doc of docs) {
      try {
        const content = await fs.readFile(doc.fullPath, 'utf-8');
        
        // Check if query matches filename or content
        if (doc.name.toLowerCase().includes(query) || 
            content.toLowerCase().includes(query)) {
          
          // Find matching lines
          const lines = content.split('\n');
          const matches = [];
          
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes(query)) {
              matches.push({
                line: idx + 1,
                text: line.trim()
              });
            }
          });
          
          results.push({
            ...doc,
            matches: matches.slice(0, 5) // Max 5 matches per file
          });
        }
      } catch (err) {
        // Skip files that can't be read
        continue;
      }
    }
    
    // Sort by relevance (number of matches)
    results.sort((a, b) => (b.matches?.length || 0) - (a.matches?.length || 0));
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// X Bookmarks endpoints
const BOOKMARKS_DIR = path.join(WORKSPACE, 'x-bookmarks');

app.get('/api/bookmarks/accounts', (req, res) => {
  try {
    const accounts = parseBookmarks(BOOKMARKS_DIR);
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookmarks/all', (req, res) => {
  try {
    const bookmarks = getAllBookmarks(BOOKMARKS_DIR);
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookmarks/stats', (req, res) => {
  try {
    const stats = getStats(BOOKMARKS_DIR);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SiS-dokument generation
app.post('/api/sis-generate', async (req, res) => {
  const { title, content, header_choice, footer_choice, custom_header, custom_footer, output_name } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Titel och innehåll krävs' });
  }

  const SIS_DIR = path.join(WORKSPACE, 'sis-dokument');
  const VENV_PYTHON = path.join(SIS_DIR, 'venv/bin/python3');
  const SCRIPT = path.join(SIS_DIR, 'generate_pdf_v2.py');
  
  // Generate output filename if not provided
  const fileName = output_name || `dokument_${Date.now()}`;
  
  // Create temporary Python script to call generator
  const tempScript = `
import sys
sys.path.insert(0, '${SIS_DIR}')
from generate_pdf_v2 import PDFGeneratorV2

gen = PDFGeneratorV2()
gen.create_document(
    title=${JSON.stringify(title)},
    content=${JSON.stringify(content)},
    header_choice=${JSON.stringify(header_choice)},
    footer_choice=${JSON.stringify(footer_choice)},
    custom_header=${JSON.stringify(custom_header)},
    custom_footer=${JSON.stringify(custom_footer)},
    output_name=${JSON.stringify(fileName)}
)
`;

  try {
    // Execute Python script
    const python = spawn(VENV_PYTHON, ['-c', tempScript], {
      cwd: SIS_DIR
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    python.on('close', (code) => {
      if (code === 0) {
        res.json({
          success: true,
          message: 'Dokument genererat!',
          pdf_file: `${fileName}.pdf`,
          docx_file: `${fileName}.docx`
        });
      } else {
        console.error('Python error:', stderr);
        res.status(500).json({ 
          error: 'Kunde inte generera dokument',
          details: stderr
        });
      }
    });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Download generated SiS document
app.get('/api/sis-download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(WORKSPACE, 'sis-dokument', filename);
  
  // Security check
  if (!filePath.startsWith(path.join(WORKSPACE, 'sis-dokument'))) {
    return res.status(403).send('Access denied');
  }
  
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).send('Fil hittades inte');
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    workspace: WORKSPACE,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, 'localhost', () => {
  console.log(`🎯 Mission Control running on http://localhost:${PORT}`);
  console.log(`📂 Workspace: ${WORKSPACE}`);
  console.log(`🔐 Auth: vayron / mission-control-2026`);
});
