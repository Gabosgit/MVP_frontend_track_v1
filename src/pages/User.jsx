import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { UserDataService, updateUserDataService } from "../services/UserDataService"; // Assuming you'll create updateUserDataService
import Content from "../components/Content";


function UserContent({ userData, setUserData }) { // setUserData passed as a prop to update the parent's state
  const apiBaseUrl = useContext(ApiContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUserData, setEditableUserData] = useState({});

  useEffect(() => {
    if (userData) {
      setEditableUserData(userData);
    }
  }, [userData]);

  if (!userData)
    return <div className="text-gray-500">No user data available.</div>;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEditableUserData(userData); // Revert changes
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      // Assuming you have an updateUserDataService in your UserDataService file
      const updatedData = await updateUserDataService(apiBaseUrl, editableUserData);
      setUserData(updatedData); // Update the parent component's state
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="bg-transparent mt-20 p-8 pb-14 backdrop-blur-lg rounded-2xl animate-slideInUp">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Personal Information Column */}
        <div className="card-data">
          <h3 className="text-2xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end mb-4">
            Personal Information
          </h3>

          {/* Each data row now uses grid for alignment */}
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Username:</strong>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={editableUserData.username || ''}
                onChange={handleChange}
                className="col-span-2  text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              <span className="col-span-2  text-left">{userData.username}</span>
            )}
          </div>
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Name:</strong>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editableUserData.name || ''}
                onChange={handleChange}
                className="col-span-2  text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              <span className="col-span-2  text-left">{userData.name}</span>
            )}
          </div>
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Surname:</strong>
            {isEditing ? (
              <input
                type="text"
                name="surname"
                value={editableUserData.surname || ''}
                onChange={handleChange}
                className="col-span-2  text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              <span className="col-span-2  text-left">{userData.surname}</span>
            )}
          </div>
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Email:</strong>
            {isEditing ? (
              <input
                type="email"
                name="email_address"
                value={editableUserData.email_address || ''}
                onChange={handleChange}
                className="col-span-2  text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              <span className="col-span-2  text-left">{userData.email_address}</span>
            )}
          </div>
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Phone Number:</strong>
            {isEditing ? (
              <input
                type="text"
                name="phone_number"
                value={editableUserData.phone_number || ''}
                onChange={handleChange}
                className="col-span-2  text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              <span className="col-span-2  text-left px-1">{userData.phone_number}</span>
            )}
          </div>
        </div>

        {/* Account Details Column */}
        <div className="card-data">
          <h3 className="text-2xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end mb-4">
            Account Details
          </h3>
          {/* Each data row uses grid for alignment */}
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Status:</strong>
            <span className={`col-span-2 text-left ${userData.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {userData.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Type of Entity:</strong>
            {isEditing ? (
              <input
                type="text"
                name="type_of_entity"
                value={editableUserData.type_of_entity || ''}
                onChange={handleChange}
                className="col-span-2  text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              <span className="col-span-2  text-left px-1">{userData.type_of_entity}</span>
            )}
          </div>
          
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">VAT ID:</strong>
            {isEditing ? (
              <input
                type="text"
                name="vat_id"
                value={editableUserData.vat_id || ''}
                onChange={handleChange}
                className="col-span-2  text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              <span className="col-span-2  text-left px-1">{userData.vat_id}</span>
            )}
          </div>
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Bank Account:</strong>
            {isEditing ? (
              <input
                type="text"
                name="bank_account"
                value={editableUserData.bank_account || ''}
                onChange={handleChange}
                className="col-span-2 text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              <span className="col-span-2 text-left px-1">{userData.bank_account}</span>
            )}
          </div>

          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Password:</strong>
            {isEditing ? (
              <span className="col-span-2  text-left px-1">xxxxxx</span>
            ) : (
              <button 
                className="col-span-2 text-red-500 text-left bg-gray-700 px-2 rounded">
                Change password
              </button>
              
            )}
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-center w-full mt-5 space-x-4">
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="inline-flex justify-center py-2.5 px-6 text-sm font-medium rounded-md btn-primary"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSaveClick}
              className="inline-flex justify-center py-2.5 px-6 text-sm font-medium rounded-md btn-primary bg-green-600 hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="inline-flex justify-center py-2.5 px-6 text-sm font-medium rounded-md btn-primary bg-red-600 hover:bg-red-700"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function User() {
  const apiBaseUrl = useContext(ApiContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UserDataService(apiBaseUrl);
        setUserData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        window.location.href = "/login";
      }
    };

    fetchData();
  }, [apiBaseUrl]); // Add apiBaseUrl to dependency array

  return (
    <Content
      pageName={"User Data"}
      loading={loading}
      error={error}
      htmlContent={<UserContent userData={userData} setUserData={setUserData} />} // Pass setUserData
    />
  );
}