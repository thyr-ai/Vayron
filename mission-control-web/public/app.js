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
  const navItems = document.querySelectorAll('.nav-item[data-tab]');
  const pageTitle = document.getElementById('page-title');
  
  const tabTitles = {
    kanban: '📋 Kanban Board',
    bookmarks: '🐦 X Bookmarks',
    documents: '📄 Dokument',
    images: '🖼️ Bilder',
    sis: '📝 SiS-dokument'
  };
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      
      // Update navigation
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      
      // Update page title
      pageTitle.textContent = tabTitles[tab] || tab;
      
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
        <div class="doc-header">
          <h3>${doc.name}</h3>
          <div class="doc-meta">
            <span>📂 ${doc.path}</span>
            <span>📅 ${date}</span>
            <span>💾 ${sizeKB} KB</span>
          </div>
          ${matchesHtml}
        </div>
        <div class="doc-content-preview" style="display: none;">
          <div class="loading">Laddar...</div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add click handlers
  container.querySelectorAll('.doc-item').forEach(item => {
    const header = item.querySelector('.doc-header');
    header.addEventListener('click', () => {
      const path = item.dataset.path;
      toggleDocumentPreview(item, path);
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

// Toggle document preview (accordion style)
async function toggleDocumentPreview(item, path) {
  const preview = item.querySelector('.doc-content-preview');
  const isExpanded = preview.style.display !== 'none';
  
  // Close all other previews first
  document.querySelectorAll('.doc-content-preview').forEach(p => {
    if (p !== preview) {
      p.style.display = 'none';
      p.closest('.doc-item').classList.remove('expanded');
    }
  });
  
  if (isExpanded) {
    // Collapse this one
    preview.style.display = 'none';
    item.classList.remove('expanded');
  } else {
    // Expand and load content
    preview.style.display = 'block';
    item.classList.add('expanded');
    
    // Load content if not already loaded
    if (preview.innerHTML.includes('Laddar...')) {
      try {
        const response = await fetch(`/api/file${path}`);
        const data = await response.json();
        
        const fileName = path.split('/').pop();
        const isMarkdown = fileName.endsWith('.md');
        
        let contentHtml;
        if (isMarkdown && typeof marked !== 'undefined') {
          contentHtml = `<div class="markdown-content">${marked.parse(data.content)}</div>`;
        } else {
          contentHtml = `<pre>${escapeHtml(data.content)}</pre>`;
        }
        
        preview.innerHTML = contentHtml;
      } catch (err) {
        preview.innerHTML = `<div style="color: #ff4444;">Kunde inte ladda: ${err.message}</div>`;
      }
    }
  }
}

// View document (legacy - keep for modal if needed)
async function viewDocument(path) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  modalBody.innerHTML = '<div class="loading">Laddar...</div>';
  modal.classList.add('active');
  
  try {
    const response = await fetch(`/api/file${path}`);
    const data = await response.json();
    
    const fileName = path.split('/').pop();
    const isMarkdown = fileName.endsWith('.md');
    
    let contentHtml;
    if (isMarkdown && typeof marked !== 'undefined') {
      contentHtml = `<div class="markdown-content">${marked.parse(data.content)}</div>`;
    } else {
      contentHtml = `<pre>${escapeHtml(data.content)}</pre>`;
    }
    
    modalBody.innerHTML = `
      <h2>${fileName}</h2>
      <p style="color: var(--text-dim); margin-bottom: 1rem;">
        📂 ${path}
      </p>
      ${contentHtml}
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

// ===== X BOOKMARKS =====

let allAccounts = [];
let allBookmarks = [];
let currentAccountFilter = 'all';
let showArchived = false;
let bookmarkStates = {}; // { tweetId: { read: bool, archived: bool } }

// Load bookmarks on page load
document.addEventListener('DOMContentLoaded', () => {
  loadBookmarkStates();
  loadBookmarks();
  initBookmarkFilters();
  initToggleArchived();
});

// Initialize bookmark account filters
function initBookmarkFilters() {
  const accountBtns = document.querySelectorAll('.account-btn');
  
  accountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const account = btn.dataset.account;
      
      // Update buttons
      accountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter bookmarks
      currentAccountFilter = account;
      displayBookmarks();
    });
  });
}

// Load bookmarks from API
async function loadBookmarks() {
  try {
    const [accountsRes, bookmarksRes] = await Promise.all([
      fetch('/api/bookmarks/accounts'),
      fetch('/api/bookmarks/all')
    ]);
    
    allAccounts = await accountsRes.json();
    allBookmarks = await bookmarksRes.json();
    
    renderAccountFilters();
    displayBookmarks();
  } catch (err) {
    console.error('Error loading bookmarks:', err);
    document.querySelector('.bookmarks-grid').innerHTML = `
      <div class="error">
        <p>❌ Fel vid laddning av bookmarks</p>
        <p>${err.message}</p>
      </div>
    `;
  }
}

// Render account filter buttons
function renderAccountFilters() {
  const filterContainer = document.querySelector('.account-filters');
  
  // Add "All" button
  let html = '<button class="account-btn active" data-account="all">Alla konton</button>';
  
  // Add button for each account
  allAccounts.forEach(account => {
    html += `
      <button class="account-btn" data-account="${account.username}">
        ${escapeHtml(account.name)} (@${escapeHtml(account.username)}) 
        <span class="count">${account.count}</span>
      </button>
    `;
  });
  
  filterContainer.innerHTML = html;
  initBookmarkFilters();
}

// Display bookmarks
function displayBookmarks() {
  const grid = document.querySelector('.bookmarks-grid');
  
  // Filter bookmarks
  let filtered = allBookmarks;
  if (currentAccountFilter !== 'all') {
    filtered = allBookmarks.filter(b => b.accountUsername === currentAccountFilter);
  }
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="loading">Inga bookmarks hittades</div>';
    return;
  }
  
  // Render bookmarks
  const html = filtered.map(bookmark => renderBookmarkCard(bookmark)).join('');
  grid.innerHTML = html;
  
  // Add event listeners for checkboxes (event delegation)
  grid.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const card = e.target.closest('.bookmark-card');
      const tweetId = card.dataset.id;
      const isRead = e.target.parentElement.textContent.includes('Läst');
      const key = isRead ? 'read' : 'archived';
      setBookmarkState(tweetId, key, e.target.checked);
    }
  });
}

// Load bookmark states from localStorage
function loadBookmarkStates() {
  const saved = localStorage.getItem('bookmarkStates');
  if (saved) {
    bookmarkStates = JSON.parse(saved);
  }
}

// Save bookmark states to localStorage
function saveBookmarkStates() {
  localStorage.setItem('bookmarkStates', JSON.stringify(bookmarkStates));
}

// Get state for a bookmark
function getBookmarkState(tweetId) {
  return bookmarkStates[tweetId] || { read: false, archived: false };
}

// Set state for a bookmark
function setBookmarkState(tweetId, key, value) {
  if (!bookmarkStates[tweetId]) {
    bookmarkStates[tweetId] = { read: false, archived: false };
  }
  bookmarkStates[tweetId][key] = value;
  saveBookmarkStates();
  displayBookmarks(); // Re-render
}

// Initialize toggle archived button
function initToggleArchived() {
  const header = document.querySelector('.bookmarks-header');
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'toggle-archived-btn';
  toggleBtn.textContent = 'Visa arkiverade';
  toggleBtn.addEventListener('click', () => {
    showArchived = !showArchived;
    toggleBtn.classList.toggle('active', showArchived);
    toggleBtn.textContent = showArchived ? 'Dölj arkiverade' : 'Visa arkiverade';
    document.querySelector('.bookmarks-grid').classList.toggle('show-archived', showArchived);
  });
  header.appendChild(toggleBtn);
}

// Render a single bookmark card
function renderBookmarkCard(bookmark) {
  // Extract first URL from text if any
  const urlMatch = bookmark.text.match(/https?:\/\/[^\s]+/);
  const hasUrl = urlMatch !== null;
  
  const state = getBookmarkState(bookmark.id);
  const readClass = state.read ? 'read' : '';
  const archivedClass = state.archived ? 'archived' : '';
  
  return `
    <div class="bookmark-card ${readClass} ${archivedClass}" data-account="${escapeHtml(bookmark.accountUsername)}" data-id="${bookmark.id}">
      <div class="bookmark-header">
        <div class="bookmark-author">
          <div class="name">${escapeHtml(bookmark.author)}</div>
          <div class="handle">från @${escapeHtml(bookmark.accountUsername)} · ${bookmark.date || 'Okänt datum'}</div>
        </div>
      </div>
      
      <div class="bookmark-content">
        ${escapeHtml(bookmark.text)}
      </div>
      
      <div class="bookmark-meta">
        <a href="${bookmark.url}" target="_blank" rel="noopener" class="bookmark-link">
          🐦 Öppna på X
        </a>
        ${hasUrl ? `<a href="${urlMatch[0]}" target="_blank" rel="noopener" class="bookmark-link">🔗 Länk</a>` : ''}
      </div>
      
      <div class="bookmark-actions">
        <label class="bookmark-checkbox">
          <input type="checkbox" ${state.read ? 'checked' : ''}>
          <span>Läst</span>
        </label>
        <label class="bookmark-checkbox">
          <input type="checkbox" ${state.archived ? 'checked' : ''}>
          <span>Arkiverad</span>
        </label>
      </div>
    </div>
  `;
}

// SiS-dokument functionality
document.addEventListener('DOMContentLoaded', () => {
  const sisForm = document.getElementById('sis-form');
  const customHeaderGroup = document.getElementById('custom-header-group');
  const customFooterGroup = document.getElementById('custom-footer-group');
  const statusEl = document.getElementById('sis-status');

  // Show/hide custom text inputs based on radio selection
  document.querySelectorAll('input[name="header"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      customHeaderGroup.style.display = e.target.value === '8' ? 'block' : 'none';
    });
  });

  document.querySelectorAll('input[name="footer"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      customFooterGroup.style.display = e.target.value === '9' ? 'block' : 'none';
    });
  });

  // Handle form submission
  sisForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedHeader = document.querySelector('input[name="header"]:checked');
    const selectedFooter = document.querySelector('input[name="footer"]:checked');

    const formData = {
      title: document.getElementById('doc-title').value,
      content: document.getElementById('doc-content').value,
      header_choice: selectedHeader ? selectedHeader.value : '1',
      footer_choice: selectedFooter ? selectedFooter.value : '1',
      custom_header: document.getElementById('custom-header').value || null,
      custom_footer: document.getElementById('custom-footer').value || null,
      output_name: document.getElementById('output-name').value || null
    };

    const btn = document.getElementById('generate-btn');
    btn.disabled = true;
    btn.textContent = '⏳ Genererar...';
    
    showStatus('Genererar dokument...', 'info');

    try {
      const response = await fetch('/api/sis-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        showStatus(`✅ ${result.message}`, 'success');
        
        // Create download links
        const downloadHTML = `
          <div style="margin-top: 1rem;">
            <a href="/api/sis-download/${result.pdf_file}" download class="btn-primary" style="display: inline-block; text-decoration: none; margin-right: 1rem;">📄 Ladda ner PDF</a>
            <a href="/api/sis-download/${result.docx_file}" download class="btn-primary" style="display: inline-block; text-decoration: none;">📝 Ladda ner DOCX</a>
          </div>
        `;
        statusEl.innerHTML += downloadHTML;
      } else {
        showStatus(`❌ Fel: ${result.error}`, 'error');
      }
    } catch (error) {
      showStatus(`❌ Kunde inte generera dokument: ${error.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = '📄 Generera PDF & DOCX';
    }
  });

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status-message show ${type}`;
  }
});
