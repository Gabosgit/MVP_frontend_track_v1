import { useState, useContext, useEffect } from "react";
import Content from "../components/Content";
import { ApiContext } from "../context/ApiContext";
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used
import axios from "axios";


// --- Message Display Component ---
const MessageDisplay = ({ message}) => {
    if (!message) return null;
    const baseClasses = "p-3 rounded-md text-sm mb-4";
    return (
        <div className={`${baseClasses}`}>
            {message}
        </div>
    );
};


function ForgotPasswordContent() {
    const apiBaseUrl = useContext(ApiContext);
    const [emailAddress, setEmailAddress] = useState("")
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setEmailAddress(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiBaseUrl}/forgot-password`, {
                email: emailAddress,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    // IMPORTANT: No Authorization header here.
                },
            });

            console.log("Forgot Password response:", response.data);
            setMessage(response.data.message || "Password has been successfully reset!", "success");
            setSent(true)
            setEmailAddress("");

        } catch (error) {
            console.error("Send reset password email failed:", error.response ? error.response.data : error.message);
            const errorMessage = error.response?.data?.detail || "Send reset email password failed. Please try again.";
            setMessage(errorMessage, "error");
        }
    }


    return (
        <div className="mt-24 max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-card backdrop-blur-lg shadow-2xl rounded-2xl p-8 sm:p-10 border border-gray-200/60 dark:border-dark-nav-border animate-slideInUp">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end
                dark:from-indigo-300 dark:to-purple-400 dark:text-transparent dark:bg-gradient-to-r">
                    Forgot Password
                </h2>

                <MessageDisplay message={message} />

                {!sent && 
                    <>
                        <div>
                            <label htmlFor="emailAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Email Address
                            </label>
                            <input
                            id="emailAddress"
                            type="email"
                            name="emailAddress"
                            value={emailAddress}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-dark-input-border placeholder-gray-500 
                            dark:placeholder-gray-400 text-gray-900 dark:text-dark-text bg-gray-50 dark:bg-dark-input-bg focus:outline-none focus:ring-custom-purple-start focus:border-custom-purple-start 
                            dark:focus:ring-indigo-400 dark:focus:border-indigo-400 focus:z-10 sm:text-sm transition-colors"
                            />
                        </div>
                        <div className="flex items-start">
                            <Link to="/login" className="ms-auto text-sm text-custom-purple-start hover:underline dark:text-custom-purple-start">
                                Login
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-purple-start hover:bg-custom-purple-end focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-purple-start"
                        >
                            Reset Password
                        </button>
                    </>
                }
                
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

export default function ForgotPassword() {

    return (
        <Content
            pageName={"Reset Password"}
            htmlContent={<ForgotPasswordContent />}
        />
    )
}