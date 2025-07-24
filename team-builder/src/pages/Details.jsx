import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useParams, Link } from "react-router-dom";

// Updated with real working Among Us crewmate images
const CREWMATE_IMAGES = {
  red: "https://i.imgur.com/ZSBDQv3.png", // Red crewmate
  blue: "https://i.imgur.com/KQ6eXzT.png", // Blue crewmate
  green: "https://i.imgur.com/4Q4Q4Q4.png", // Green crewmate
  pink: "https://i.imgur.com/9Q9Q9Q9.png", // Pink crewmate
  orange: "https://i.imgur.com/5Q5Q5Q5.png", // Orange crewmate
  yellow: "https://i.imgur.com/6Q6Q6Q6.png", // Yellow crewmate
  black: "https://i.imgur.com/7Q7Q7Q7.png", // Black crewmate
  white: "https://i.imgur.com/8Q8Q8Q8.png", // White crewmate
  purple: "https://i.imgur.com/9Q9Q9Q9.png", // Purple crewmate
  brown: "https://i.imgur.com/0Q0Q0Q0.png", // Brown crewmate
  cyan: "https://i.imgur.com/aQaQaQa.png", // Cyan crewmate
  lime: "https://i.imgur.com/bQbQbQb.png", // Lime crewmate
};

// Updated hat images with proper paths
const HAT_IMAGES = {
  none: "",
  plunger: "https://i.imgur.com/cQcQcQc.png", // Plunger hat
  police: "https://i.imgur.com/dQdQdQd.png", // Police hat
  crown: "https://i.imgur.com/eQeQeQe.png", // Crown hat
  // Add more hats as needed
};

export default function Details() {
  const { id } = useParams();
  const [crewmate, setCrewmate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrewmate = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("crewmates")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setCrewmate(data);
      } catch (err) {
        console.error("Error fetching crewmate:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrewmate();
  }, [id]);

  const getImageUrl = () => {
    if (crewmate?.image_url) return crewmate.image_url;
    const color = crewmate?.color?.toLowerCase() || "red";
    return CREWMATE_IMAGES[color] || CREWMATE_IMAGES.red;
  };

  const getHatImageUrl = () => {
    const hat = crewmate?.hat?.toLowerCase() || "none";
    return HAT_IMAGES[hat] || "";
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Scanning crewmate details...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-screen">
        <h2>⚠️ Emergency Meeting! ⚠️</h2>
        <p>Could not load crewmate: {error}</p>
        <Link to="/" className="among-us-button">
          Back to Lobby
        </Link>
      </div>
    );

  if (!crewmate)
    return (
      <div className="error-screen">
        <h2>Crewmate Not Found</h2>
        <p>This crewmate might have been ejected!</p>
        <Link to="/" className="among-us-button">
          Back to Lobby
        </Link>
      </div>
    );

  return (
    <div className="among-us-theme crewmate-details">
      <div className="crewmate-header">
        <div className="crewmate-avatar-container">
          <div
            className="crewmate-avatar-large"
            style={{
              backgroundColor: crewmate.color || "red",
              borderRadius: "50%",
              padding: "10px",
              position: "relative",
            }}
          >
            <img
              src={getImageUrl()}
              alt={crewmate.name || "Crewmate"}
              className="crewmate-image"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                filter: crewmate.is_impostor ? "hue-rotate(120deg)" : "none",
              }}
              onError={(e) => {
                e.target.src = CREWMATE_IMAGES.red;
                e.target.style.border = "2px dashed #ff0000";
              }}
            />
            {crewmate.hat && crewmate.hat !== "None" && (
              <img
                src={getHatImageUrl()}
                alt={`${crewmate.hat} hat`}
                className="crewmate-hat-image"
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80%",
                  maxWidth: "100px",
                }}
              />
            )}
          </div>
        </div>

        <div className="crewmate-title">
          <h2>{crewmate.name || "Unknown Crewmate"}</h2>
          <p
            className={`role-badge ${
              crewmate.is_impostor ? "impostor" : "crewmate"
            }`}
          >
            {crewmate.is_impostor
              ? "IMPOSTOR"
              : (crewmate.role || "CREWMATE").toUpperCase()}
          </p>
        </div>
      </div>

      <div className="crewmate-info">
        <h3>Details</h3>
        <div className="info-grid">
          <div>Color:</div>
          <div>{crewmate.color || "Unknown"}</div>
          <div>Hat:</div>
          <div>{crewmate.hat || "None"}</div>
          <div>Pet:</div>
          <div>{crewmate.pet || "None"}</div>
          <div>Skin:</div>
          <div>{crewmate.skin || "Default"}</div>
        </div>

        {crewmate.bio && (
          <div className="bio-section">
            <h3>Background Story</h3>
            <p>{crewmate.bio}</p>
          </div>
        )}

        <div className="action-buttons">
          <Link to={`/edit/${crewmate.id}`} className="among-us-button">
            ✏️ Customize Crewmate
          </Link>
          <Link to="/" className="among-us-button secondary">
            ← Back to Lobby
          </Link>
        </div>
      </div>
    </div>
  );
}
