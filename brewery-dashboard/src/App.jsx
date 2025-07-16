import { useState, useEffect } from "react";
import "./App.css";
import BreweryList from "./Components/BreweryList";

function App() {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [allCities, setAllCities] = useState([]);

  // Get unique cities when breweries data loads
  useEffect(() => {
    if (breweries.length > 0) {
      const cities = [...new Set(breweries.map((b) => b.city))].sort();
      setAllCities(cities);
    }
  }, [breweries]);

  // Filter and get top 10 breweries by selected city
  const filteredBreweries = breweries
    .filter((brewery) => {
      const matchesCity = selectedCity ? brewery.city === selectedCity : true;
      const matchesType =
        typeFilter === "all" || brewery.brewery_type === typeFilter;
      return matchesCity && matchesType;
    })
    .slice(0, 10);

  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        const response = await fetch(
          "https://api.openbrewerydb.org/v1/breweries?per_page=50"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch breweries");
        }
        const data = await response.json();
        setBreweries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweries();
  }, []);

  return (
    <div className="app medieval-theme">
      <div className="banner">
        <h1>Ye Olde Brewery Finder</h1>
      </div>

      {loading && (
        <div className="loading-skeleton">
          <div className="skeleton-stat-container">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-stat"></div>
            ))}
          </div>
          <div className="skeleton-list">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-item"></div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <>
          <div className="stats-container">
            <div className="stat-card">
              <h3>Top 10 Breweries</h3>
              <p>{filteredBreweries.length}</p>
            </div>
            <div className="stat-card">
              <h3>Micro Breweries</h3>
              <p>
                {breweries.filter((b) => b.brewery_type === "micro").length}
              </p>
            </div>
            <div className="stat-card">
              <h3>Cities Available</h3>
              <p>{allCities.length}</p>
            </div>
          </div>

          <div className="search-filter-container">
            <div className="search-container">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select a City</option>
                {allCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="filters">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="micro">Micro</option>
                <option value="nano">Nano</option>
                <option value="regional">Regional</option>
                <option value="brewpub">Brewpub</option>
                <option value="large">Large</option>
                <option value="planning">Planning</option>
                <option value="bar">Bar</option>
                <option value="contract">Contract</option>
                <option value="proprietor">Proprietor</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {selectedCity && <h2>Top 10 Breweries in {selectedCity}</h2>}
          {selectedCity && filteredBreweries.length === 0 ? (
            <p>No breweries found in {selectedCity}</p>
          ) : (
            <BreweryList breweries={filteredBreweries} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
