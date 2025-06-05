import { createContext } from "react";


export const EnvContext = createContext();


export function EnvProvider({ children }) {
    const backend_url = import.meta.env.VITE_API_BASE_URL

    return (
        <EnvContext.Provider value={{ backend_url }}>
          {children}
        </EnvContext.Provider>
      );
}
