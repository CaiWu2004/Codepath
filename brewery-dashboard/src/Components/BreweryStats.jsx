export default function BreweryStats({ breweries }) {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Breweries</h3>
        <p>{breweries.length}</p>
      </div>
      <div className="stat-card">
        <h3>Micro Breweries</h3>
        <p>{breweries.filter((b) => b.brewery_type === "micro").length}</p>
      </div>
      <div className="stat-card">
        <h3>Cities Available</h3>
        <p>{[...new Set(breweries.map((b) => b.city))].length}</p>
      </div>
    </div>
  );
}
