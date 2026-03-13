// State
let allDocuments = [];
let allImages = [];
let searchTimeout = null;
let kanbanTasks = {};
let currentContextFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSearch();
  initModal();
  initKanban();
  loadDocuments();
  loadImages();
});

// Tab switching
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item[data-tab]');
  const pageTitle = document.getElementById('page-title');
  
  const tabTitles = {
    kanban: 'Kanban Board',
    cron: 'Cron Jobs',
    'x-feeds': 'X Feeds',
    bookmarks: 'X Bookmarks',
    documents: 'Dokument',
    images: 'Bilder',
    sis: 'SiS-dokument'
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

// Kanban Board
function initKanban() {
  const contextFilter = document.getElementById('context-filter');
  
  if (contextFilter) {
    contextFilter.addEventListener('change', (e) => {
      currentContextFilter = e.target.value;
      renderKanbanTasks();
    });
  }
  
  loadKanbanTasks();
}

async function loadKanbanTasks() {
  try {
    const response = await fetch('/api/kanban/tasks');
    kanbanTasks = await response.json();
    renderKanbanTasks();
  } catch (err) {
    console.error('Failed to load Kanban tasks:', err);
  }
}

function renderKanbanTasks() {
  const sections = ['inbox', 'next', 'doing', 'waiting', 'backlog'];
  
  sections.forEach(section => {
    const container = document.getElementById(`${section}-tasks`);
    if (!container) return;
    
    container.innerHTML = '';
    
    const tasks = kanbanTasks[section] || [];
    const filteredTasks = currentContextFilter === 'all' 
      ? tasks
      : tasks.filter(t => t.contexts.includes(currentContextFilter));
    
    filteredTasks.forEach((task, index) => {
      const taskEl = document.createElement('div');
      taskEl.className = 'task-card';
      taskEl.draggable = true;
      taskEl.dataset.section = section;
      taskEl.dataset.index = index;
      taskEl.innerHTML = `
        <div class="task-content">
          <p>${escapeHtml(task.text)}</p>
          ${task.contexts.length > 0 ? `
            <div class="task-contexts">
              ${task.contexts.map(c => `<span class="context-badge">${c}</span>`).join('')}
            </div>
          ` : ''}
          ${task.subtasks.length > 0 ? `
            <ul class="task-subtasks">
              ${task.subtasks.map(st => `<li>${escapeHtml(st)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `;
      
      // Drag event listeners
      taskEl.addEventListener('dragstart', handleDragStart);
      taskEl.addEventListener('dragend', handleDragEnd);
      
      container.appendChild(taskEl);
    });
    
    // Make containers droppable
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragleave', handleDragLeave);
  });
  
  // Render completed tasks
  const completedContainer = document.getElementById('completed-tasks');
  if (completedContainer && kanbanTasks.done) {
    completedContainer.innerHTML = kanbanTasks.done.map(task => `
      <div class="completed-task">
        <span class="task-text">${escapeHtml(task.text)}</span>
      </div>
    `).join('');
  }
}

// Drag and drop handlers
let draggedElement = null;
let draggedTask = null;
let sourceSection = null;

function handleDragStart(e) {
  draggedElement = this;
  sourceSection = this.dataset.section;
  const taskIndex = parseInt(this.dataset.index);
  draggedTask = kanbanTasks[sourceSection][taskIndex];
  
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  
  // Remove all drag-over classes
  document.querySelectorAll('.kanban-column').forEach(col => {
    col.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  
  e.dataTransfer.dropEffect = 'move';
  
  // Add visual feedback
  const column = e.currentTarget.closest('.kanban-column');
  if (column) {
    column.classList.add('drag-over');
  }
  
  return false;
}

function handleDragLeave(e) {
  const column = e.currentTarget.closest('.kanban-column');
  if (column && !column.contains(e.relatedTarget)) {
    column.classList.remove('drag-over');
  }
}

async function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  const targetContainer = e.currentTarget;
  const targetSection = targetContainer.id.replace('-tasks', '');
  
  // Remove visual feedback
  const column = targetContainer.closest('.kanban-column');
  if (column) {
    column.classList.remove('drag-over');
  }
  
  if (sourceSection === targetSection) {
    return false;
  }
  
  // Update data structure
  const taskIndex = kanbanTasks[sourceSection].findIndex(t => t.text === draggedTask.text);
  if (taskIndex > -1) {
    kanbanTasks[sourceSection].splice(taskIndex, 1);
  }
  
  if (!kanbanTasks[targetSection]) {
    kanbanTasks[targetSection] = [];
  }
  kanbanTasks[targetSection].push(draggedTask);
  
  // Save to backend
  try {
    await fetch('/api/kanban/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(kanbanTasks)
    });
  } catch (err) {
    console.error('Failed to save Kanban tasks:', err);
  }
  
  // Re-render
  renderKanbanTasks();
  
  return false;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

  // Markdown file loading
  const loadMdBtn = document.getElementById('load-md-btn');
  const mdFileInput = document.getElementById('md-file-input');
  const mdFileName = document.getElementById('md-file-name');
  const docContentTextarea = document.getElementById('doc-content');
  const docTitleInput = document.getElementById('doc-title');

  loadMdBtn?.addEventListener('click', () => {
    mdFileInput.click();
  });

  mdFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      // Parse markdown: extract title from first # heading if exists
      const lines = text.split('\n');
      let title = '';
      let content = '';
      let titleFound = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Extract first # heading as title
        if (!titleFound && line.match(/^#\s+(.+)/)) {
          title = line.replace(/^#\s+/, '').trim();
          titleFound = true;
          continue;
        }
        
        // Skip empty lines at the start
        if (!content && !line.trim()) continue;
        
        // Remove markdown formatting for PDF (keep plain text)
        let cleanLine = line
          .replace(/^#+\s+/, '')           // Remove headers
          .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.+?)\*/g, '$1')     // Remove italic
          .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Keep link text only
          .replace(/`(.+?)`/g, '$1')       // Remove code marks
          .replace(/^[-*+]\s+/, '• ')      // Convert list markers to bullets
          .replace(/^\d+\.\s+/, '');       // Remove numbered list markers
        
        content += cleanLine + '\n';
      }

      // Fill form
      if (title && !docTitleInput.value) {
        docTitleInput.value = title;
      }
      
      docContentTextarea.value = content.trim();
      mdFileName.textContent = `✓ ${file.name}`;
      
    } catch (error) {
      mdFileName.textContent = `✗ Fel: ${error.message}`;
      mdFileName.style.color = 'var(--pink)';
    }
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

// ===== X FEEDS =====
let xFeedsLoaded = false;

// Load X Feeds when tab is activated
document.addEventListener('DOMContentLoaded', () => {
  const xFeedsTab = document.querySelector('.nav-item[data-tab="x-feeds"]');
  if (xFeedsTab) {
    xFeedsTab.addEventListener('click', () => {
      if (!xFeedsLoaded) {
        loadXFeeds();
        xFeedsLoaded = true;
      }
    });
  }

  // Refresh button
  const refreshBtn = document.getElementById('refresh-feeds');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadXFeeds(true);
    });
  }
});

async function loadXFeeds(force = false) {
  const accounts = ['mattiasthyr', 'konfident', 'ovning'];
  
  // Show loading state
  for (const accountId of accounts) {
    const feedColumn = document.getElementById(`feed-${accountId}`);
    const tweetsContainer = feedColumn.querySelector('.feed-tweets');
    tweetsContainer.innerHTML = '<div class="loading">🔄 Hämtar bookmarks...</div>';
  }
  
  try {
    const response = await fetch('/api/x/bookmarks');
    const results = await response.json();
    
    if (response.ok) {
      results.forEach(result => {
        const feedColumn = document.getElementById(`feed-${result.accountId}`);
        const tweetsContainer = feedColumn.querySelector('.feed-tweets');
        const timestampEl = feedColumn.querySelector('.feed-timestamp');
        
        if (result.error) {
          tweetsContainer.innerHTML = `<div class="error">Fel: ${result.error}</div>`;
        } else {
          displayTimeline(tweetsContainer, result.bookmarks);
          timestampEl.textContent = formatTimestamp(result.fetchedAt);
        }
      });
    } else {
      throw new Error('Failed to fetch bookmarks');
    }
  } catch (error) {
    console.error('Failed to load bookmarks:', error);
    for (const accountId of accounts) {
      const feedColumn = document.getElementById(`feed-${accountId}`);
      const tweetsContainer = feedColumn.querySelector('.feed-tweets');
      tweetsContainer.innerHTML = `<div class="error">Kunde inte ladda bookmarks: ${error.message}</div>`;
    }
  }
}

function displayTimeline(container, tweets) {
  if (!tweets || tweets.length === 0) {
    container.innerHTML = '<div class="empty-state">Inga tweets att visa</div>';
    return;
  }
  
  const html = tweets.map(tweet => `
    <div class="tweet-card">
      <div class="tweet-header">
        <div>
          <div class="tweet-author">${escapeHtml(tweet.author)}</div>
          <div class="tweet-handle">${escapeHtml(tweet.authorHandle)}</div>
        </div>
        <div class="tweet-timestamp">${formatTweetTime(tweet.timestamp)}</div>
      </div>
      <div class="tweet-text">${escapeHtml(tweet.text)}</div>
      <div class="tweet-stats">
        <span class="tweet-stat">❤️ ${tweet.likes}</span>
        <span class="tweet-stat">🔄 ${tweet.retweets}</span>
        <span class="tweet-stat">💬 ${tweet.replies}</span>
      </div>
      <a href="${tweet.url}" target="_blank" class="tweet-url">Se på X →</a>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function formatTweetTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'just nu';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('sv-SE', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
