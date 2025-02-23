import { useState, useEffect } from "react";
import { loginUser, googleSignIn } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // ✅ Prevent infinite redirection loop
  useEffect(() => {
    if (!authLoading && user && window.location.pathname !== "/flashcards") {
      console.log("Redirecting: User is logged in", user);
      navigate("/flashcards");
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await loginUser(email, password);
    if (result.success) {
      console.log("Login successful:", result.user);
      navigate("/flashcards");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-2 border rounded"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>

        <div className="mt-4 text-center">or</div>

        <button onClick={googleSignIn} className="w-full bg-red-500 text-white py-2 rounded mt-2 hover:bg-red-600">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
