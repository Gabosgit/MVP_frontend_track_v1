import React, { createContext } from "react";

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    return (
        <ApiContext.Provider value={apiBaseUrl}>
            {children}
        </ApiContext.Provider>
    );
};
