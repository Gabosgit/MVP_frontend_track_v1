import { useState } from 'react';

const PasswordField = ({ label, placeholder, value, onChange, name, id, autoComplete }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <div className="relative">
                <input
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    type={showPassword ? "text" : "password"}
                    name={name}
                    id={id}
                    autoComplete={autoComplete} // Pass autoComplete prop
                    className="bg-gray-50 appearance-none block w-full px-3 py-3 border border-gray-300 text-gray-900
                            focus:outline-none focus:ring-custom-purple-start focus:border-custom-purple-start focus:z-10 sm:text-sm
                            dark:border-dark-input-border placeholder-gray-500 dark:placeholder-gray-400  dark:text-dark-text
                            dark:bg-dark-input-bg  dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors rounded-lg pr-10"
                    required
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 inset-y-0 pr-3 flex items-center cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.418 0-8-2.686-8-6s3.582-6 8-6a9.957 9.957 0 014.28.932M17.5 12c0 1.258-.291 2.456-.811 3.524M12 16.5C8.962 16.5 6.5 14.038 6.5 11s2.462-5.5 5.5-5.5 5.5 2.462 5.5 5.5c0 .093-.013.185-.038.276m-4.502 2.651a3.5 3.5 0 11-4.95-4.95 3.5 3.5 0 014.95 4.95z" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordField;