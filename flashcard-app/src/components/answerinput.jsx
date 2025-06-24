import React from "react";

function AnswerInput({ userAnswer, setUserAnswer, checkAnswer }) {
  return (
    <div className="answer-input">
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Your guess..."
        onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
      />
      <button onClick={checkAnswer}>Submit</button>
    </div>
  );
}

export default AnswerInput;
