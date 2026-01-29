import { useState } from "react";
import api from "../services/api";

function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const submitPaste = async () => {
    try {
      setError("");
      const res = await api.post("/api/pastes", {
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: maxViews ? Number(maxViews) : undefined,
      });
      setResultUrl(res.data.url);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Paste</h2>

      <textarea
        rows="8"
        cols="60"
        placeholder="Enter paste content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="TTL (seconds)"
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max views"
        value={maxViews}
        onChange={(e) => setMaxViews(e.target.value)}
        style={{ marginLeft: 10 }}
      />

      <br /><br />

      <button onClick={submitPaste}>Create Paste</button>

      {resultUrl && (
        <p>
          Paste URL: <a href={resultUrl}>{resultUrl}</a>
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Home;
