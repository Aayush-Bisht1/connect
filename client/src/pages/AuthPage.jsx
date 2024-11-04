import React, { useState } from "react";
import LogInForm from "../components/LogInForm";
import SignUpForm from "../components/SignUpForm";

const AuthPage = () => {
  const [islogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-red-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-white mb-8">
          {islogin ? "Sign in to Connect" : "Create a Connect account"}
        </h2>
        <div className="bg-white p-8 rounded-lg shadow-xl">
          {islogin ? <LogInForm /> : <SignUpForm />}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {islogin
                ? "New to Connect?"
                : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!islogin)}
              className="mt-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-300"
            >
              {islogin ? "Create a new account" : "Sign in to your account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
