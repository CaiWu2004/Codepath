import { useState, useEffect } from "react";
import { getCharacters } from "../services/genshinApi";

export default function CharacterSelector({ onSelect, disabled = false }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await getCharacters();
        setCharacters(data);
      } catch (err) {
        setError("Failed to load characters");
        console.error("Error fetching characters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  if (loading) return <div>Loading characters...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="character-selector">
      <h4>Add a Genshin Character (Optional)</h4>
      <select
        onChange={(e) => onSelect(e.target.value)}
        defaultValue=""
        disabled={disabled}
      >
        <option value="">None</option>
        {characters.map((char) => (
          <option key={char} value={char}>
            {char}
          </option>
        ))}
      </select>
    </div>
  );
}
