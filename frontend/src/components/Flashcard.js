import { logoutUser } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Import useAuth hook
import examTopics from "../data/examTopics.json";

/**
 * Flashcard Component
 *
 * Provides a flashcard generator interface for various exam topics. 
 * It supports exam, domain, and concentration selections, dark mode, 
 * and user authentication.
 */
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

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); // ✅ Track authentication state

  // Redirect to /login if the user is not authenticated
  useEffect(() => {
    if (!authLoading && !user && window.location.pathname !== "/login") {
      console.log("User is not authenticated. Redirecting to /login...");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Toggle dark mode state
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Handle user logout and navigate to login page
  const handleLogout = async () => {
    if (user) {
      console.log(`Logging out user: ${user.email}`);
    }
    await logoutUser();
    navigate("/login"); // Ensure navigation after logout completes
  };

  // Reset domain and concentration selections when exam changes
  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
    setSelectedDomain("");
    setSelectedConcentration("");
    console.log("Selected Exam:", event.target.value);
  };

  // Handle domain change and reset concentration selection
  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
    setSelectedConcentration("");
  };

  // Returns the domain options for the selected exam
  const getDomainOptions = () => {
    return selectedExam ? examTopics[selectedExam]?.domains || [] : [];
  };

  // Returns the concentration options for the selected domain
  const getConcentrationOptions = () => {
    const domains = examTopics[selectedExam]?.domains || [];
    const domainObj = domains.find((d) => d.name === selectedDomain);
    return domainObj?.concentration_areas || [];
  };

  // Generate a flashcard based on the current selections
  const generateFlashcard = async () => {
    setLoading(true);
    setFeedback("");
    setFlashcard(null);
    setSelectedAnswerKey("");

    // Construct the request topic using the exam, domain, and concentration selections
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

      // Check for duplicate flashcards
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

  // Show a loading screen if authentication is still in progress
  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} min-h-screen flex flex-col items-center font-sans`}>
      
      {/* 🔹 Navbar with Logout and Dark Mode Toggle */}
      <nav className={`w-full ${darkMode ? "bg-gray-800 text-white" : "bg-indigo-600 text-white"} py-4 shadow-md flex justify-between items-center px-4`}>
        <h1 className="text-3xl font-bold">📚 Flashcard Generator</h1>
        <div className="flex space-x-4">
          <button onClick={toggleDarkMode} className="p-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600">
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded text-sm hover:bg-red-600">
            🚪 Logout
          </button>
        </div>
      </nav>

      <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} mt-10 p-6 rounded-xl shadow-lg w-full max-w-xl`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? "text-blue-300" : "text-blue-800"}`}>🔍 Generate a New Flashcard</h2>
        
        {/* Exam Selection Dropdown */}
        <div className="mb-4">
          <label htmlFor="examSelect">Exam:</label>
          <select
            id="examSelect"
            value={selectedExam}
            onChange={handleExamChange}
            className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} w-full p-2 border rounded`}
          >
            <option value="">-- Select an Exam --</option>
            {Object.keys(examTopics).map((exam) => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
        </div>

        {/* Domain Selection Dropdown */}
        {selectedExam && (
          <div className="mb-4">
            <label htmlFor="domainSelect">Domain:</label>
            <select
              id="domainSelect"
              value={selectedDomain}
              onChange={handleDomainChange}
              className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} w-full p-2 border rounded`}
            >
              <option value="">-- Select a Domain --</option>
              {getDomainOptions().map((domain) => (
                <option key={domain.name} value={domain.name}>{domain.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Concentration Selection Dropdown */}
        {selectedExam && selectedDomain && (
          <div className="mb-4">
            <label htmlFor="concentrationSelect">Concentration:</label>
            <select
              id="concentrationSelect"
              value={selectedConcentration}
              onChange={(e) => setSelectedConcentration(e.target.value)}
              className={`${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} w-full p-2 border rounded`}
            >
              <option value="">-- Select a Concentration --</option>
              {getConcentrationOptions().map((conc) => (
                <option key={conc} value={conc}>{conc}</option>
              ))}
            </select>
          </div>
        )}

        {/* Generate Flashcard Button */}
        {selectedExam && (
          <button 
            onClick={generateFlashcard} 
            disabled={loading} 
            className={`w-full mt-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
          >
            {loading ? "⏳ Generating..." : "🚀 Generate Flashcard"}
          </button>
        )}

        {/* Flashcard Display and Answer Submission */}
        {flashcard && (
          <div className="mt-4 p-4 border rounded space-y-4">
            <h3 className="text-lg font-semibold mb-2">{flashcard?.question}</h3>
            
            <div className="space-y-2">
              {Object.entries(flashcard?.choices || {}).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="answer"
                    value={key}
                    onChange={(e) => setSelectedAnswerKey(e.target.value)}
                    className="mt-1"
                  />
                  <label className="text-md leading-relaxed">{key}: {value}</label>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setFeedback(
                  selectedAnswerKey === flashcard?.correct_answer
                    ? "✅ Correct!"
                    : `❌ Incorrect! The correct answer is "${flashcard?.correct_answer}".`
                )
              }
              className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit Answer
            </button>

            <p className="mt-4 text-lg leading-relaxed">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Flashcard;
