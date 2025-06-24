import React, { useState } from "react";
import "/Users/caimingwu/Downloads/Intro to Web Design/Codepath/flashcard-app/src/components/Flashcard.css";

// function Flashcard({ card }) {
//   const [flipped, setFlipped] = useState(false);

//   function toggleFlip() {
//     setFlipped((prev) => !prev);
//   }

//   return (
//     <div
//       className={`flashcard ${flipped ? "back" : "front"}`}
//       onClick={toggleFlip}
//       role="button"
//       tabIndex={0}
//       onKeyDown={(e) => e.key === "Enter" && toggleFlip()}
//       aria-pressed={flipped}
//     >
//       {flipped ? card.answer : card.question}
//     </div>
//   );
// }
function Flashcard({ card, showAnswer, answerStatus }) {
  return (
    <div
      className={`flashcard ${showAnswer ? "back" : "front"} ${
        answerStatus ? answerStatus : ""
      }`}
    >
      {showAnswer ? card.answer : card.question}
    </div>
  );
}

export default Flashcard;
