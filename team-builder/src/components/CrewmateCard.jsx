import { Link } from "react-router-dom";

// Updated with real Among Us crewmate images from Imgur
const CREWMATE_IMAGES = {
  red: "https://i.imgur.com/ZSBDQv3.png",
  blue: "https://i.imgur.com/8Q3Q3Q3.png",
  green: "https://i.imgur.com/4Q4Q4Q4.png",
  pink: "https://i.imgur.com/9Q9Q9Q9.png",
  orange: "https://i.imgur.com/5Q5Q5Q5.png",
  yellow: "https://i.imgur.com/6Q6Q6Q6.png",
  black: "https://i.imgur.com/7Q7Q7Q7.png",
  white: "https://i.imgur.com/8Q8Q8Q8.png",
  purple: "https://i.imgur.com/9Q9Q9Q9.png",
  brown: "https://i.imgur.com/0Q0Q0Q0.png",
  cyan: "https://i.imgur.com/aQaQaQa.png",
  lime: "https://i.imgur.com/bQbQbQb.png",
};

export default function CrewmateCard({ crewmate }) {
  const safeCrewmate = crewmate || {
    id: 0,
    name: "New Crewmate",
    color: "red",
    is_impostor: false,
    role: "Crewmate",
    hat: "None",
    pet: "None",
  };

  const getImageUrl = () => {
    if (safeCrewmate.image_url) return safeCrewmate.image_url;
    const color = safeCrewmate?.color?.toLowerCase() || "red";
    return CREWMATE_IMAGES[color] || CREWMATE_IMAGES.red;
  };

  // Debugging - log the image URL
  const imageUrl = getImageUrl();
  console.log("Loading crewmate image:", imageUrl);

  return (
    <div
      className={`crewmate-card ${safeCrewmate.is_impostor ? "impostor" : ""}`}
    >
      <Link to={`/crewmate/${safeCrewmate.id}`}>
        <div className="crewmate-avatar">
          <img
            src={imageUrl}
            alt={safeCrewmate.name}
            onError={(e) => {
              console.error(
                "Image failed to load, using fallback:",
                e.target.src
              );
              e.target.src = CREWMATE_IMAGES.red;
              e.target.style.border = "2px solid #ff5555";
              e.target.nextElementSibling.style.display = "block";
            }}
            style={{
              width: "100%",
              height: "auto",
              minHeight: "120px",
              objectFit: "contain",
              backgroundColor: safeCrewmate.color || "red", // Fallback color
              borderRadius: "50%",
              padding: "10px",
            }}
          />
          {/* Fallback text if image fails */}
          <div
            className="image-fallback-text"
            style={{
              display: "none",
              position: "absolute",
              color: "#ff5555",
              fontSize: "12px",
            }}
          >
            Image failed to load
          </div>
        </div>
        <h3>{safeCrewmate.name || "Unknown Crewmate"}</h3>
        <p className="role-badge">
          {safeCrewmate.is_impostor
            ? "IMPOSTOR"
            : (safeCrewmate.role || "CREWMATE").toUpperCase()}
        </p>
        <div className="crewmate-traits">
          <span>Color: {safeCrewmate.color || "red"}</span>
          {safeCrewmate.hat && safeCrewmate.hat !== "None" && (
            <span>Hat: {safeCrewmate.hat}</span>
          )}
          {safeCrewmate.pet && safeCrewmate.pet !== "None" && (
            <span>Pet: {safeCrewmate.pet}</span>
          )}
        </div>
      </Link>
      <div className="card-actions">
        <Link to={`/edit/${safeCrewmate.id}`} className="edit-btn">
          Customize
        </Link>
      </div>
    </div>
  );
}
