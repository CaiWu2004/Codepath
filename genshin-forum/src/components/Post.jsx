import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";

export default function Post({ post, onUpvote, onDelete }) {
  const { user } = useAuth();
  const [characterData, setCharacterData] = useState(null);

  useEffect(() => {
    if (post.character_name) {
      fetchCharacterData(post.character_name);
    }
  }, [post.character_name]);

  const fetchCharacterData = async (name) => {
    const response = await fetch(`https://api.genshin.dev/characters/${name}`);
    if (response.ok) {
      const data = await response.json();
      setCharacterData(data);
    }
  };

  return (
    <div className="post">
      {/* ... existing post header ... */}
      <h3>{post.title}</h3>

      {characterData && (
        <div className="character-info">
          <h4>{characterData.name}</h4>
          <img
            src={`https://api.genshin.dev/characters/${post.character_name}/icon`}
            alt={characterData.name}
            width="100"
          />
          <p>Vision: {characterData.vision}</p>
          <p>Weapon: {characterData.weapon}</p>
        </div>
      )}

      {/* ... rest of the post ... */}
    </div>
  );
}
