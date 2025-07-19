import { useParams, Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBeer,
  FaPhone,
  FaGlobe,
  FaCalendarAlt,
  FaFlag,
} from "react-icons/fa";

export default function BreweryDetail({ breweries }) {
  const { id } = useParams();

  if (!breweries || breweries.length === 0) {
    return <div className="loading-message">Loading breweries...</div>;
  }

  const brewery = breweries.find((b) => b.id === id);

  if (!brewery) {
    return (
      <div className="error-message">
        <h2>Brewery not found</h2>
        <p>No brewery exists with ID: {id}</p>
        <Link to="/" className="back-link">
          ← Back to all breweries
        </Link>
      </div>
    );
  }

  return (
    <div className="brewery-detail-container">
      <h2>{brewery.name}</h2>

      <div className="detail-content">
        <div className="brewery-info">
          <div className="info-section">
            <h3>Basic Information</h3>
            <p>
              <FaBeer /> Type: {brewery.brewery_type}
            </p>
            <p>
              <FaMapMarkerAlt /> {brewery.street}, {brewery.city},{" "}
              {brewery.state}, {brewery.country}
            </p>
            {brewery.postal_code && <p>Postal Code: {brewery.postal_code}</p>}
          </div>

          <div className="info-section">
            <h3>Contact Information</h3>
            {brewery.phone && (
              <p>
                <FaPhone /> {brewery.phone}
              </p>
            )}
            {brewery.website_url && (
              <p>
                <FaGlobe />{" "}
                <a
                  href={brewery.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </a>
              </p>
            )}
          </div>

          <div className="info-section">
            <h3>Additional Details</h3>
            {brewery.created_at && (
              <p>
                <FaCalendarAlt /> Established:{" "}
                {new Date(brewery.created_at).toLocaleDateString()}
              </p>
            )}
            {brewery.country && (
              <p>
                <FaFlag /> Country: {brewery.country}
              </p>
            )}
          </div>
        </div>

        {brewery.latitude && brewery.longitude && (
          <div className="map-container">
            <h3>Location</h3>
            <iframe
              title="Brewery Location"
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://maps.google.com/maps?q=${brewery.latitude},${brewery.longitude}&z=15&output=embed`}
            ></iframe>
          </div>
        )}
      </div>

      <Link to="/" className="back-link">
        ← Back to all breweries
      </Link>
    </div>
  );
}
