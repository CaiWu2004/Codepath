export default function AttributeSelector({ name, value, onChange }) {
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="attribute-selector">
      <label>{name}:</label>
      <div className="attribute-buttons">
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            className={`attribute-btn ${value >= level ? "active" : ""}`}
            onClick={() => onChange(name.toLowerCase(), level)}
          >
            {level}
          </button>
        ))}
      </div>
      <span className="current-value">Current: {value}</span>
    </div>
  );
}
