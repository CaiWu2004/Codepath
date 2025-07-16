export default function TopBreweries({ topBreweriesByYear }) {
  return (
    <div className="top-breweries">
      <h2>Top Breweries by Year</h2>
      {Object.entries(topBreweriesByYear).map(([year, breweries]) => (
        <div key={year} className="year-section">
          <h3>{year}</h3>
          <div className="year-breweries">
            {breweries.map((brewery) => (
              <div key={brewery.id} className="top-brewery-card">
                <h4>{brewery.name}</h4>
                <p>
                  {brewery.city}, {brewery.state}
                </p>
                <p>Type: {brewery.brewery_type}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
