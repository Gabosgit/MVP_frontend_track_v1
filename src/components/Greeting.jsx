import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Greeting() {
  const { user, setUser } = useContext(AuthContext);

  return (
    <>
      {user && (
        <div className="flex flex-col animate-slideInUp">
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>
            <div>
                <h2 className="text-xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
                dark:from-dark-purple-start dark:to-dark-purple-end">
                    Hello, {user.username}!
                </h2>
                <p>
                    {user.type_of_entity} • Premium User
                </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}