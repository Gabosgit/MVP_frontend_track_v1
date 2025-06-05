import { useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { login } from "../services/AuthService"; // Import authentication function login
import { PageWrapper } from "../components/PageWrapper";

export default function Login() {
  const apiBaseUrl = useContext(ApiContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      await login(username, password, apiBaseUrl); // Calls the authentication login function from ../services/AuthService
      alert("Login successful!"); // shows success message
      window.location.href = `/dashboard`; // Redirect with username
    } catch (error) {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <PageWrapper
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
    /**
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm border border-gray-300">
      <label className="block text-gray-700">Username:</label>
      <input type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="text-black w-full p-2 border border-gray-400 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />

      <label className="block text-gray-700 mt-4">Password:</label>
      <input type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="text-black w-full p-2 border border-gray-400 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500" />

      <button type="submit" className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Sign In
      </button>
    </form>
    */




<div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
    <form className="space-y-6" onSubmit={handleSubmit} >
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
        <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <input placeholder="Enter your username" 
            value={username} onChange={(e) => setUsername(e.target.value)} 
            type="text" 
            name="username"
            id="username" 
            className="bg-red-900 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-custom-purple-start/10 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
            required />
        </div>
        <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input type="password" 

            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"

            name="password" 
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
            required />
        </div>
        <div className="flex items-start">
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                </div>
                <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
            </div>
            <a href="#" className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
        </div>
        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
        </div>
    </form>
</div>

  )
  
}
