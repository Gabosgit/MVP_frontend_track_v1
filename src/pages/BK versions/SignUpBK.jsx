import { useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import axios from "axios";
import { PageWrapper } from "../components/PageWrapper";

export default function SignUp() {
  const apiBaseUrl = useContext(ApiContext);
  
  const [form, setForm] = useState({
    username: "",
    type_of_entity: "",
    password: "",
    name: "",
    surname: "",
    email_address: "",
    phone_number: "",
    vat_id: "",
    bank_account: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Adjust the API endpoint as needed.
      const response = await axios.post(`${apiBaseUrl}/user`, form, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Sign up response:", response.data);
      alert("Sign up successful!");
      // Optionally, redirect the user after successful sign-up.
      window.location.href = `/login`; // Redirect to login
    } catch (error) {
      console.error("Sign up failed:", error.response ? error.response.data : error.message);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <PageWrapper
      htmlContent={<SignUpContent 
        handleSubmit={handleSubmit} 
        form={form}
        handleChange={handleChange}
        />} 
    />
    )
}

function SignUpContent({handleSubmit, form, handleChange}) {
  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">

      {/* Username */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="username" className="block text-gray-700 w-full lg:w-1/3">
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      {/* Type of Entity */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="type_of_entity" className="block text-gray-700 w-full lg:w-1/3">
          Type of Entity
        </label>
        <input
          id="type_of_entity"
          type="text"
          name="type_of_entity"
          value={form.type_of_entity}
          onChange={handleChange}
          placeholder="Enter type of entity"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="password" className="block text-gray-700 w-full lg:w-1/3">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      {/* Name */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="name" className="block text-gray-700 w-full lg:w-1/3">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      {/* Surname */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="surname" className="block text-gray-700 w-full lg:w-1/3">
          Surname
        </label>
        <input
          id="surname"
          type="text"
          name="surname"
          value={form.surname}
          onChange={handleChange}
          placeholder="Enter your surname"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      {/* Email Address */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="email_address" className="block text-gray-700 w-full lg:w-1/3">
          Email Address
        </label>
        <input
          id="email_address"
          type="email"
          name="email_address"
          value={form.email_address}
          onChange={handleChange}
          placeholder="user@example.com"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      {/* Phone Number */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="phone_number" className="block text-gray-700 w-full lg:w-1/3">
          Phone Number
        </label>
        <input
          id="phone_number"
          type="text"
          name="phone_number"
          value={form.phone_number}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      {/* VAT ID */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="vat_id" className="block text-gray-700 w-full lg:w-1/3">
          VAT ID
        </label>
        <input
          id="vat_id"
          type="text"
          name="vat_id"
          value={form.vat_id}
          onChange={handleChange}
          placeholder="Enter your VAT ID"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      {/* Bank Account */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <label htmlFor="bank_account" className="block text-gray-700 w-full lg:w-1/3">
          Bank Account
        </label>
        <input
          id="bank_account"
          type="text"
          name="bank_account"
          value={form.bank_account}
          onChange={handleChange}
          placeholder="Enter your bank account"
          className="w-full p-2 border border-gray-300 rounded lg:w-2/3"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 mt-6 rounded hover:bg-blue-600"
      >
        Sign Up
      </button>
      </form>
    </>
  )

}
