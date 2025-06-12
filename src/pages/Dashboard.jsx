import React, { useState, useEffect, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { Link } from "react-router-dom";
import { getUserData } from "../services/getUserData";
import Content from "../components/Content";


export default function Dashboard() {
  const apiBaseUrl = useContext(ApiContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData(apiBaseUrl);
        setUserData(data);
      } catch (error) {
        setError(error.message);
        window.location.href = "/login"; // Redirect if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ RETURN the JSX to ensure React renders it
      return (
          <Content 
              pageName={"Dashboard"}
              loading={loading} 
              error={error}
              htmlContent={
                  <CreateDashboardContent userData={userData} />
              }
          />
      );
};

  
function CreateDashboardContent({userData}) {
  // if (!userData) return <p>Loading user data...</p>; // ✅ Prevent crashes when userData is null

  return(
    <div className="grid grid-cols-1 max-w-screen-xl mt-16">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 interactive-card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl title-gradient font-bold">My Profiles</h2>
                    <a href="#" className="text-sm font-semibold text-brand-indigo hover:underline">View All</a>
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
                    <div className="border-2 border-dashed border-indigo-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-center p-4 text-brand-indigo dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-700/50 cursor-pointer">
                        <i className="fas fa-plus text-3xl mb-2"></i>
                        <p className="font-semibold">Add New</p>
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

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 interactive-card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold title-gradient">Contracts</h2>
                    <a href="#" className="text-sm font-semibold text-brand-indigo hover:underline">View All</a>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-gray-700/50">
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">Summer Gala 2025</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Tech Corp • $12,500</p>
                        </div>
                        <span className="text-xs font-bold py-1 px-3 rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-gray-700/50">
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">Johnson Wedding</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Private Client • $8,750</p>
                        </div>
                        <span className="text-xs font-bold py-1 px-3 rounded-full bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">Pending</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-gray-700/50">
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-white">Product Launch</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">StartupXYZ • $6,200</p>
                        </div>
                        <span className="text-xs font-bold py-1 px-3 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">Draft</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">$42K</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">15</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Contracts</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">92%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                    </div>
                </div>
            </div>
        </div>

        <h2 className="font-bold text-2xl text-center mt-20">QUICK START</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="order-2 md:order-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 text-center flex flex-col items-center justify-center interactive-card">
                <div className="icon-gradient w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl mb-4">
                    👤
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    Create Profile
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Set up a new professional profile to showcase your services.
                </p>
                <ul className="flex flex-col py-10 list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>You can create many profiles to offer different services.</li>
                    <li>Add detailed information about your projects.</li>
                    <li>Select a profile to make contracts with other users.</li>
                </ul>
                <a href="#" className="btn-primary w-full text-center font-semibold  py-2 px-4 rounded-lg hover:opacity-90 transition">
                    Get Started
                </a>
            </div>

            <div className="order-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 text-center flex flex-col items-center justify-center interactive-card">
                <div className="icon-gradient w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-4">
                    📋
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    Create Contract
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Generate professional contracts with our templates.
                </p>
                <ul className="flex flex-col py-10 list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>Ensure you enter the mandatory fields.</li>
                    <li>Add events and milestones to the contract.</li>
                    <li>Once ready, send it to your client for approval.</li>
                </ul>
                <a href="#" className="btn-primary w-full text-center font-semibold  py-2 px-4 rounded-lg hover:opacity-90 transition">
                    New Contract
                </a>
            </div>

        </div>
    </div>
    

  )
}