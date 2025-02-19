import React, { useState } from "react";
import examTopics from "../data/examTopics.json";

function Flashcard() {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedConcentration, setSelectedConcentration] = useState("");
  const [flashcard, setFlashcard] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState("");
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const generateFlashcard = async () => {
    setLoading(true);
    setFeedback("");
    setFlashcard(null);
    setSelectedAnswerKey("");

    const requestTopic = `${selectedExam} - ${selectedDomain} (${selectedConcentration})`;

    try {
      const response = await fetch(
        "https://us-central1-flashcard-60334.cloudfunctions.net/generate_flashcard",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: requestTopic }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch flashcard.");
      const data = await response.json();

      const isDuplicate = generatedFlashcards.some((fc) => fc.question === data.question);
      if (isDuplicate) {
        setFeedback("⚠️ Duplicate question detected. Please generate again.");
      } else {
        setFlashcard(data);
        setGeneratedFlashcards((prev) => [...prev, data]);
      }
    } catch (error) {
      setFeedback("❌ Error generating flashcard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSelectedDomain("");
    setSelectedConcentration("");
  };

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
    setSelectedConcentration("");
  };

  const getDomainOptions = () => selectedExam ? examTopics[selectedExam]?.domains || [] : [];
  const getConcentrationOptions = () => {
    const domain = getDomainOptions().find((d) => d.name === selectedDomain);
    return domain?.concentration_areas || [];
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen flex flex-col items-center font-sans`}>
      <nav className={`w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-indigo-600 text-white'} py-4 shadow-md flex justify-between items-center`}>
        <h1 className="text-3xl font-bold">📚 Flashcard Generator</h1>
        <button onClick={toggleDarkMode} className="p-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600">{darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>
      </nav>

      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} mt-10 p-6 rounded-xl shadow-lg w-full max-w-xl`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>🔍 Generate a New Flashcard</h2>
        <div className="mb-4">
          <label htmlFor="examSelect">Exam:</label>
          <select id="examSelect" value={selectedExam} onChange={handleExamChange} className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} w-full p-2 border rounded`}>
            <option value="">-- Select an Exam --</option>
            {Object.keys(examTopics).map((exam) => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
        </div>

        {selectedExam && (
          <div className="mb-4">
            <label htmlFor="domainSelect">Domain:</label>
            <select id="domainSelect" value={selectedDomain} onChange={handleDomainChange} className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} w-full p-2 border rounded`}>
              <option value="">-- Select a Domain --</option>
              {getDomainOptions().map((domain) => (
                <option key={domain.name} value={domain.name}>{domain.name}</option>
              ))}
            </select>
          </div>
        )}

        {selectedDomain && (
          <div className="mb-4">
            <label htmlFor="concentrationSelect">Concentration Area:</label>
            <select id="concentrationSelect" value={selectedConcentration} onChange={(e) => setSelectedConcentration(e.target.value)} className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} w-full p-2 border rounded`}>
              <option value="">-- Select a Concentration Area --</option>
              {getConcentrationOptions().map((area, index) => (
                <option key={index} value={area}>{area}</option>
              ))}
            </select>
          </div>
        )}

        {flashcard && (
          <div className="mt-4 p-4 border rounded space-y-4">
          <h3 className="text-lg font-semibold mb-2">{flashcard?.question}</h3>
          <div className="space-y-2">
            {Object.entries(flashcard?.choices || {}).map(([key, value]) => (
              <div key={key} className="flex items-start space-x-3">
                <input type="radio" name="answer" value={key} onChange={(e) => setSelectedAnswerKey(e.target.value)} className="mt-1" />
                <label className="text-md leading-relaxed">{key}: {value}</label>
              </div>
            ))}
          </div>
          <button onClick={() => setFeedback(selectedAnswerKey === flashcard?.correct_answer ? "✅ Correct!" : `❌ Incorrect! The correct answer is "${flashcard?.correct_answer}".`)} className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600">Submit Answer</button>
          <p className="mt-4 text-lg leading-relaxed">{feedback}</p>
        </div>
        )}
        <button onClick={generateFlashcard} disabled={loading || !selectedConcentration} className={`w-full mt-4 py-2 rounded ${loading || !selectedConcentration ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}>{loading ? "⏳ Generating..." : "🚀 Generate Flashcard"}</button>
      </div>

      <footer className="mt-10 text-sm text-gray-500 dark:text-gray-400">© 2025 Flashcard App - Built with 💙 by Gene</footer>
    </div>
  );
}

export default Flashcard;
