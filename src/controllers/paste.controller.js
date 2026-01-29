const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { getNow } = require("../utils/time.util");

// POST /api/pastes
async function createPaste(req, res) {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({ error: "content is required" });
    }

    if (ttl_seconds !== undefined && ttl_seconds < 1) {
      return res.status(400).json({ error: "ttl_seconds must be >= 1" });
    }

    if (max_views !== undefined && max_views < 1) {
      return res.status(400).json({ error: "max_views must be >= 1" });
    }

    const id = uuidv4();
    const now = getNow(req);
    const expiresAt = ttl_seconds
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null;

    await pool.query(
      `INSERT INTO pastes (id, content, created_at, expires_at, max_views, views)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [id, content, now, expiresAt, max_views ?? null]
    );

    return res.status(201).json({
      id,
      url: `${req.protocol}://${req.get("host")}/p/${id}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}

// GET /api/pastes/:id
async function getPaste(req, res) {
  try {
    const { id } = req.params;
    const now = getNow(req);

    const [rows] = await pool.query(
      "SELECT * FROM pastes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "not found" });
    }

    const paste = rows[0];

    if (paste.expires_at && now > paste.expires_at) {
      return res.status(404).json({ error: "expired" });
    }

    if (paste.max_views !== null && paste.views >= paste.max_views) {
      return res.status(404).json({ error: "view limit exceeded" });
    }

    await pool.query(
      "UPDATE pastes SET views = views + 1 WHERE id = ?",
      [id]
    );

    return res.json({
      content: paste.content,
      remaining_views:
        paste.max_views !== null
          ? paste.max_views - (paste.views + 1)
          : null,
      expires_at: paste.expires_at,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}

// GET /p/:id (HTML view)
async function viewPaste(req, res) {
  try {
    const { id } = req.params;
    const now = getNow(req);

    const [rows] = await pool.query(
      "SELECT * FROM pastes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send("Not found");
    }

    const paste = rows[0];

    if (paste.expires_at && now > paste.expires_at) {
      return res.status(404).send("Expired");
    }

    if (paste.max_views !== null && paste.views >= paste.max_views) {
      return res.status(404).send("View limit exceeded");
    }

    await pool.query(
      "UPDATE pastes SET views = views + 1 WHERE id = ?",
      [id]
    );

    res.setHeader("Content-Type", "text/html");
    return res.send(
      `<pre>${paste.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}

module.exports = {
  createPaste,
  getPaste,
  viewPaste,
};
