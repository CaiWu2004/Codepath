import React from "react";
import FlashcardList from "./components/FlashcardList";
import "/Users/caimingwu/Downloads/Intro to Web Design/Codepath/flashcard-app/src/App.css";
import cards from "./components/cards";

function App() {
  return (
    <div className="app-container">
      <h1>Name that Character</h1>
      <p>Guess your favorite game, movie, and anime charatcer !</p>
      <p>
        <strong>Total Cards:</strong> {cards.length}
      </p>
      <FlashcardList cards={cards} />
    </div>
  );
}

export default App;
