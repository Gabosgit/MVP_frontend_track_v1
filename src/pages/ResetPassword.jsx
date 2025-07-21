import { useState, useContext, useEffect } from "react";
import Content from "../components/Content";
import { ApiContext } from "../context/ApiContext";
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Assuming react-router-dom is used
import axios from "axios";
import PasswordField from '../components/PasswordField';

// --- Message Display Component ---
const MessageDisplay = ({ message, type }) => {
    if (!message) return null;
    const baseClasses = "p-3 rounded-md text-sm mb-4";
    const typeClasses = {
        success: "bg-green-100 text-green-800 border border-green-400",
        error: "bg-red-100 text-red-800 border border-red-400",
    };
    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            {message}
        </div>
    );
};


function ResetPasswordContent() {
    const apiBaseUrl = useContext(ApiContext);
    const location = useLocation(); // Hook to access URL query parameters
    const navigate = useNavigate(); // Hook for navigation

    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // State for password field errors
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // Effect to extract token from URL on component mount
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlToken = queryParams.get("token");
        if (urlToken) {
            setToken(urlToken);
            // Optionally, show a message if token is present
            setMessage("Please enter your new password.");
            setMessageType("success");
        } else {
            // If no token in URL, redirect to forgot password or show error
            setMessage("No password reset token found in the URL. Please use the link from your email.");
            setMessageType("error");
            // navigate('/forgot-password'); // Uncomment to redirect
        }
    }, [location.search, navigate]); // Rerun if URL search params change

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        setPasswordError(""); // Clear error on change
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmNewPassword(e.target.value);
        setConfirmPasswordError(""); // Clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        let hasError = false;

        if (!newPassword || newPassword.length < 4) {
            setPasswordError("Password must be at least 4 characters.");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (newPassword !== confirmNewPassword) {
            setConfirmPasswordError("Passwords do not match.");
            hasError = true;
        } else {
            setConfirmPasswordError("");
        }

        if (hasError) {
            setMessage("Please correct the errors above.", "error");
            return;
        }

        if (!token) {
            setMessage("Missing password reset token. Please use the link from your email.", "error");
            return;
        }

        try {
            const response = await axios.post(`${apiBaseUrl}/reset-password`, {
                token: token,
                new_password: newPassword,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    // IMPORTANT: No Authorization header here. The reset token is in the body.
                },
            });

            console.log("Reset Password response:", response.data);
            setMessage(response.data.message || "Password has been successfully reset!", "success");
            setNewPassword("");
            setConfirmNewPassword("");
            setToken(""); // Invalidate token in state after use

            // Optionally, redirect the user after successful reset
            setTimeout(() => {
                navigate('/login'); // Redirect to login page
            }, 3000);

        } catch (error) {
            console.error("Reset password failed:", error.response ? error.response.data : error.message);
            const errorMessage = error.response?.data?.detail || "Reset password failed. Please try again.";
            setMessage(errorMessage, "error");
        }
    };

    return (
        <div className="mt-24 max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-card backdrop-blur-lg shadow-2xl rounded-2xl p-8 sm:p-10 border border-gray-200/60 dark:border-dark-nav-border animate-slideInUp">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end
                dark:from-indigo-300 dark:to-purple-400 dark:text-transparent dark:bg-gradient-to-r">
                    Reset Password
                </h2>

                <MessageDisplay message={message} type={messageType} />

                {/* New Password Field */}
                <PasswordField
                    label="New password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    name="new_password"
                    id="new_password"
                    autoComplete="new-password"
                    minlength="4"
                    error={passwordError}
                />

                {/* Confirm New Password Field */}
                <PasswordField
                    label="Confirm New password"
                    placeholder="Confirm your new password"
                    value={confirmNewPassword}
                    onChange={handleConfirmPasswordChange}
                    name="confirmNewPassword"
                    id="confirmConfirmPassword" // Changed ID to be unique
                    autoComplete="new-password"
                    minlength="4"
                    error={confirmPasswordError}
                />

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

                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Not registered?
                    <Link to="/sign_up" className="text-custom-purple-start hover:underline
                    dark:text-custom-purple-start"> Create account
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default function ResetPassword() {

    return (
        <Content
            pageName={"Reset Password"}
            htmlContent={<ResetPasswordContent />}
        />
    )
}