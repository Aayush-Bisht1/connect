import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LogInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login, loading} = useAuthStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    login({ email, password });
  }
  return (
    <form className="space-y-6"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="apperance-none bg-white rounded-md block w-full py-2 px-3 border rounded-md border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="apperance-none bg-white rounded-md block w-full py-2 px-3 border rounded-md border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        className={`w-full flex justify-center py-2 px-4 border border-transparent 
					rounded-md shadow-sm text-sm font-medium text-white ${
            loading
              ? "bg-pink-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          }`}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default LogInForm;
