import { useState, useEffect } from "react";
import { getCharacters } from "../services/genshinApi";

export default function CharacterSelector({ onSelect, disabled }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchCharacters = async () => {
      try {
        const data = await getCharacters();
        if (mounted) {
          setCharacters(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load characters");
          setLoading(false);
        }
      }
    };

    fetchCharacters();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading characters...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mb-4">
      <label className="block mb-2">Select Character (Optional)</label>
      <select
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="w-full p-2 border rounded"
        defaultValue=""
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
