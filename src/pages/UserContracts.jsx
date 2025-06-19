import React, { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Content from "../components/Content";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUserContracts } from '../hooks/useUserContracts'; // Import custom hook



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
  const { id } = useParams();
    
  // All the state management logic is handled by the custom hook useUserContracts
  const { contracts, loading, error } = useUserContracts(id); // custom hook

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