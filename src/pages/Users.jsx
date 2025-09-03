import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { UserDataService, updateUserDataService } from "../services/UserDataService"; // Assuming you'll create updateUserDataService
import Content from "../components/Content";
import { Link } from "react-router-dom";

// Now, let's look at the front-end, built with React. 
// In this code, we have 
// two key functions: !User and !UserContent.

// The main component User
// is responsible 
// for the initial user data fetch
export default function User() { 
  const apiBaseUrl = useContext(ApiContext);
  const [userData, setUserData] = useState(null);
  // and handling !loading and 
  const [loading, setLoading] = useState(true);
  // !error states.
  const [error, setError] = useState(null);

  // It uses the !useEffect hook
  useEffect(() => { //  to call a service 
    const fetchData = async () => {
      try {               // this !UserDataService
        const data = await UserDataService(apiBaseUrl);
        // It retrieves the data from the API.
        // Once the data is successfully fetched,
        // it is stored in the 
        // UserData state variable
        // using !setUserData
        setUserData(data);
        // Then we set !loading to !false
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        window.location.href = "/login";
      }
    };

    fetchData();
  }, [apiBaseUrl]);

  return (
    // The User component then 
    // renders the !Content component
    <Content
      pageName={"User Data"}
      loading={loading}
      error={error}
      // Inside that, it renders the
      // !UserContent component.
      // This is where the crucial part happens
      // We pass down the !userData and !setUserData variables
      // as !props
      // from this (User Component)
      // to the child UserContent component.
      htmlContent={<UserContent userData={userData} setUserData={setUserData} />}
    />
  );
}



// So, UserContent doesn't fetch the data itself; 
// it receives it directly from its parent.
function UserContent({ userData, setUserData }) { 
  // it receives userData and also
  // !setUserData as a prop
  // to update the parent's state
  const apiBaseUrl = useContext(ApiContext);
  // We are using here the !useState hook
  // !isEditing: which is a boolean flag 
  // that controls which view the user sees
  // either the static data or the editable form fields.
  const [isEditing, setIsEditing] = useState(false);
  // We use also useState
  // !editableUserData: This will be a copy of the user data.
  // We make changes to this copy in the form fields.
  const [editableUserData, setEditableUserData] = useState({});
  // This is an important design choice because 
	// it allows us to cancel any edits and 
	// revert to the original userData without 
	// making any API calls or permanent changes.


  // We use here the !useEffect hook 
  // to synchronize the !editableUserData state with
  // the userData prop of the parent component.
  useEffect(() => {
    if (userData) {
      setEditableUserData(userData);
        // This is a common pattern to ensure 
        // that if the original userData changes 
        // in the parent component, 
        // like after a successful save operation, 
        // the editableUserData state in the 
        // child component is also updated,
        // keeping everything in sync.
    }
    // This is why we add userData 
    // ( hier! ) to the dependency array of the useEffect hook.
  }, [userData]); 

  if (!userData)
    return <div className="text-gray-500">No user data available.</div>;

  // When the user clicks the "Edit" button, 
  // the !handleEditClick function sets
  // isEditing to true, 
  const handleEditClick = () => {
    setIsEditing(true);
    // which reveals the input fields.
  };
  // As the user types, 
  // the !handleChange function updates
  // the !editableUserData state.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // If the user clicks "Save", 
  // the !handleSaveClick function
  // calls the !updateUserDataService. 
  const handleSaveClick = async () => {
    try {
      const updatedData = await updateUserDataService(apiBaseUrl, editableUserData);
      // This service sends a PATCH request
      // with the !editableUserData
      // to the API.

      // If the API call is successful, 
      // we receive the updated data back and use 
      // !setUserData to update 
      // the parent component's state       
      setUserData(updatedData);
      // we set than !isEditing back to !false
      // which hides the fields and shows the new data.
      setIsEditing(false);
      
    } catch (error) {
      // !Errors are handled here, if occur.
      console.error("Error saving user data:", error);
    }
  };


  // If the user clicks "Cancel", 
  // the !handleCancelClick function simply 
  // reverts !editableUserData back
  // to the original !userData
  const handleCancelClick = () => {
    setEditableUserData(userData);
    // and sets !isEditing to !false, 
    // discarding all changes.
    setIsEditing(false);
  };

  

  return (
    <div className="bg-transparent mt-20 p-8 pb-14 backdrop-blur-lg rounded-2xl animate-slideInUp">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

        <div className="card-data">
          <h3 className="text-2xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end mb-4">
            Personal Information
          </h3>


          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Username:</strong>
            {/* The conditional rendering 
                is managed by the 
                !isEditing state.  */}
            
            {/* We use a ternary operator 
            to dynamically render either  
              */}
            {isEditing ? (
              // an !<input> field for editing.
              <input
                type="text"
                name="username"
                value={editableUserData.username || ''}
                onChange={handleChange}
                className="col-span-2  text-left bg-gray-700 text-white px-1 rounded"
              />
            ) : (
              // or a simple !<span> to display the data
              <span className="col-span-2  text-left">{userData.username}</span>
            )}
          </div>

            {/* This solution 
                gives us a user-friendly page 
                that uses a single component 
                to handle both 
                the viewing and editing 
                of user data seamlessly, 
                and all in one place. 
                
                I hope this explanation was clear and helpful.
                
            */}





          {/* Name */}
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
          {/* Surname */}
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
          {/* Email */}
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
          {/* Phone Number */}
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
          {/* Status */}
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Status:</strong>
            <span className={`col-span-2 text-left ${userData.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {userData.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          {/* Type of Entity */}
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
          {/* VAT ID */}
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
          {/* Bank Account */}
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
          {/* Password */}
          <div className="data-field">
            <strong className="col-span-1 text-left sm:text-right">Password:</strong>
            {isEditing ? (
              <span className="col-span-2  text-left px-1">xxxxxx</span>
            ) : (
              <Link to="/change_password" className="text-custom-purple-start hover:underline 
                  dark:text-custom-purple-start"> Change password
              </Link>
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


