import PropTypes from "prop-types";

const DogDisplay = ({ dog, onAttributeClick, bannedValues }) => {
  const handleClick = (attribute, value) => {
    onAttributeClick(attribute, value);
  };

  const isBanned = (value) => bannedValues.includes(value);

  return (
    <article className="dog-card">
      <figure>
        <img src={dog.image} alt={dog.name} loading="lazy" />
        <figcaption>{dog.name}</figcaption>
      </figure>

      <div className="dog-info">
        <div className="attribute">
          <span className="label">Breed:</span>
          <button
            className={`value ${isBanned(dog.breed) ? "banned" : ""}`}
            onClick={() => handleClick("breed", dog.breed)}
          >
            {dog.name}
          </button>
        </div>

        <div className="attribute">
          <span className="label">Group:</span>
          <button
            className={`value ${isBanned(dog.group) ? "banned" : ""}`}
            onClick={() => handleClick("group", dog.group)}
          >
            {dog.group}
          </button>
        </div>

        <div className="attribute">
          <span className="label">Temperament:</span>
          <div className="temperaments">
            {dog.temperament.split(",").map((trait, i) => (
              <button
                key={i}
                className={`value ${isBanned(trait.trim()) ? "banned" : ""}`}
                onClick={() => handleClick("temperament", trait.trim())}
              >
                {trait.trim()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

DogDisplay.propTypes = {
  dog: PropTypes.shape({
    image: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    temperament: PropTypes.string.isRequired,
  }).isRequired,
  onAttributeClick: PropTypes.func.isRequired,
  bannedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DogDisplay;
