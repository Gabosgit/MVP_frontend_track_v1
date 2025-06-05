import React, { useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/PageWrapper";

export default function CreateContract() {
  const apiBaseUrl = useContext(ApiContext);
  const navigate = useNavigate();
  const [currencyError, setCurrencyError] = useState(""); // ✅ Initializes error state
  
  const [contractData, setContractData] = useState({
    name: "",
    offeror_id: "",
    offeree_id: "",
    currency_code: "",
    upon_signing: 50,      // ✅ Default to 50%
    upon_completion: 50,   // ✅ Automatically 100% - Signing %
    payment_method: "",
    performance_fee: "",
    travel_expenses: "",
    accommodation_expenses: "",
    other_expenses: "",
    disabled: false,
    disabled_at: "",
    signed_at: "",
    delete_date: "",
  });

  const handleChange = (field, value) => {
    setContractData((prev) => {
      // If modifying "upon_signing", update "upon_completion" automatically
      if (field === "upon_signing") {
        const signingPercentage = Number(value);
        return {
          ...prev,
          upon_signing: signingPercentage,
          upon_completion: 100 - signingPercentage, // Ensures total always stays at 100%
        };
      }
      
      return { ...prev, [field]: value };
    });
  };

  const handleCurrencyChange = (value) => {
    const formattedValue = value ? value.toUpperCase() : ""; // ✅ Avoids errors on empty inputs
  
    setContractData((prev) => ({ ...prev, currency_code: formattedValue }));
  
    const isValidFormat = /^[A-Z]{3}$/.test(formattedValue);
  
    if (!isValidFormat && formattedValue !== "") {
      setCurrencyError("Currency code must be 3 uppercase letters (e.g., USD, EUR, JPY).");
    } else {
      setCurrencyError(""); // ✅ Clears error when valid or empty
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const sanitizedData = Object.fromEntries(
        Object.entries(contractData).filter(([key, value]) => value !== "" && value !== null && value !== undefined)
      );
      const response = await fetch(`${apiBaseUrl}/contract`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Ensure error data exists
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert("Contract created successfully!");
      navigate(`/contract/${data.contract_id}`);
    } catch (error) {
      alert(`Error creating contract: ${error.message}`);
    }
  };

  return (
    <PageWrapper
      pageName="Create Contract"
      htmlContent={
        <CreateContractContent
          contractData={contractData}
          handleChange={handleChange}
          handleCurrencyChange={handleCurrencyChange}
          handleSubmit={handleSubmit}
          currencyError={currencyError} // ✅ Pass currencyError as a prop
          setCurrencyError={setCurrencyError}
        />
      }
    />
  );
}


function CreateContractContent({ contractData, handleChange, handleCurrencyChange, handleSubmit, currencyError, setCurrencyError }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Contract Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium mb-1">
            Contract Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={contractData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>

        {/* Offeree ID */}
        <div>
          <label htmlFor="offeree_id" className="block text-lg font-medium mb-1">
            Offeree ID
          </label>
          <input
            id="offeree_id"
            type="number"
            className="w-full border rounded px-3 py-2"
            value={contractData.offeree_id}
            onChange={(e) => handleChange("offeree_id", e.target.value)}
            required
          />
        </div>

        {/* Currency Code Selector + Manual Input */}
        <div>
            <label htmlFor="currency_code" className="block text-lg font-medium mb-1">Currency Code</label>

            {/* Dropdown for predefined currency codes */}
            <select
                id="currency_code"
                className="w-full border rounded px-3 py-2"
                value={contractData.currency_code}
                onChange={(e) => {
                    handleCurrencyChange(e.target.value);
                    setCurrencyError(""); // ✅ Clear error when selecting a valid option
                  }}
            >
                <option value="">Select a currency</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="BRL">BRL - Brazilian Real</option>
                <option value="RUB">RUB - Russian Ruble</option>
                <option value="MXN">MXN - Mexican Peso</option>
                <option value="SGD">SGD - Singapore Dollar</option>
                <option value="HKD">HKD - Hong Kong Dollar</option>
                <option value="NZD">NZD - New Zealand Dollar</option>
                <option value="KRW">KRW - South Korean Won</option>
                <option value="SEK">SEK - Swedish Krona</option>
                <option value="NOK">NOK - Norwegian Krone</option>
                <option value="DKK">DKK - Danish Krone</option>
                <option value="ZAR">ZAR - South African Rand</option>
                <option value="ARS">ARS - Argentine Peso</option>
                <option value="TRY">TRY - Turkish Lira</option>
                <option value="THB">THB - Thai Baht</option>
                <option value="PLN">PLN - Polish Złoty</option>
                <option value="IDR">IDR - Indonesian Rupiah</option>
                <option value="TWD">TWD - Taiwan Dollar</option>
                <option value="MYR">MYR - Malaysian Ringgit</option>
                <option value="PHP">PHP - Philippine Peso</option>
                <option value="CZK">CZK - Czech Koruna</option>
                <option value="HUF">HUF - Hungarian Forint</option>
                <option value="SAR">SAR - Saudi Riyal</option>
                <option value="AED">AED - United Arab Emirates Dirham</option>
                <option value="CLP">CLP - Chilean Peso</option>
                <option value="COP">COP - Colombian Peso</option>
                <option value="EGP">EGP - Egyptian Pound</option>
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="VND">VND - Vietnamese Dong</option>
            </select>

            {/* Manual Input Field for Custom Currency Code */}
            <input
            type="text"
            placeholder="Or enter custom currency code"
            className="w-full border rounded px-3 py-2 mt-2"
            value={contractData.currency_code}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            required
            />

            {/* Validation Error Message */}
            {currencyError && <p className="text-red-500 mt-2 font-bold">{currencyError}</p>}
        </div>

        
        {/* Payment Method */}
        <div>
          <label htmlFor="payment_method" className="block text-lg font-medium mb-1">
            Payment Method
          </label>
          <select
            id="payment_method"
            className="w-full border rounded px-3 py-2"
            value={contractData.payment_method}
            onChange={(e) => handleChange("payment_method", e.target.value)}
            required
          >
            <option value="">Select a Payment Method</option> {/* Default empty option */}
            <option value="transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="credit_card">Credit Card</option>
            <option value="crypto">Cryptocurrency</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        {/* Performance Fee */}
        <div>
          <label htmlFor="performance_fee" className="block text-lg font-medium mb-1">
            Performance Fee
          </label>
          <input
            id="performance_fee"
            type="number"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={contractData.performance_fee}
            onChange={(e) => handleChange("performance_fee", e.target.value)}
            required
          />
        </div>

        {/* Optional Expenses */}
        {["travel_expenses", "accommodation_expenses", "other_expenses"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-lg font-medium mb-1">
              {field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </label>
            <input
              id={field}
              type="number"
              step="0.01"
              className="w-full border rounded px-3 py-2"
              value={contractData[field] ?? ""}  // Use 'nullish coalescing' to allow undefined/null values
              onChange={(e) => handleChange(field, e.target.value === "" ? null : e.target.value)} // Convert empty string to null
            />
          </div>
        ))}

        {/* Total Fee (Automatically Updated) */}
        <div className="mt-4">
          <label className="block text-lg font-medium mb-1">Total Fee</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-gray-100 text-black"
            value={(
              Number(contractData.performance_fee || 0) +
              Number(contractData.travel_expenses || 0) +
              Number(contractData.accommodation_expenses || 0) +
              Number(contractData.other_expenses || 0)
            ).toFixed(2)}
            readOnly
          />
        </div>


        {/* Payment Percentage */}
        <div>
          {/* Container for inputs */}
          <div className="grid grid-cols-2 gap-4">
            {/* % Upon Signing */}
            <div>
              <label htmlFor="upon_signing" className="block text-lg font-medium mb-1">% Upon Signing</label>
              <input
                id="upon_signing"
                type="number"
                className="w-full border rounded px-3 py-2"
                value={contractData.upon_signing}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 0 && value <= 100) {
                    handleChange("upon_signing", value);
                    handleChange("upon_completion", 100 - value); // Auto-fill completion %
                  }
                }}
                min="0"
                max="100"
                required
              />
            </div>

            {/* % Upon Completion (Auto-Filled) */}
            <div>
              <label htmlFor="upon_completion" className="block text-lg font-medium mb-1">% Upon Completion</label>
              {/* % Upon Completion (Auto-Filled) */}
                <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={contractData.upon_completion}
                disabled // Prevent user changes
                />
            </div>
          </div>

          {/* Full-width Slider */}
          <div className="mt-4">
            <label className="block text-lg font-medium mb-1">Adjust Signing Percentage</label>
            <input
                type="range"
                min="0"
                max="100"
                value={contractData.upon_signing}
                onChange={(e) => handleChange("upon_signing", Number(e.target.value))}
                className="w-full"
            />
          </div>

          {/* Live Validation Error */}
          {contractData.upon_signing + contractData.upon_completion !== 100 && (
            <p className="text-red-500 mt-2 font-bold">Error: Signing + Completion must equal 100%.</p>
          )}
        </div>


        {/* Disabled */}
        <div className="flex items-center">
          <input
            id="disabled"
            type="checkbox"
            checked={contractData.disabled}
            onChange={(e) => handleChange("disabled", e.target.checked)}
          />
          <label htmlFor="disabled" className="ml-2">Disabled</label>
        </div>

        {/* Date Fields */}
        {["disabled_at", "signed_at", "delete_date"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-lg font-medium mb-1">
              {field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </label>
            <input
              id={field}
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              value={contractData[field] ?? ""} // Use 'nullish coalescing' to ensure undefined values don't default to empty strings
              onChange={(e) => handleChange(field, e.target.value || null)} // Convert empty value to null
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create Contract
        </button>
      </form>
    </div>
  );
}
