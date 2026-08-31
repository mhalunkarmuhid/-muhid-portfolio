
const KEY = 'portfolio_extra_data';
const EMPTY = { achievements: [], projects: [] };

async function kvGet() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(`${url}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.result == null) return null;
  try {
    return JSON.parse(data.result);
  } catch {
    return null;
  }
}

async function kvSet(value) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('KV storage is not configured (missing env vars).');
  const res = await fetch(`${url}/set/${KEY}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error('Failed to save to KV storage.');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const data = await kvGet();
      res.status(200).json(data || EMPTY);
    } catch (err) {
      res.status(200).json(EMPTY);
    }
    return;
  }

  if (req.method === 'POST') {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const providedPassword = req.headers['x-admin-password'];

    if (!adminPassword) {
      res.status(500).json({ error: 'ADMIN_PASSWORD is not configured on the server.' });
      return;
    }
    if (!providedPassword || providedPassword !== adminPassword) {
      res.status(401).json({ error: 'Incorrect admin password.' });
      return;
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        res.status(400).json({ error: 'Invalid JSON body.' });
        return;
      }
    }

    const achievements = Array.isArray(body?.achievements) ? body.achievements : [];
    const projects = Array.isArray(body?.projects) ? body.projects : [];

    try {
      await kvSet({ achievements, projects });
      res.status(200).json({ ok: true, achievements, projects });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Failed to save data.' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed.' });
};
