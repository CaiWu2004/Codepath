import PropTypes from "prop-types";

const BanList = ({ items, onItemClick }) => {
  if (items.length === 0) {
    return (
      <aside className="ban-list empty">
        <h2>No banned attributes</h2>
        <p>Click on dog attributes to ban them</p>
      </aside>
    );
  }

  return (
    <aside className="ban-list">
      <h2>Banned Attributes</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <button
              className="ban-item"
              onClick={() => onItemClick(item.attribute, item.value)}
            >
              <span className="attribute">{item.attribute}:</span>
              <span className="value">{item.value}</span>
              <span className="remove">×</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

BanList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      attribute: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default BanList;
