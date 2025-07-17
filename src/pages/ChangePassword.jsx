import { useEffect, useState, useContext } from "react";
import Content from "../components/Content";
import { ApiContext } from "../context/ApiContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import PasswordField from '../components/PasswordField';

function ChangePasswordContent() {
    const apiBaseUrl = useContext(ApiContext);
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const { logout } = useContext(AuthContext);
    const [form, setForm] = useState({
        old_password: "",
        new_password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh
        console.log(form)
        if (form.new_password === confirmNewPassword) {
            try {
                // Get token from local storage
                const token = localStorage.getItem("token");
                // API endpoint
                const response = await axios.post(`${apiBaseUrl}/change_password`, form, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                console.log("Change Password response:", response.data);
                alert("Password changed successful!");
                logout();
                // Optionally, redirect the user after successful sign-up.
                window.location.href = `/login`; // Redirect to login
            } catch (error) {
                console.error("Password change failed:", error.response ? error.response.data : error.message);
                alert("Password change failed. Please try again.");
            }
        }  else {
            alert("Confirm new password doesn't match your entered new password.")
        } 
    }

    return (
        <div className="mt-24  max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-card backdrop-blur-lg shadow-2xl rounded-2xl p-8 sm:p-10 border border-gray-200/60 dark:border-dark-nav-border animate-slideInUp">
            <form className="space-y-6" onSubmit={handleSubmit} >
                <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
                dark:from-indigo-300 dark:to-purple-400 dark:text-transparent dark:bg-gradient-to-r">
                    Change password
                </h2>
                
                {/* Current Password Field */}
                <PasswordField
                    label="Current Password"
                    placeholder="Enter your current password"
                    value={form.old_password}
                    onChange={handleChange}
                    name="old_password"
                    id="old_password"
                    autoComplete="current-password"
                />

                {/* New Password Field */}
                <PasswordField
                    label="New password"
                    placeholder="Enter your new password"
                    value={form.new_password}
                    onChange={handleChange}
                    name="new_password"
                    id="new_password"
                    autoComplete="new-password" // Important for autocomplete
                />

                {/* Confirm New Password Field */}
                <PasswordField
                    label="Confirm New password"
                    placeholder="Confirm your new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    autoComplete="new-password" // Important for autocomplete
                />

                <div className="flex items-start">
                    <a href="#" className="ms-auto text-sm text-custom-purple-start hover:underline dark:text-custom-purple-start">
                    Lost Password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-purple-start hover:bg-custom-purple-end focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-purple-start"
                >
                    Change Password
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

export default function ChangePassword() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <Content
            pageName={"Change Password"}
            // loading={loading}
            //error={error}
            htmlContent={<ChangePasswordContent />}
        />
    )
}