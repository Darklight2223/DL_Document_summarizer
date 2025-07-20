import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const SignUp = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      localStorage.setItem("dlscanner_token", data.token);
      setAuth({ token: data.token });
      //setAuth({ loggedIn: true });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-md w-full text-white shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <label className="block mb-2 text-sm font-semibold">Email</label>
        <input
          type="email"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-semibold">Password</label>
        <input
          type="password"
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-semibold">Confirm Password</label>
        <input
          type="password"
          className="w-full mb-6 px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition"
        >
          Create Account
        </button>

        <p className="mt-4 text-sm text-gray-400 text-center">
          Already have an account?{' '}
          <a href="/signin" className="text-blue-400 hover:text-blue-500 font-medium">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
