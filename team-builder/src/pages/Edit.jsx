import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";
import AttributeSelector from "../components/AttributeSelector";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crewmate, setCrewmate] = useState({
    name: "",
    role: "",
    strength: 5,
    speed: 5,
    intelligence: 5,
    bio: "",
    image_url: "",
  });

  useEffect(() => {
    const fetchCrewmate = async () => {
      const { data, error } = await supabase
        .from("Crewmates")
        .select()
        .eq("id", id)
        .single();

      if (error) console.error("Error fetching crewmate:", error);
      else setCrewmate(data);
    };

    fetchCrewmate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCrewmate((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (attribute, value) => {
    setCrewmate((prev) => ({ ...prev, [attribute]: value }));
  };

  const updateCrewmate = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("Crewmates")
      .update(crewmate)
      .eq("id", id);

    if (error) {
      alert("Error updating crewmate: " + error.message);
    } else {
      navigate(`/crewmate/${id}`);
    }
  };

  const deleteCrewmate = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${crewmate.name}? This cannot be undone.`
    );

    if (confirmDelete) {
      const { error } = await supabase.from("Crewmates").delete().eq("id", id);

      if (error) {
        alert("Error deleting crewmate: " + error.message);
      } else {
        navigate("/");
      }
    }
  };

  if (!crewmate.id) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-form">
      <h2>Edit {crewmate.name}</h2>

      <div className="current-values">
        <h3>Current Attributes</h3>
        <div className="attribute-display">
          <span>Strength: {crewmate.strength}</span>
          <span>Speed: {crewmate.speed}</span>
          <span>Intelligence: {crewmate.intelligence}</span>
        </div>
      </div>

      <form onSubmit={updateCrewmate}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={crewmate.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Role:
          <select name="role" value={crewmate.role} onChange={handleChange}>
            <option value="Fighter">Fighter</option>
            <option value="Mage">Mage</option>
            <option value="Rogue">Rogue</option>
            <option value="Healer">Healer</option>
          </select>
        </label>

        <AttributeSelector
          name="Strength"
          value={crewmate.strength}
          onChange={handleAttributeChange}
        />

        <AttributeSelector
          name="Speed"
          value={crewmate.speed}
          onChange={handleAttributeChange}
        />

        <AttributeSelector
          name="Intelligence"
          value={crewmate.intelligence}
          onChange={handleAttributeChange}
        />

        <label>
          Bio:
          <textarea name="bio" value={crewmate.bio} onChange={handleChange} />
        </label>

        <label>
          Image URL:
          <input
            type="text"
            name="image_url"
            value={crewmate.image_url}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button onClick={deleteCrewmate} className="delete-btn">
            Delete Crewmate
          </button>
          <button
            type="button"
            onClick={() => navigate(`/crewmate/${id}`)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
