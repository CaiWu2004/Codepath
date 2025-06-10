import React from "react";
import "/Users/caimingwu/Downloads/Intro to Web Design/Codepath/community-board/src/components/Card.css";

const Card = (props) => {
  return (
    <div className={`card ${props.color}`}>
      <img src={props.image} alt={props.title} className="card-image" />
      <div className="card-content">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
      <a
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        className="Card-button"
      >
        Learn More
      </a>
    </div>
  );
};

export default Card;
