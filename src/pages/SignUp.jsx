import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import axios from "axios";
import { PageWrapper } from "../components/PageWrapper";

export default function SignUp() {
  const apiBaseUrl = useContext(ApiContext);
  
  const [form, setForm] = useState({
    username: "",
    type_of_entity: "",
    password: "",
    name: "",
    surname: "",
    email_address: "",
    phone_number: "",
    vat_id: "",
    bank_account: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adjust the API endpoint as needed.
      const response = await axios.post(`${apiBaseUrl}/user`, form, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Sign up response:", response.data);
      alert("Sign up successful!");
      // Optionally, redirect the user after successful sign-up.
      window.location.href = `/login`; // Redirect to login
    } catch (error) {
      console.error("Sign up failed:", error.response ? error.response.data : error.message);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <PageWrapper
      htmlContent={<SignUpContent 
        handleSubmit={handleSubmit} 
        form={form}
        handleChange={handleChange}
        />} 
    />
    )
}

function SignUpContent({handleSubmit, form, handleChange}) {
  return (
    <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-card backdrop-blur-lg shadow-2xl rounded-2xl p-8 sm:p-10 border border-gray-200/60 
    dark:border-dark-nav-border animate-slideInUp">
        <div>
            <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
            dark:text-transparent dark:bg-gradient-to-r dark:from-indigo-300 dark:to-purple-400">
                Create Your Account
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600 dark:text-dark-text-secondary">
                And start your journey with CreativePro.
            </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" value="true"/>
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label for="full-name" className="sr-only">Username</label>
                    <input id="full-name" name="full-name" type="text" autocomplete="name" required
                            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 bg-gray-50
                            rounded-t-md focus:outline-none focus:ring-custom-purple-start focus:border-custom-purple-start focus:z-10 sm:text-sm transition-colors
                            dark:border-dark-input-border placeholder-gray-500 dark:placeholder-gray-400  dark:text-dark-text  dark:bg-dark-input-bg  dark:focus:ring-indigo-400 dark:focus:border-indigo-400"
                            placeholder="Username"/>
                </div>
                <div>
                    <label for="email-address" className="sr-only">Email address</label>
                    <input id="email-address" name="email" type="email" autocomplete="email" required
                      className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-dark-input-border placeholder-gray-500 
                      dark:placeholder-gray-400 text-gray-900 dark:text-dark-text bg-gray-50 dark:bg-dark-input-bg focus:outline-none focus:ring-custom-purple-start focus:border-custom-purple-start 
                      dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors"
                      placeholder="Email address"
                    />
                </div>
                <div>
                    <label for="password" className="sr-only">Password</label>
                    <input id="password" name="password" type="password" autocomplete="new-password" required
                      className="bg-gray-50 appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900
                      focus:outline-none focus:ring-custom-purple-start focus:border-custom-purple-start focus:z-10 sm:text-sm
                      dark:border-dark-input-border placeholder-gray-500 dark:placeholder-gray-400  dark:text-dark-text 
                      dark:bg-dark-input-bg  dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors"
                      placeholder="Password"
                    />
                </div>
                <div>
                    <label for="confirm-password" className="sr-only">Confirm Password</label>
                    <input id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" required
                      className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-dark-input-border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-dark-text bg-gray-50 dark:bg-dark-input-bg rounded-b-md focus:outline-none focus:ring-custom-purple-start focus:border-custom-purple-start dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors"
                      placeholder="Confirm Password"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="terms-and-privacy" name="terms-and-privacy" type="checkbox" required
                        className="h-4 w-4 text-custom-purple-start dark:text-indigo-400 border-gray-300 dark:border-dark-input-border rounded focus:ring-custom-purple-start dark:focus:ring-offset-dark-card transition-colors"/>
                    <label for="terms-and-privacy" className="ml-2 block text-sm text-gray-700 dark:text-dark-text-secondary">
                        I agree to the 
                        <a href="/terms.html" className="font-medium text-custom-purple-start hover:text-custom-purple-end dark:text-indigo-400 dark:hover:text-indigo-300"> Terms</a> and <a href="/privacy.html" className="font-medium text-custom-purple-start hover:text-custom-purple-end dark:text-indigo-400 dark:hover:text-indigo-300">
                          Privacy Policy
                        </a>.
                    </label>
                </div>
            </div>

            <div>
                <button type="submit"
                        className="btn-submit relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md">
                    Sign Up
                </button>
            </div>
        </form>

        <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                Already have an account? 
                <Link to="/login">
                  <a className="font-medium text-custom-purple-start hover:text-custom-purple-end dark:text-indigo-400 dark:hover:text-indigo-300"> Log in
                  </a>
                </Link>
                
            </p>
        </div>

        <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/80 dark:bg-dark-card text-gray-500 dark:text-dark-text-secondary backdrop-blur-sm">Or continue with</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <a href="#" className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-dark-input-border rounded-md shadow-sm bg-gray-50 dark:bg-dark-input-bg text-sm font-medium text-gray-700 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-opacity-20 dark:hover:bg-white transition-colors">
                        <span className="sr-only">Sign up with Google</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            <path d="M1 1h22v22H1z" fill="none"/>
                        </svg>
                    </a>
                </div>
                  <div>
                    <a href="#" className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 
                    dark:border-dark-input-border rounded-md shadow-sm bg-gray-50 dark:bg-dark-input-bg text-sm font-medium text-gray-700 
                    dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-opacity-20 dark:hover:bg-white transition-colors">
                        <span className="sr-only">Sign up with GitHub</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.036 1.531 1.036.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.201 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
  )

}
