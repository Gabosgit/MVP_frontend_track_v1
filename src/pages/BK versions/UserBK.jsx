import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { getUserData } from "../services/getUserData";
import { PageWrapper } from "../components/PageWrapper";


function UserContent({ userData }) {
  if (!userData) 
    return <div className="text-gray-500">No user data available.</div>;

  return (
    <div className="mt-6 p-6 rounded shadow-md w-full max-w-md">
      <p>
      <strong>Status: </strong>
      <span className={userData.is_active ? 'text-green-300' : 'text-red-500'}>
        {userData.is_active ? 'Active' : 'Inactive'}
      </span>
      </p>

      <p><strong>username:</strong> {userData.username}</p>
      <p><strong>name:</strong> {userData.name}</p>
      <p><strong>surname:</strong> {userData.surname}</p>
      <p><strong>email:</strong> {userData.email_address}</p>
      <p><strong>type of entity:</strong> {userData.type_of_entity}</p>
      <p><strong>phone number:</strong> {userData.phone_number}</p>
      <p><strong>vat_id:</strong> {userData.vat_id}</p>
      <p><strong>bank account:</strong> {userData.bank_account}</p>
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
