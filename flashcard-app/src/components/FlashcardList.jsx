import React, { useState } from "react";
import Flashcard from "./Flashcard";
import "/Users/caimingwu/Downloads/Intro to Web Design/Codepath/flashcard-app/src/components/FlashcardList.css";

function FlashCardList({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function showNextCard() {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * cards.length);
    } while (nextIndex === currentIndex && cards.length > 1);
    setCurrentIndex(nextIndex);
  }

  return (
    <div>
      <Flashcard card={cards[currentIndex]} />
      <button className="next-button" onClick={showNextCard}>
        Next Random Card
      </button>
    </div>
  );
}

export default FlashCardList;
