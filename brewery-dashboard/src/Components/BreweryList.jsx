import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBeer, FaPhone, FaGlobe } from "react-icons/fa";

export default function BreweryList({ breweries }) {
  return (
    <div className="brewery-list">
      <div className="list-container">
        {breweries.map((brewery) => (
          <div key={brewery.id} className="brewery-card-wrapper">
            <Link to={`/brewery/${brewery.id}`} className="brewery-link">
              <div className="brewery-card">
                <h3>{brewery.name}</h3>
                <div className="brewery-details">
                  <p className="detail-item">
                    <FaBeer className="icon" />
                    <span className="detail-label">Type:</span>
                    {brewery.brewery_type}
                  </p>
                  <p className="detail-item">
                    <FaMapMarkerAlt className="icon" />
                    <span className="detail-label">Location:</span>
                    {brewery.city}, {brewery.state}
                  </p>
                  {brewery.phone && (
                    <p className="detail-item">
                      <FaPhone className="icon" />
                      <span className="detail-label">Phone:</span>
                      {brewery.phone}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
