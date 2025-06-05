import React, { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useParams } from "react-router-dom";
import { fetchContractAndUsers } from "../services/ContractService"; // Import the service
import { useAuth } from "../context/useAuth";
import Content from "../components/Content";

export default function ContractPage() {
  const apiBaseUrl = useContext(ApiContext);
  const {user} = useAuth();
  const { id } = useParams(); // ✅ Retrieve contract ID from URL
  const [contract, setContract] = useState(null);
  const [offeror, setOfferor] = useState(null);
  const [offeree, setOfferee] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchContractAndUsers(id, apiBaseUrl); // Call service
        setContract(result.contract);
        setOfferor(result.offeror);
        setOfferee(result.offeree);

      } 
      catch (err) {
        if (err.message.includes("NetworkError")) {
            setError("Check your internet connection.");
        } else {
            setError(err.message);
          }
      } 
      finally {
            setLoading(false); // ✅ Ensures loading state is correctly updated
      }
    };

    getData();
  }, [id]);


  useEffect(() => {
    if (user && offeror && offeree) {
      if (user.id === offeror.id) {
        setUserRole("OFFEROR");
      } else if (user.id === offeree.id) {
        setUserRole("OFFEREE");
      } else {
        setUserRole("VIEWER"); // If user is neither
      }
    }
  }, [user, offeror, offeree]);

  // ✅ RETURN the JSX to ensure React renders it
    return (
      <Content
        pageName="Contract"
        loading={loading} 
        error={error}
        htmlContent={<ContractContent contract={contract} offeror={offeror} offeree={offeree} userRole={userRole} />} 
      />
    );
}


function ContractContent({ contract, offeror, offeree, userRole }) {
  if (!contract) 
      return <div className="text-gray-500">No contract data available.</div>;

  return (
    <div className="">
      <div className="p-1 space-y-1">
        <h2 className="text-4xl font-bold mb-3 text-right">{contract.contract_data.name}</h2>
          <p className="text-right" ><strong>Your role:</strong> <span><strong>{userRole}</strong></span></p>
          <p className="text-right">
            <strong>Status: </strong>
            <span className={contract.contract_data.disabled ? 'text-red-500' : 'text-green-300'}>
              {contract.contract_data.disabled ? 'disabled' : 'enabled'}
            </span>
          </p>
      </div>
      <div className="max-w-3xl mx-auto pt-6 space-y-4">
        <div className="space-y-2">
          <p><strong>Offeror Name:</strong> {offeror.name}</p>
          <p><strong>Offeree Name:</strong> {offeree.name}</p>
          <p>
            <strong>Signed At: </strong>
            <span className={contract.contract_data.signed_at ? 'text-green-300' : 'text-orange-500'}>
              {contract.contract_data.signed_at ? contract.contract_data.signed_at : "Not signed yet"}
            </span>
          </p>
          <p><strong>Payment Method:</strong> {contract.contract_data.payment_method}</p>
          <p><strong>Currency Code:</strong> {contract.contract_data.currency_code}</p>
          <p><strong>Upon Signing:</strong> {contract.contract_data.upon_signing}%</p>
          <p><strong>Upon Completion:</strong> {contract.contract_data.upon_completion}%</p>
          <p><strong>Performance Fee:</strong> {contract.contract_data.performance_fee} </p>
          <p><strong>Travel Expenses:</strong> {contract.contract_data.travel_expenses}</p>
          <p><strong>Accommodation Expenses:</strong> {contract.contract_data.accommodation_expenses}</p>
          <p><strong>Other Expenses:</strong> {contract.contract_data.other_expenses}</p>
          <p><strong>Total Fee:</strong> <span className="text-blue-500">{contract.contract_data.total_fee}</span> </p>
        </div>
        <div className="border-t border-gray-300">
          <p>
            <strong>Event IDs: </strong>
            <span className={contract.contract_event_ids.length > 0 ? 'text-green-300' : 'text-orange-500'}>
              {contract.contract_event_ids.length > 0 ? contract.contract_event_ids.join(", ") : "Not events yet"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
