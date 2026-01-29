import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function PasteView() {
  const { id } = useParams();
  const [paste, setPaste] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPaste() {
      try {
        const res = await api.get(`/api/pastes/${id}`);
        setPaste(res.data.content);
      } catch (err) {
        setError(err.response?.data?.error || "Paste not available");
      }
    }
    fetchPaste();
  }, [id]);

  if (error) {
    return <h3 style={{ color: "red" }}>{error}</h3>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Paste Content</h2>
      <pre>{paste}</pre>
    </div>
  );
}

export default PasteView;
