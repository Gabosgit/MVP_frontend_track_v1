import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import { login } from "../services/AuthService"; // Import authentication function login
import Content from "../components/Content";

export default function Login() {
  const apiBaseUrl = useContext(ApiContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      await login(username, password, apiBaseUrl); // Calls the authentication login function from ../services/AuthService
      // alert("Login successful!"); // shows success message
      window.location.href = `/dashboard`; // Redirect with username
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <Content
      pageName={"Login"}
      htmlContent={<LoginContent
        username={username} 
        setUsername={setUsername} 
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit} />} 
    />
  );
}

function LoginContent({username, setUsername, password, setPassword, handleSubmit}) {
  return (
    <div className="mt-20  max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-card backdrop-blur-lg shadow-2xl rounded-2xl p-8 sm:p-10 border border-gray-200/60 dark:border-dark-nav-border animate-slideInUp">
      <form className="space-y-6" onSubmit={handleSubmit} >
        <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
         dark:from-indigo-300 dark:to-purple-400 dark:text-transparent dark:bg-gradient-to-r">
            Sign in to our platform
        </h2>
        <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <input placeholder="Enter your username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            type="text" 
            name="username"
            id="username"
            autoComplete="username" // For autocomplete in Chromium Browsers
            className="bg-gray-50 appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900
                      focus:outline-none focus:ring-custom-purple-start focus:border-custom-purple-start focus:z-10 sm:text-sm
                      dark:border-dark-input-border placeholder-gray-500 dark:placeholder-gray-400  dark:text-dark-text 
                      dark:bg-dark-input-bg  dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors rounded-lg" 
            required />
        </div>
        <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your password
            </label>
            <input type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            name="password" 
            id="password"
            autoComplete="current-password" // For autocomplete in Chromium Browsers
            className="bg-gray-50 appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900
                      focus:outline-none focus:ring-custom-purple-start focus:border-custom-purple-start focus:z-10 sm:text-sm
                      dark:border-dark-input-border placeholder-gray-500 dark:placeholder-gray-400  dark:text-dark-text 
                      dark:bg-dark-input-bg  dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors rounded-lg"
            required />
        </div>
        <div className="flex items-start">
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 
                    dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"/>
                </div>
                <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
            </div>
            <Link to="/forgot_password" className="ms-auto text-sm text-custom-purple-start hover:underline dark:text-custom-purple-start">
              Lost Password?
            </Link>
        </div>
        <button type="submit" className="btn-submit relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md">
          Login to your account
        </button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered? 
            <Link to="/sign_up" className="text-custom-purple-start hover:underline 
            dark:text-custom-purple-start"> Create account
            </Link>
            
        </div>
      </form>
    </div>
  )
}
