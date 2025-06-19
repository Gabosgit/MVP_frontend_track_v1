import { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { Link } from "react-router-dom";
import useUserData from "../hooks/useUserData"

export default function profilesDashboard() {
    const apiBaseUrl = useContext(ApiContext);
    const { userData } = useUserData(apiBaseUrl); // Custom hook

    return (
        <div className="flex flex-col justify-between bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 interactive-card">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl title-gradient font-bold">
                        Profiles
                    </h2>
                    <Link to={`/user/${userData?.id}/profiles`} className="text-sm font-semibold text-brand-indigo hover:underline">
                        View All
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-purple flex items-center justify-center text-white font-bold">ED</div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">Event Designer</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Corporate Events</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-purple flex items-center justify-center text-white font-bold">WP</div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">Wedding Planner</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Luxury Weddings</p>
                    </div>
                    <Link to="/profile/create" 
                            className="border-2 border-dashed border-indigo-300 dark:border-gray-600 rounded-xl 
                            flex flex-col items-center justify-center text-center p-4 text-brand-indigo dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer">
                        <div className="text-3xl">➕</div> 
                        <p className="font-semibold">Add New</p>
                    </Link>
                </div>
            </div>
            

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white" id="profileViews">47</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Profile Views</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Inquiries</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">8</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bookings</p>
                </div>
            </div>
        </div>
    )
}