const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const CREDENTIALS_FILE = '/home/administrator/vayron/credentials/x-accounts.md';
const CACHE_DIR = '/home/administrator/vayron/mission-control-web/x-cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const ACCOUNTS = [
  { id: 'mattiasthyr', username: 'mattiasthyr', color: '#1DA1F2' },
  { id: 'konfident', username: 'konfidentse', color: '#F4D03F' },
  { id: 'ovning', username: 'ovningse', color: '#2ECC71' }
];

/**
 * Parse credentials from markdown file
 */
async function loadCredentials() {
  try {
    const content = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const credentials = {};
    
    const lines = content.split('\n');
    let currentAccount = null;
    
    for (const line of lines) {
      const accountMatch = line.match(/^## @(\w+)/);
      if (accountMatch) {
        currentAccount = accountMatch[1].toLowerCase();
        credentials[currentAccount] = {};
      }
      
      const usernameMatch = line.match(/- Username: (.+)/);
      if (usernameMatch && currentAccount) {
        credentials[currentAccount].username = usernameMatch[1].trim();
      }
      
      const passwordMatch = line.match(/- Password: (.+)/);
      if (passwordMatch && currentAccount) {
        credentials[currentAccount].password = passwordMatch[1].trim();
      }
    }
    
    return credentials;
  } catch (err) {
    console.error('Failed to load credentials:', err);
    return {};
  }
}

/**
 * Check if cached bookmarks are fresh
 */
async function getCachedBookmarks(accountId) {
  try {
    const cachePath = path.join(CACHE_DIR, `${accountId}-bookmarks.json`);
    const stats = await fs.stat(cachePath);
    const age = Date.now() - stats.mtime.getTime();
    
    if (age < CACHE_DURATION) {
      const data = await fs.readFile(cachePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    return null;
  }
  return null;
}

/**
 * Save bookmarks to cache
 */
async function saveBookmarksCache(accountId, bookmarks) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const cachePath = path.join(CACHE_DIR, `${accountId}-bookmarks.json`);
    await fs.writeFile(cachePath, JSON.stringify({
      accountId,
      fetchedAt: new Date().toISOString(),
      bookmarks
    }, null, 2));
  } catch (err) {
    console.error('Failed to save cache:', err);
  }
}

/**
 * Scrape bookmarks for one account
 */
async function scrapeBookmarks(account, credentials) {
  // Check cache first
  const cached = await getCachedBookmarks(account.id);
  if (cached) {
    console.log(`✓ Using cached bookmarks for @${account.username}`);
    return cached;
  }

  console.log(`🔍 Scraping bookmarks for @${account.username}...`);
  
  const creds = credentials[account.username.toLowerCase()];
  if (!creds || !creds.password) {
    console.error(`❌ No credentials found for ${account.username}`);
    return {
      accountId: account.id,
      fetchedAt: new Date().toISOString(),
      bookmarks: [],
      error: 'No credentials'
    };
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Go to X login
    console.log('  → Navigating to X.com login...');
    await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Enter username
    console.log('  → Entering username...');
    const usernameInput = await page.locator('input[autocomplete="username"]').first();
    await usernameInput.fill(creds.username);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Enter password
    console.log('  → Entering password...');
    const passwordInput = await page.locator('input[type="password"]').first();
    await passwordInput.fill(creds.password);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    
    // Navigate to bookmarks
    console.log('  → Navigating to bookmarks...');
    await page.goto('https://x.com/i/bookmarks', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Scroll to load more bookmarks
    console.log('  → Loading bookmarks...');
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(2000);
    }
    
    // Extract bookmarks
    const bookmarks = await page.evaluate(() => {
      const tweets = [];
      const articles = document.querySelectorAll('article[data-testid="tweet"]');
      
      articles.forEach((article, idx) => {
        try {
          const textEl = article.querySelector('[data-testid="tweetText"]');
          const text = textEl ? textEl.textContent : '';
          
          const authorEl = article.querySelector('[data-testid="User-Name"]');
          const authorName = authorEl ? authorEl.textContent.split('@')[0].trim() : 'Unknown';
          const authorHandle = authorEl ? '@' + authorEl.textContent.split('@')[1]?.split('·')[0]?.trim() : '@unknown';
          
          const timeEl = article.querySelector('time');
          const timestamp = timeEl ? timeEl.getAttribute('datetime') : new Date().toISOString();
          
          const linkEl = article.querySelector('a[href*="/status/"]');
          const url = linkEl ? 'https://x.com' + linkEl.getAttribute('href') : '';
          
          tweets.push({
            id: `tweet_${idx}_${Date.now()}`,
            author: authorName,
            authorHandle: authorHandle,
            text: text,
            timestamp: timestamp,
            url: url,
            likes: 0,
            retweets: 0,
            replies: 0
          });
        } catch (err) {
          console.error('Failed to parse tweet:', err);
        }
      });
      
      return tweets;
    });
    
    console.log(`  ✓ Found ${bookmarks.length} bookmarks`);
    
    await browser.close();
    
    const result = {
      accountId: account.id,
      fetchedAt: new Date().toISOString(),
      bookmarks
    };
    
    await saveBookmarksCache(account.id, bookmarks);
    
    return result;
    
  } catch (err) {
    console.error(`❌ Failed to scrape @${account.username}:`, err.message);
    await browser.close();
    
    return {
      accountId: account.id,
      fetchedAt: new Date().toISOString(),
      bookmarks: [],
      error: err.message
    };
  }
}

/**
 * Scrape all accounts
 */
async function scrapeAllBookmarks() {
  const credentials = await loadCredentials();
  const results = [];
  
  for (const account of ACCOUNTS) {
    const result = await scrapeBookmarks(account, credentials);
    results.push({
      ...result,
      account
    });
  }
  
  return results;
}

module.exports = {
  scrapeAllBookmarks,
  scrapeBookmarks,
  ACCOUNTS
};

// CLI usage
if (require.main === module) {
  (async () => {
    console.log('🐦 Starting X bookmark scraper...\n');
    const results = await scrapeAllBookmarks();
    console.log('\n✅ Done!');
    results.forEach(r => {
      console.log(`  @${r.account.username}: ${r.bookmarks.length} bookmarks`);
    });
  })();
}
