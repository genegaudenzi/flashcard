import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Flashcard from "./components/Flashcard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
                <h1>Flashcard App</h1>

                <Routes>
                    {/* Public Routes */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected Flashcard Route */}
                    <Route 
                        path="/flashcards" 
                        element={
                            <ProtectedRoute>
                                <Flashcard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Default Redirect (Optional) */}
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

