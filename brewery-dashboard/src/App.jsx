import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "./App.css";
import BreweryList from "./Components/BreweryList";
import BreweryDetail from "./Components/BreweryDetail";
import BreweryStats from "./Components/BreweryStats";
import BreweryCharts from "./Components/BreweryCharts";

function App() {
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [allCities, setAllCities] = useState([]);
  const location = useLocation();

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

  // Function to render the sidebar content (used in both views)
  const renderSidebar = () => (
    <div className="sidebar">
      <BreweryStats breweries={breweries} />
      <BreweryCharts breweries={breweries} />

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
    </div>
  );

  return (
    <div className="app medieval-theme">
      <div className="banner">
        <Link to="/">
          <h1>Ye Olde Brewery Finder</h1>
        </Link>
      </div>

      <div className="main-content">
        {renderSidebar()}

        <div className="content-area">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {loading && (
                    <div className="loading-skeleton">
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
                      {selectedCity && (
                        <h2>Top 10 Breweries in {selectedCity}</h2>
                      )}
                      {selectedCity && filteredBreweries.length === 0 ? (
                        <p>No breweries found in {selectedCity}</p>
                      ) : (
                        <BreweryList breweries={filteredBreweries} />
                      )}
                    </>
                  )}
                </>
              }
            />
            <Route
              path="/brewery/:id"
              element={<BreweryDetail breweries={breweries} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
