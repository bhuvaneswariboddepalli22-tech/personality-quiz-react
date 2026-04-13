import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Question from "./components/Question";
import Results from "./components/Results";
import UserForm from "./components/UserForm";
import { UserProvider } from "./components/UserContext";

export default function App() {
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
  ];

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
  };

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function determineElement(answers) {
    const counts = {};

    answers.forEach((answer) => {
      const el = elements[answer];
      counts[el] = (counts[el] || 0) + 1;
    });

    return Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );
  }

  async function fetchArtwork(keyword) {
    const res = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`
    );
    const data = await res.json();

    if (data.objectIDs && data.objectIDs.length > 0) {
      const artRes = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${data.objectIDs[0]}`
      );
      const artData = await artRes.json();
      setArtwork(artData);
    }
  }

  useEffect(() => {
    if (currentQuestionIndex === questions.length) {
      const result = determineElement(answers);
      setElement(result);
      fetchArtwork(keywords[result]);
    }
  }, [currentQuestionIndex]);

  return (
    <UserProvider>
      <Header />

      <Routes>
        <Route path="/" element={<UserForm />} />

        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question
                question={questions[currentQuestionIndex].question}
                options={questions[currentQuestionIndex].options}
                onAnswer={handleAnswer}
              />
            ) : (
              <Results element={element} artwork={artwork} />
            )
          }
        />
      </Routes>
    </UserProvider>
  );
}
