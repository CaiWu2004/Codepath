import React, { useState } from "react";
import Flashcard from "./Flashcard";
import "/Users/caimingwu/Downloads/Intro to Web Design/Codepath/flashcard-app/src/components/FlashcardList.css";
import AnswerInput from "./answerinput";

function FlashCardList({ cards }) {
  // State management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [displayCards, setDisplayCards] = useState([...cards]);
  const [masteredCards, setMasteredCards] = useState([]);

  const resetCardState = () => {
    setShowAnswer(false);
    setAnswerStatus(null);
    setUserAnswer("");
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentIndex < displayCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetCardState();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetCardState();
    }
  };

  // Improved answer validation with strict matching
  const checkAnswer = () => {
    // First check for empty submission
    if (!userAnswer.trim()) {
      setAnswerStatus("incorrect-empty");
      setShowAnswer(true);
      setCurrentStreak(0);
      return;
    }

    const correctAnswer = displayCards[currentIndex].answer.toLowerCase();
    const userGuess = userAnswer.toLowerCase().trim();

    // Strict matching conditions
    const isCorrect =
      // Exact match
      userGuess === correctAnswer ||
      // Match when answer contains multiple options (e.g., "Raiden Shogun/Ei")
      correctAnswer
        .split("/")
        .some((option) => option.trim().toLowerCase() === userGuess) ||
      // Match main words in answer (minimum 4 characters)
      correctAnswer
        .split(" ")
        .some((word) => word.length > 3 && userGuess.includes(word));

    setAnswerStatus(isCorrect ? "correct" : "incorrect");
    setShowAnswer(true);

    // Update streaks only for valid submissions
    if (isCorrect) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
      }
    } else {
      setCurrentStreak(0);
    }
  };

  // Shuffle functionality
  const handleShuffle = () => {
    if (isShuffled) {
      setDisplayCards([...cards]); // Reset to original order
    } else {
      setDisplayCards([...cards].sort(() => Math.random() - 0.5));
    }
    setIsShuffled(!isShuffled);
    setCurrentIndex(0);
    resetCardState();
  };

  // Mastered cards system
  const handleMasterCard = () => {
    setMasteredCards([...masteredCards, displayCards[currentIndex]]);
    const newCards = displayCards.filter((_, i) => i !== currentIndex);
    setDisplayCards(newCards);

    if (currentIndex >= newCards.length && newCards.length > 0) {
      setCurrentIndex(newCards.length - 1);
    }

    resetCardState();
  };

  // Handle empty state when all cards are mastered
  if (displayCards.length === 0) {
    return (
      <div className="empty-state">
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You've mastered all {cards.length} cards!</p>
        <button
          onClick={() => {
            setDisplayCards([...cards]);
            setMasteredCards([]);
            setCurrentIndex(0);
            resetCardState();
          }}
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <div className="navigation">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className={currentIndex === 0 ? "disabled" : ""}
        >
          Previous
        </button>
        <span>
          {currentIndex + 1}/{displayCards.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === displayCards.length - 1}
          className={currentIndex === displayCards.length - 1 ? "disabled" : ""}
        >
          Next
        </button>
        <button onClick={handleShuffle}>
          {isShuffled ? "Reset Order" : "Shuffle Cards"}
        </button>
      </div>

      <div className="streak-counter">
        <p>🔥 Current Streak: {currentStreak}</p>
        <p>🏆 Longest Streak: {longestStreak}</p>
        <p>
          🎯 Mastered: {masteredCards.length}/{cards.length}
        </p>
      </div>

      <Flashcard
        card={displayCards[currentIndex]}
        showAnswer={showAnswer}
        answerStatus={answerStatus}
      />

      {!showAnswer && (
        <AnswerInput
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          checkAnswer={checkAnswer}
        />
      )}

      {answerStatus && (
        <div className={`feedback ${answerStatus}`}>
          {answerStatus === "correct"
            ? "✅ Correct!"
            : answerStatus === "incorrect-empty"
            ? "⚠️ Please enter an answer!"
            : `❌ Incorrect! The answer is: ${displayCards[currentIndex].answer}`}
          {showAnswer && answerStatus !== "incorrect-empty"}
        </div>
      )}
    </div>
  );
}

export default FlashCardList;
