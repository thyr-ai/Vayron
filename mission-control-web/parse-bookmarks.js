// X Bookmarks Parser
const fs = require('fs');
const path = require('path');

/**
 * Parse like.js files from Twitter/X exports
 * Returns structured bookmark data with account info
 */
function parseBookmarks(accountsDir) {
  const accounts = [];
  
  // Find all account directories
  const dirs = fs.readdirSync(accountsDir)
    .filter(d => d.startsWith('account'))
    .map(d => path.join(accountsDir, d));
  
  dirs.forEach((accountPath, index) => {
    try {
      // Read account info
      const accountFile = path.join(accountPath, 'data', 'account.js');
      if (!fs.existsSync(accountFile)) {
        console.warn(`No account.js found in ${accountPath}`);
        return;
      }
      
      const accountContent = fs.readFileSync(accountFile, 'utf8');
      
      // Extract JSON from window.YTD.account.part0 = [...]
      const accountJsonMatch = accountContent.match(/window\.YTD\.account\.part0\s*=\s*(\[[\s\S]*\]);?\s*$/);
      if (!accountJsonMatch) {
        console.warn(`Could not parse account.js in ${accountPath}`);
        return;
      }
      
      const accountData = JSON.parse(accountJsonMatch[1])[0].account;
      const displayName = accountData.accountDisplayName || `Account ${index + 1}`;
      const username = accountData.username || '';
      
      // Read likes/bookmarks
      const likesFile = path.join(accountPath, 'data', 'like.js');
      if (!fs.existsSync(likesFile)) {
        console.warn(`No like.js found for ${displayName}`);
        return;
      }
      
      const likesContent = fs.readFileSync(likesFile, 'utf8');
      
      // Extract JSON from window.YTD.like.part0 = [...]
      const jsonMatch = likesContent.match(/window\.YTD\.like\.part0\s*=\s*(\[[\s\S]*\]);?\s*$/);
      if (!jsonMatch) {
        console.warn(`Could not parse like.js for ${displayName}`);
        return;
      }
      
      const likes = JSON.parse(jsonMatch[1]);
      
      // Transform to cleaner format
      const bookmarks = likes.map(item => {
        const like = item.like;
        const date = tweetIdToDate(like.tweetId);
        return {
          id: like.tweetId,
          text: like.fullText,
          url: like.expandedUrl,
          // Extract username from tweet text if mentioned
          author: extractAuthor(like.fullText),
          account: displayName,
          accountUsername: username,
          date: formatDate(date),
          timestamp: date ? date.getTime() : null
        };
      });
      
      // Sort by tweetId descending (newest first) - treat as numbers
      bookmarks.sort((a, b) => {
        const idA = BigInt(a.id);
        const idB = BigInt(b.id);
        return idB > idA ? 1 : idB < idA ? -1 : 0;
      });
      
      accounts.push({
        name: displayName,
        username: username,
        count: bookmarks.length,
        bookmarks: bookmarks
      });
      
    } catch (err) {
      console.error(`Error parsing ${accountPath}:`, err.message);
    }
  });
  
  return accounts;
}

/**
 * Extract tweet author from @mention in text
 */
function extractAuthor(text) {
  if (!text) return 'Unknown';
  const match = text.match(/^@(\w+)/);
  return match ? match[1] : 'Unknown';
}

/**
 * Extract timestamp from Twitter Snowflake ID
 * Twitter epoch: 1288834974657 (2010-11-04T01:42:54.657Z)
 */
function tweetIdToDate(tweetId) {
  try {
    const TWITTER_EPOCH = 1288834974657n;
    const id = BigInt(tweetId);
    const timestamp = (id >> 22n) + TWITTER_EPOCH;
    return new Date(Number(timestamp));
  } catch (err) {
    return null;
  }
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
  if (!date) return null;
  return date.toISOString().split('T')[0];
}

/**
 * Get all bookmarks flattened with metadata
 */
function getAllBookmarks(accountsDir) {
  const accounts = parseBookmarks(accountsDir);
  const allBookmarks = [];
  
  accounts.forEach(account => {
    account.bookmarks.forEach(bookmark => {
      allBookmarks.push({
        ...bookmark,
        accountName: account.name,
        accountUsername: account.username
      });
    });
  });
  
  return allBookmarks;
}

/**
 * Get summary statistics
 */
function getStats(accountsDir) {
  const accounts = parseBookmarks(accountsDir);
  
  return {
    totalAccounts: accounts.length,
    totalBookmarks: accounts.reduce((sum, acc) => sum + acc.count, 0),
    accounts: accounts.map(acc => ({
      name: acc.name,
      username: acc.username,
      count: acc.count
    }))
  };
}

module.exports = {
  parseBookmarks,
  getAllBookmarks,
  getStats
};
