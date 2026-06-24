const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '../db.json');

app.use(cors());
app.use(express.json());

// Helper to read database content
const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { communities: [], posts: [] };
  }
};

// Helper to write database content
const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
};

/**
 * GET /communities
 * Query Parameters:
 *  - search: string (matches name or description case-insensitively)
 *  - sort: string ('name_asc' | 'name_desc' | 'members_desc')
 *  - page: number (default 1)
 *  - limit: number (default 10)
 */
app.get('/communities', (req, res) => {
  const db = readDatabase();
  let communities = [...(db.communities || [])];

  // 1. Search Filter
  const search = (req.query.search || '').toString().trim().toLowerCase();
  if (search) {
    communities = communities.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(search) ||
        (c.description || '').toLowerCase().includes(search)
    );
  }

  // 2. Sorting
  const sort = req.query.sort || 'name_asc';
  communities.sort((a, b) => {
    if (sort === 'name_desc') {
      return (b.name || '').localeCompare(a.name || '');
    } else if (sort === 'members_desc') {
      return (b.memberCount || 0) - (a.memberCount || 0);
    } else {
      // Default: name_asc
      return (a.name || '').localeCompare(b.name || '');
    }
  });

  // 3. Pagination
  const totalCount = communities.length;
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const sliced = communities.slice(startIndex, endIndex);

  const hasMore = endIndex < totalCount;
  const nextPage = hasMore ? page + 1 : undefined;

  // Return the paginated response structure directly
  return res.json({
    data: sliced,
    nextPage,
    totalCount,
  });
});

/**
 * PATCH /communities/:id
 * Updates specific fields in a community item (used for joining/leaving and updating member counts)
 */
app.patch('/communities/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const communities = db.communities || [];

  const communityIndex = communities.findIndex((c) => c.id === id);
  if (communityIndex === -1) {
    return res.status(404).json({ message: `Community with ID ${id} not found.` });
  }

  // Update provided fields statefully
  const updatedCommunity = {
    ...communities[communityIndex],
    ...req.body,
  };

  communities[communityIndex] = updatedCommunity;
  writeDatabase({ ...db, communities });

  return res.json(updatedCommunity);
});

/**
 * GET /posts
 * Query Parameters:
 *  - communityId: string (required)
 */
app.get('/posts', (req, res) => {
  const db = readDatabase();
  const communityId = req.query.communityId;

  if (!communityId) {
    return res.status(400).json({ message: 'Missing required query parameter: communityId' });
  }

  const posts = (db.posts || []).filter((p) => p.communityId === communityId);
  return res.json(posts);
});

/**
 * POST /posts
 * Adds a new post to the community
 */
app.post('/posts', (req, res) => {
  const db = readDatabase();
  const { communityId, title, body } = req.body;

  if (!communityId || !title || !body) {
    return res.status(400).json({ message: 'Missing required fields: communityId, title, or body' });
  }

  const newPost = {
    id: `post-${Date.now()}`,
    communityId,
    title,
    body,
    createdAt: new Date().toISOString(),
  };

  const posts = db.posts || [];
  posts.push(newPost);
  writeDatabase({ ...db, posts });

  return res.status(201).json(newPost);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Mock Server] Custom mock server is running on http://localhost:${PORT}`);
});
