import React, { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Content from "../components/Content";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


function UserContractsContent({ contracts }) {
  if (!contracts) 
    return <div className="text-gray-500">No contracts data available.</div>;

  return (
    <ul className="space-y-4">
      {contracts.map(contract => (
          <li key={contract.id} className="border rounded p-4 shadow-sm">
          <h3 className="text-xl font-bold">{contract.name}</h3>
          <Link to={`/contract/${contract.id}`} className="text-blue-500 hover:underline">
            View Contract
          </Link>
          </li>
      ))}
    </ul>
  )
}

export default function UserContracts() {
  const apiBaseUrl = useContext(ApiContext);
  const { id } = useParams(); // Gets the "id" from the URL (e.g., /contract/1)
  const [contracts, setContracts] = useState([]); // Holds the user contract
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserContracts() {
      try {
        const token = localStorage.getItem("token"); // Retrieve authentication token

        const response = await fetch(`${apiBaseUrl}/user/${id}/contracts`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user contracts.");
        }

        const data = await response.json();
        setContracts(data.user_contracts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserContracts();
  }, []); // Runs once when component mounts

  // ✅ RETURN the JSX to ensure React renders it
    return (
      <Content 
        pageName={"Your Contracts"}
        loading={loading} 
        error={error}
        htmlContent={<UserContractsContent contracts={contracts} />} 
      />
    );
}