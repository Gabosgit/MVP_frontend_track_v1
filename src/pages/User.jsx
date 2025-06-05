import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { getUserData } from "../services/getUserData";
import { PageWrapper } from "../components/PageWrapper";


function UserContent({ userData }) {
  if (!userData) 
    return <div className="text-gray-500">No user data available.</div>;

  return (
<div className="bg-transparent -top-40 p-8 pb-20 dark:bg-dark-card backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/60 dark:border-dark-nav-border animate-slideInUp">
      {/* Single Edit Profile Button at the top right */}
      <div className="flex justify-end w-full mb-8">
          <a href="#" className="inline-flex justify-center py-2.5 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-custom-purple-start to-custom-purple-end hover:from-custom-purple-end hover:to-custom-purple-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-purple-start dark:focus:ring-offset-dark-card transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-custom-purple-start/40 hover:-translate-y-0.5">
              Edit
          </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-gray-700 dark:text-dark-text">
        {/* Personal Information Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end mb-4">
            Personal Information
          </h3>

          {/* Each data row now uses grid for alignment */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">Status:</strong>
            <span className={`col-span-2 text-left ${userData.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {userData.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">Username:</strong>
            <span className="col-span-2 text-left">{userData.username}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">Name:</strong>
            <span className="col-span-2 text-left">{userData.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">Surname:</strong>
            <span className="col-span-2 text-left">{userData.surname}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">Email:</strong>
            <span className="col-span-2 text-left">{userData.email_address}</span>
          </div>
        </div>

        {/* Account Details Column */}
        <div className="space-y-4 md:mt-0 mt-8">
          <h3 className="text-xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end mb-4">
            Account Details
          </h3>

          {/* Each data row now uses grid for alignment */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">Type of Entity:</strong>
            <span className="col-span-2 text-left">{userData.type_of_entity}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">Phone Number:</strong>
            <span className="col-span-2 text-left">{userData.phone_number}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">VAT ID:</strong>
            <span className="col-span-2 text-left">{userData.vat_id}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 items-baseline">
            <strong className="col-span-1 text-left sm:text-right">Bank Account:</strong>
            <span className="col-span-2 text-left">{userData.bank_account}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function User() {
  const apiBaseUrl = useContext(ApiContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserData(apiBaseUrl);
        setUserData(data);
        setLoading(false); // ✅ Stop loading after data is fetched
      } catch (error) {
        setError(error.message); // ✅ Store error state
        setLoading(false); // ✅ Stop loading even on error
        window.location.href = "/login"; // Redirect if unauthorized
      }
    };

    fetchData();
  }, []);

  // ✅ RETURN the JSX to ensure React renders it
  return (
    <PageWrapper 
      pageName={"User Data"}
      loading={loading} 
      error={error}
      htmlContent={<UserContent userData={userData} />} 
    />
  );
}
