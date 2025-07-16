import { FaMapMarkerAlt, FaBeer, FaPhone, FaGlobe } from "react-icons/fa";

export default function BreweryList({ breweries }) {
  return (
    <div className="brewery-list">
      <h2>Breweries</h2>
      <div className="list-container">
        {breweries.map((brewery) => (
          <div key={brewery.id} className="brewery-card">
            <h3>{brewery.name}</h3>
            <div className="brewery-details">
              <p>
                <FaBeer /> Type: {brewery.brewery_type}
              </p>
              <p>
                <FaMapMarkerAlt /> {brewery.city}, {brewery.state}
              </p>
              {brewery.phone && (
                <p>
                  <FaPhone /> {brewery.phone}
                </p>
              )}
              {brewery.website_url && (
                <p>
                  <FaGlobe />
                  <a
                    href={brewery.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
