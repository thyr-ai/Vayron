// State
let allDocuments = [];
let allImages = [];
let searchTimeout = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSearch();
  initModal();
  loadDocuments();
  loadImages();
});

// Tab switching
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      // Update buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update content
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`${tab}-tab`).classList.add('active');
    });
  });
}

// Search
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search');
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length > 0) {
      searchTimeout = setTimeout(() => searchDocuments(query), 300);
    } else {
      displayDocuments(allDocuments);
    }
  });
  
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    displayDocuments(allDocuments);
  });
}

// Modal
function initModal() {
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.modal-close');
  
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Load documents
async function loadDocuments() {
  try {
    const response = await fetch('/api/documents');
    allDocuments = await response.json();
    displayDocuments(allDocuments);
  } catch (err) {
    console.error('Failed to load documents:', err);
    document.getElementById('documents-list').innerHTML = 
      '<div class="loading" style="color: #ff4444;">Fel vid laddning av dokument</div>';
  }
}

// Display documents
function displayDocuments(docs) {
  const container = document.getElementById('documents-list');
  
  if (docs.length === 0) {
    container.innerHTML = '<div class="loading">Inga dokument hittades</div>';
    return;
  }
  
  container.innerHTML = docs.map(doc => {
    const date = new Date(doc.modified).toLocaleString('sv-SE');
    const sizeKB = (doc.size / 1024).toFixed(1);
    
    let matchesHtml = '';
    if (doc.matches && doc.matches.length > 0) {
      matchesHtml = `
        <div class="doc-matches">
          <strong>Matchningar:</strong>
          ${doc.matches.map(m => `
            <div class="match-line">
              <small>Rad ${m.line}:</small> ${highlightSearch(m.text)}
            </div>
          `).join('')}
        </div>
      `;
    }
    
    return `
      <div class="doc-item" data-path="${doc.path}">
        <h3>${doc.name}</h3>
        <div class="doc-meta">
          <span>📂 ${doc.path}</span>
          <span>📅 ${date}</span>
          <span>💾 ${sizeKB} KB</span>
        </div>
        ${matchesHtml}
      </div>
    `;
  }).join('');
  
  // Add click handlers
  container.querySelectorAll('.doc-item').forEach(item => {
    item.addEventListener('click', () => {
      const path = item.dataset.path;
      viewDocument(path);
    });
  });
}

// Search documents
async function searchDocuments(query) {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const results = await response.json();
    displayDocuments(results);
  } catch (err) {
    console.error('Search failed:', err);
  }
}

// Highlight search terms
function highlightSearch(text) {
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();
  
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// View document
async function viewDocument(path) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = '<div class="loading">Laddar...</div>';
  modal.classList.add('active');
  
  try {
    const response = await fetch(`/api/file${path}`);
    const data = await response.json();
    
    modalBody.innerHTML = `
      <h2>${path.split('/').pop()}</h2>
      <p style="color: var(--text-dim); margin-bottom: 1rem;">
        📂 ${path}
      </p>
      <pre>${escapeHtml(data.content)}</pre>
    `;
  } catch (err) {
    modalBody.innerHTML = `
      <div style="color: #ff4444;">
        Kunde inte ladda dokumentet: ${err.message}
      </div>
    `;
  }
}

// Load images
async function loadImages() {
  try {
    const response = await fetch('/api/images');
    allImages = await response.json();
    displayImages(allImages);
  } catch (err) {
    console.error('Failed to load images:', err);
    document.getElementById('images-grid').innerHTML = 
      '<div class="loading" style="color: #ff4444;">Fel vid laddning av bilder</div>';
  }
}

// Display images
function displayImages(images) {
  const container = document.getElementById('images-grid');
  
  if (images.length === 0) {
    container.innerHTML = '<div class="loading">Inga bilder hittades</div>';
    return;
  }
  
  container.innerHTML = images.map(img => {
    const date = new Date(img.modified).toLocaleDateString('sv-SE');
    
    return `
      <div class="image-item" data-path="${img.path}">
        <img src="/image${img.path}" alt="${img.name}" loading="lazy">
        <div class="image-meta">
          <div class="name">${img.name}</div>
          <div class="date">📅 ${date}</div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add click handlers
  container.querySelectorAll('.image-item').forEach(item => {
    item.addEventListener('click', () => {
      const path = item.dataset.path;
      viewImage(path);
    });
  });
}

// View image
function viewImage(path) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = `
    <h2>${path.split('/').pop()}</h2>
    <p style="color: var(--text-dim); margin-bottom: 1rem;">
      📂 ${path}
    </p>
    <img src="/image${path}" alt="${path}">
  `;
  
  modal.classList.add('active');
}

// Helper: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
