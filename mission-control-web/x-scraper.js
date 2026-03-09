const fs = require('fs').promises;
const path = require('path');

/**
 * X (Twitter) Home Timeline Scraper
 * Uses browser automation to fetch home timeline for multiple accounts
 */

const CACHE_DIR = '/home/administrator/vayron/mission-control-web/x-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Account configs
const ACCOUNTS = [
  { id: 'mattiasthyr', username: 'mattiasthyr', color: '#1DA1F2' },
  { id: 'konfident', username: 'Konfidentse', color: '#F4D03F' },
  { id: 'ovning', username: 'ovningse', color: '#2ECC71' }
];

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create cache dir:', err);
  }
}

/**
 * Get cached timeline if fresh
 */
async function getCachedTimeline(accountId) {
  try {
    const cachePath = path.join(CACHE_DIR, `${accountId}.json`);
    const stats = await fs.stat(cachePath);
    const age = Date.now() - stats.mtime.getTime();
    
    if (age < CACHE_DURATION) {
      const data = await fs.readFile(cachePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    // Cache miss or error - return null
    return null;
  }
  return null;
}

/**
 * Save timeline to cache
 */
async function saveCachedTimeline(accountId, tweets) {
  try {
    await ensureCacheDir();
    const cachePath = path.join(CACHE_DIR, `${accountId}.json`);
    await fs.writeFile(cachePath, JSON.stringify({
      accountId,
      fetchedAt: new Date().toISOString(),
      tweets
    }, null, 2));
  } catch (err) {
    console.error('Failed to save cache:', err);
  }
}

/**
 * Scrape home timeline for an account
 * TODO: Implement actual scraping with browser automation
 */
async function scrapeHomeTimeline(account) {
  // Check cache first
  const cached = await getCachedTimeline(account.id);
  if (cached) {
    return cached;
  }

  // TODO: Implement browser automation scraping
  // For now, return mock data
  const mockTweets = generateMockTweets(account);
  
  await saveCachedTimeline(account.id, mockTweets);
  
  return {
    accountId: account.id,
    fetchedAt: new Date().toISOString(),
    tweets: mockTweets
  };
}

/**
 * Generate mock tweets for testing
 */
function generateMockTweets(account) {
  const tweets = [];
  const now = Date.now();
  
  for (let i = 0; i < 20; i++) {
    tweets.push({
      id: `${account.id}_${now}_${i}`,
      author: `User ${i}`,
      authorHandle: `@user${i}`,
      text: `Mock tweet ${i} for ${account.username} home timeline. This is test content to verify the layout works.`,
      timestamp: new Date(now - (i * 15 * 60 * 1000)).toISOString(), // Every 15 min
      likes: Math.floor(Math.random() * 100),
      retweets: Math.floor(Math.random() * 50),
      replies: Math.floor(Math.random() * 20),
      url: `https://x.com/user${i}/status/${now}_${i}`
    });
  }
  
  return tweets;
}

/**
 * Fetch timelines for all accounts
 */
async function fetchAllTimelines() {
  const results = await Promise.all(
    ACCOUNTS.map(account => scrapeHomeTimeline(account))
  );
  
  return results.map((timeline, idx) => ({
    ...timeline,
    account: ACCOUNTS[idx]
  }));
}

/**
 * Get account list
 */
function getAccounts() {
  return ACCOUNTS;
}

module.exports = {
  fetchAllTimelines,
  scrapeHomeTimeline,
  getAccounts,
  ACCOUNTS
};
