import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

// Among Us customization options
const COLORS = [
  "Red",
  "Blue",
  "Green",
  "Pink",
  "Orange",
  "Yellow",
  "Black",
  "White",
  "Purple",
  "Brown",
  "Cyan",
  "Lime",
];
const HATS = [
  "None",
  "Plunger",
  "Military",
  "Party",
  "Cowboy",
  "Winter",
  "Plant",
  "Toilet Paper",
  "Feather",
  "Chef",
];
const PETS = [
  "None",
  "Dog",
  "Hamster",
  "Robot",
  "UFO",
  "Mini Crewmate",
  "Bedcrab",
];
const ROLES = ["Crewmate", "Scientist", "Engineer", "Guardian", "Impostor"];

// Default avatar base URL
const DEFAULT_AVATAR_BASE =
  "https://www.innersloth.com/wp-content/uploads/2021/06/amongus";

export default function Create() {
  const [crewmate, setCrewmate] = useState({
    name: "",
    color: "Red",
    hat: "None",
    pet: "None",
    is_impostor: false,
    role: "Crewmate",
    bio: "",
    image_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCrewmate((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!crewmate.name.trim()) {
      throw new Error("Crewmate name is required");
    }
    if (crewmate.name.length > 30) {
      throw new Error("Name must be 30 characters or less");
    }
    if (crewmate.bio.length > 500) {
      throw new Error("Bio must be 500 characters or less");
    }
  };

  const createCrewmate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form before submission
      validateForm();

      // Generate avatar URL
      const avatarUrl =
        crewmate.image_url ||
        `${DEFAULT_AVATAR_BASE}-${crewmate.color.toLowerCase()}.png`;

      // Prepare crewmate data
      const crewmateData = {
        ...crewmate,
        image_url: avatarUrl,
        created_at: new Date().toISOString(),
      };

      console.log("Submitting crewmate:", crewmateData);

      const { data, error: supabaseError } = await supabase
        .from("crewmates")
        .insert(crewmateData)
        .select();

      if (supabaseError) {
        console.error("Supabase error:", supabaseError);
        throw new Error(supabaseError.message || "Failed to create crewmate");
      }

      console.log("Successfully created:", data);
      navigate("/", {
        state: { successMessage: "Crewmate created successfully!" },
      });
    } catch (err) {
      console.error("Creation error:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-form among-us-theme">
      <div className="form-header">
        <h2>Create New Crewmate</h2>
        <p>Customize your Among Us character</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={createCrewmate}>
        <div className="form-section">
          <label>
            Name*
            <input
              type="text"
              name="name"
              value={crewmate.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              maxLength={30}
              placeholder="Enter crewmate name"
            />
          </label>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>
              Color
              <select
                name="color"
                value={crewmate.color}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-section">
            <label>
              Hat
              <select
                name="hat"
                value={crewmate.hat}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {HATS.map((hat) => (
                  <option key={hat} value={hat}>
                    {hat}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label>
              Pet
              <select
                name="pet"
                value={crewmate.pet}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {PETS.map((pet) => (
                  <option key={pet} value={pet}>
                    {pet}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-section">
            <label>
              Role
              <select
                name="role"
                value={crewmate.role}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="is_impostor"
              checked={crewmate.is_impostor}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <span className="checkbox-custom"></span>
            Is Impostor?
          </label>
        </div>

        <div className="form-section">
          <label>
            Bio
            <textarea
              name="bio"
              value={crewmate.bio}
              onChange={handleChange}
              placeholder="Describe your crewmate..."
              disabled={isSubmitting}
              maxLength={500}
              rows={4}
            />
            <div className="character-count">
              {crewmate.bio.length}/500 characters
            </div>
          </label>
        </div>

        <div className="form-section">
          <label>
            Custom Image URL
            <input
              type="url"
              name="image_url"
              value={crewmate.image_url}
              onChange={handleChange}
              placeholder="Paste image URL or leave blank for default"
              disabled={isSubmitting}
              pattern="https://.*"
            />
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="among-us-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              "Create Crewmate"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
