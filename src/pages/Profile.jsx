import React, { useState, useContext, useEffect, useRef } from "react";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import Content from "../components/Content";
import { usePhotosService } from "../services/PhotoService";
import { useParams } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import ShowMoreContainer from "../components/ShowMoreContainer"; // Used for Bio

// helper for generating unique IDs when adding press title/url
let nextOnlinePressId = 0; // Start ID counter outside the component

export default function Profile() {
    const apiBaseUrl = useContext(ApiContext);

    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams(); // Gets the "id" from the URL (e.g., /profile/1)
    const [profileData, setProfileData] = useState(null);
    const [editing, setEditing] = useState(null)

    // PHOTO HOCK
    const { filesToProcess, handleFileChange, handleRemoveFile } = usePhotosService();

    // Fetch Profile Data
    useEffect(() => {
        // 1. Check if the URL has a valid ID
        if (id) {
            async function fetchProfile() {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${apiBaseUrl}/profile/${id}`, {
                headers: { 
                    "Authorization": `Bearer ${token}`
                },
                });

                if (!response.ok) {
                    // When response is not ok (e.g., status 404), try to parse the error message
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch profile");
                }

                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setloading(false);
            }
            }
            // 2. Call the fetch function only if an ID is present
            fetchProfile(profileData);
        } else {
            // 3. If there is no ID, it means the user is on the create page.
            //    You can set the loading state to false immediately.
            setloading(false);
            //    You might also want to set a state to indicate it's a "create" view
            //    e.g., setFormMode('create')
            }
    }, [id]); // The dependency array ensures this effect runs when `id` changes.

    // To have a copy of profileData to manage updates
    const [editableProfileData, setEditableProfileData] = useState({});
    // Set Editable Profile Data
    useEffect(() => {
        if (profileData) {
        setEditableProfileData(profileData);
        }
        else {
            setEditableProfileData({
                name: '',
                performanceType: '',
                description: '',
                bio: '',
                website: '',
                social_media: [],
                stage_plan: '',
                tech_rider: '',
                photos: [],
                videos: [],
                audios: [],
                online_press: [], // Use consistent key name
            });
        }
        console.log(editableProfileData)
        // If the original profileData changes the editableProfileData is also updated, keeping in sync.
    }, [profileData]);

    // SAVE Update handler
    const handleSaveClick = async (editableProfileData) => {
        // A temporary array to hold the new URLs
        let newImageUrls = [];

        // Step 1: Upload new photos if they exist
        if (filesToProcess.length > 0) {
            try {
                const formData = new FormData();
                filesToProcess.forEach(item => {
                    formData.append('files', item.file);
                });

                const response = await fetch(`${apiBaseUrl}/upload-multiple`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to upload new images: ${errorData.detail}`);
                }

                const data = await response.json();
                newImageUrls = data.urls;
            } catch (uploadError) {
                setError(`Error uploading new photos: ${uploadError.message}`);
                return; // Stop the save process
            }
        }

        // Step 2: Combine the existing photos with the new ones
        const combinedPhotos = [
            ...(editableProfileData.photos || []),
            ...newImageUrls
        ];

        // Step 3: Create the payload for the PATCH request
        const payload = {
            ...editableProfileData,
            photos: combinedPhotos,
        };

        // Step 4: Send the PATCH request to the server
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiBaseUrl}/profile/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            const updatedData = await response.json();
            // Here you can update the state with the new data
            setProfileData(updatedData);
            setEditing(false)
            alert("Profile updated successfully!");
        } catch (err) {
            setError(err.message);
            alert("Error updating profile: " + err.message);
        }
    }

    // CANCEL
    const handleCancelClick = () => {
        setEditableProfileData(profileData);
        setEditing(false);
    };

    // ✅ RETURN
    return (
        <Content 
            pageName={"Profile"}
            loading={loading}
            setloading={setloading}
            error={error}
            editing={editing} // Pass the 'editing' state down to the Content component as a prop
            setEditing={setEditing} // Pass the setter function down as a prop
            handleSaveClick={handleSaveClick}
            handleCancelClick={handleCancelClick}
            editableProfileData={editableProfileData}
            htmlContent={
                <CreateProfileContent
                    profileData={profileData}
                    apiBaseUrl={apiBaseUrl}
                    editing={editing}
                    setEditing={setEditing}
                    loading={loading}
                    setError={setError}
                    setloading={setloading}
                    editableProfileData={editableProfileData}
                    setEditableProfileData={setEditableProfileData}
                    filesToProcess={filesToProcess}
                    handleFileChange={handleFileChange}
                    handleRemoveFile={handleRemoveFile}
                />
            }
        />
    );
}

// CONTENT TO RENDER CRUD PAGE ----------------------------
function CreateProfileContent({
    profileData, 
    apiBaseUrl, 
    editing, 
    loading, 
    setloading, 
    setError, 
    editableProfileData, 
    setEditableProfileData,
    filesToProcess,
    handleFileChange,
    handleRemoveFile
}) {
    // Define navigate
    const navigate = useNavigate();
    // State variables for single fields:
    const [formSingle, setFormSingle] = useState({
        name: "",
        performanceType: "",
        description: "",
        bio: "",
        stagePlan: "",
        techRider: "",
        website: ""
    })
    // State variables for array fields:
    const [socialMedia, setSocialMedia] = useState([""]);
    const [photos, setPhotos] = useState([""]);
    const [videos, setVideos] = useState([""]);
    const [audios, setAudios] = useState([""]);
    // Array of objects with default item
    const [onlinePress, setOnlinePress] = useState([{ id: nextOnlinePressId++, title: '', url: '' }]); 

    // PHOTOS consts
    const [imageError, setImageError ] = useState(null)
    // The list of photo previews for rendering
    const [photoPreviews, setPhotoPreviews] = useState([]);

    const [textareaHeight, setTextareaHeight] = useState('auto');
    const [textareaWidth, setTextareaWidth] = useState('auto');
    const dummyRef = useRef(null);

    const [profileNameHeight, setProfileNameHeight] = useState('auto');
    const profileNameRef = useRef(null);

    // Function to convert a standard YouTube URL to an embed URL
    const getYouTubeEmbedUrl = (url) => {
        // Regular expression to find the video ID
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
        const match = url.match(regExp);
        
        // Check if the video ID was found
        if (match && match[1]) {
            const videoId = match[1];
            // Create the base embed URL
            let embedUrl = `https://www.youtube.com/embed/${videoId}`;
            
            // Extract and add the start time if present
            const timeMatch = url.match(/[?&]t=(\d+s)/);
            if (timeMatch && timeMatch[1]) {
                // Remove the 's' for the parameter
                const startTime = timeMatch[1].replace('s', ''); 
                embedUrl += `?start=${startTime}`;
            }
            
            return embedUrl;
        }
        return null;
    };

    // --- UPDATE Profile Data ---
    // Updates data for a specific field within editableProfileData
    const handleChangeSingle = (e) => {
        const { name, value } = e.target;
        setEditableProfileData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handles changes for array-based data (like videos or photos)
    const handleArrayChange = (index, value, fieldName) => {
        setEditableProfileData(prev => {
            // Ensure the property exists and is an array, otherwise default to an empty array
            const currentArray = prev[fieldName] || [];
            
            // Create a copy of the current array to modify it
            const updatedArray = [...currentArray];
            
            // Update the value at the specific index
            updatedArray[index] = value;
            
            // Return the new state object with the updated array
            return {
                ...prev,
                [fieldName]: updatedArray,
            };
        });
    };

    // Adds Online Press
    const handleAddOnlinePress = () => {
    setEditableProfileData(prev => ({
        ...prev,
        online_press: [...(prev.online_press || []), { title: '', url: '' }]
    }));
};

    // Updates Online Press
    const handleOnlinePressChange = (index, field, value) => {
        setEditableProfileData(prev => {
            const newArray = [...(prev.online_press || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, online_press: newArray };
        });
    };

    // Removes Online Press
    const handleRemoveOnlinePress = (index) => {
        setEditableProfileData(prev => ({
            ...prev,
            online_press: prev.online_press.filter((_, i) => i !== index)
        }));
    };

    // Adds a new field to an array within editableProfileData
    const addArrayField = (fieldName) => {
        setEditableProfileData(prev => {
            // Get the current array for the specified field, or default to an empty array
            const currentArray = prev[fieldName] || [];
            
            return {
                ...prev,
                [fieldName]: [...currentArray, ""],
            };
        });
    };


    // Deletes an element from an array within editableProfileData
    const handleDeleteArrayField = (index, fieldName) => {
        setEditableProfileData(prev => {
            const updatedArray = prev[fieldName].filter((_, i) => i !== index);
            return {
                ...prev,
                [fieldName]: updatedArray,
            };
        });
    };

    // PHOTO POPOVER SETTING
    const [open, setOpen] = useState(false)

    // Textarea height and width match paragraph sizes on show mode. 
    useEffect(() => {
        if (dummyRef.current) {
        // Set the textarea height to match the dummy p tag's scrollHeight
        setTextareaHeight(dummyRef.current.scrollHeight + 2 + 'px');
        setTextareaWidth(dummyRef.current.scrollWidth + 2 + 'px');
        }
        if (profileNameRef.current) {
        // Set the textarea height to match the dummy p tag's scrollHeight
        setProfileNameHeight(profileNameRef.current.scrollHeight - 3 + 'px');
        }
    }, [profileData]); // Re-calculate when text changes

    // SUBMIT handler. Sends a POST request to the API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        setError(null);

        let finalImageUrls = []; // This will hold all Cloudinary URLs for the 'photos' field

        // Step 1: Upload Images to Cloudinary via FastAPI /upload-multiple endpoint
        if (filesToProcess.length > 0) { // filesToUpload now directly contains File objects
            try {
                const formData = new FormData();
                // Append each file under the same key 'files'.
                // The backend (FastAPI) expects multiple files under a single form field name.
                // USE THE HOOK'S STATE: filesToProcess
                filesToProcess.forEach((item) => {
                    formData.append('files', item.file); // Make sure to append the actual `File` object
                });

                console.log("Sending multiple files to backend...");
                // Make a single POST request to the new /upload-multiple endpoint
                const response = await fetch(`${apiBaseUrl}/upload-multiple`, {
                    method: 'POST',
                    body: formData, // FormData automatically sets the correct Content-Type header
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to upload images: ${errorData.detail || response.statusText}`);
                }

                const data = await response.json();
                // The backend now returns an array of URLs in a 'urls' property
                finalImageUrls = data.urls; // Assuming backend returns { urls: [...] }

            } catch (uploadError) {
                console.error('Error during image uploads:', uploadError);
                setError(`Failed to upload images: ${uploadError.message}`);
                setloading(false);
                return; // Stop execution if image upload fails
            }
        }

        // Create the payload to match the API's expected dictionary:
        const payload = {
            name: editableProfileData.name || null,
            performance_type: editableProfileData.performance_type || null, // Corrected key name
            description: editableProfileData.description || null,
            bio: editableProfileData.bio || null,
            website: editableProfileData.website || null,
            // Use the centralized state
            social_media: (editableProfileData.social_media || []).filter((url) => url.trim() !== ""),
            stage_plan: editableProfileData.stage_plan || null,
            tech_rider: editableProfileData.tech_rider || null,
            photos: finalImageUrls,
            videos: (editableProfileData.videos || []).filter((url) => url.trim() !== ""),
            audios: (editableProfileData.audios || []).filter((url) => url.trim() !== ""),
            online_press: (editableProfileData.online_press || []).filter(item => item.title && item.url)
                                    .map(item => ({ title: item.title, url: item.url })),
        };

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${apiBaseUrl}/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.profile_id) {
                console.log("Profile created successfully:", data);
                alert("Profile created successfully!");
                navigate(`/profile/${data.profile_id}`);
            } else {
                throw new Error("Missing profile ID in API response.");
            }

        } catch (error) {
            console.error("Error creating profile:", error);
            alert(`Error creating profile: ${error.message}`);
        } finally {
            // Ensure loading state is reset in finally block
            setloading(false);
        }
    };
    
    // Determine the current UI state based on `profile` and `editing`
    let profileInfoProfile;
    let onlinePresenceProfile;
    let photosProfile;
    let videosProfile;
    let audiosProfile;
    let bioProfile;
    let pressProfile;
    let technicProfile;

    // CREATE
    // Condition 1: If no profile exists, show the create form
    if (!profileData) {
        profileInfoProfile = (
            <>
                {/* Profile Name */}
                <div className="flex">
                    <textarea
                        placeholder="⊕ Profile Name"
                        id="name"
                        name="name"
                        //type="text"
                        rows="1"
                        value={editableProfileData.name || ''}
                        onChange={handleChangeSingle}
                        required
                        className="
                        w-full text-center text-4xl sm:text-5xl font-extrabold text-gray-500 m-0 
                        border border-3 border-dashed outline-none border-custom-purple-start rounded overflow-hidden box-border leading-none
                        bg-transparent focus:border-indigo-500 transition-colors"
                    />
                </div>
                {/* Performance Type */}
                <div className="flex">
                    <input
                        placeholder="⊕ Performance Type"
                        id="performanceType"
                        name="performance_type"
                        type="text"
                        value={editableProfileData.performance_type || ''}
                        onChange={handleChangeSingle}
                        required
                        className="
                        w-full text-center text-xl sm:text-2xl font-medium text-indigo-500 leading-none
                        border border-3 border-dashed outline-none border-custom-purple-start rounded 
                        p-0 m-0 bg-transparent"
                    />
                </div>
                {/* Description */}
                <div className="flex">
                    <textarea
                    placeholder="⊕ Description: Enter a short project's description ..."
                        id="description"
                        name="description"
                        rows="3"
                        value={editableProfileData.description || ''}
                        onChange={handleChangeSingle}
                        required
                        className="
                        w-full text-gray-500 text-justify px-1 py-0 text-lg sm:text-xl leading-none
                        border border-3 border-dashed outline-none border-custom-purple-start rounded 
                        bg-transparent overflow-hidden"
                    />
                </div>
            </>
        );
        onlinePresenceProfile = (
            <>
                {/* Social Media (optional) */}
                <div>
                    <label className="block text-lg font-medium mb-1">Social Media URLs</label>
                    {socialMedia.map((media, index) => {
                        // Get the titles that have already been selected, excluding the current item
                        const selectedTitles = socialMedia
                        .filter((_, i) => i !== index)
                        .map(item => item.title);
                        
                        // Create the full list of unique options
                        const allUniqueOptions = ['website', 'instagram', 'facebook', 'youtube', 'spotify', 'soundcloud'];
                        
                        // Filter the unique options
                        const availableUniqueOptions = allUniqueOptions.filter(option => 
                        !selectedTitles.includes(option)
                        );
                        
                        // Always include 'other' and the currently selected unique option
                        const availableOptions = [...availableUniqueOptions];
                        if (media.title && !availableUniqueOptions.includes(media.title) && media.title !== 'other') {
                        availableOptions.unshift(media.title);
                        }
                        availableOptions.push('other');
                        
                        return (
                        <div key={index} className="flex mb-2 space-x-2 items-center">
                            <select
                            value={media.title || ''}
                            onChange={(e) => {
                                const newSocialMedia = [...socialMedia];
                                newSocialMedia[index] = { ...newSocialMedia[index], title: e.target.value, customTitle: '' };
                                setSocialMedia(newSocialMedia);
                            }}
                            className="border rounded px-3 py-2 flex-shrink-0"
                            >
                            <option value="" disabled>Select a title</option>
                            {availableOptions.map(option => (
                                <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                            ))}
                            </select>
                            
                            {media.title === 'other' ? (
                            <>
                                <input
                                type="text"
                                placeholder="Enter a custom title"
                                value={media.customTitle || ''}
                                onChange={(e) => {
                                    const newSocialMedia = [...socialMedia];
                                    newSocialMedia[index] = { ...newSocialMedia[index], customTitle: e.target.value };
                                    setSocialMedia(newSocialMedia);
                                }}
                                className="w-1/2 border rounded px-3 py-2"
                                />
                                <input
                                type="url"
                                placeholder="https://example.com"
                                value={media.url || ''}
                                onChange={(e) => {
                                    const newSocialMedia = [...socialMedia];
                                    // newSocialMedia[index] = { ...newSocialMedia[index], url: e.target.value };
                                    // setSocialMedia(newSocialMedia);
                                }}
                                className="w-1/2 border rounded px-3 py-2"
                                />
                            </>
                            ) : (
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={media.url || ''}
                                onChange={(e) => {
                                const newSocialMedia = [...socialMedia];
                                newSocialMedia[index] = { ...newSocialMedia[index], url: e.target.value };
                                setSocialMedia(newSocialMedia);
                                }}
                                className="w-full border rounded px-3 py-2"
                            />
                            )}
                        </div>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => setSocialMedia([...socialMedia, { title: '', url: '', customTitle: '' }])}
                        className="text-blue-500 hover:underline"
                    >
                        Add another social media link
                    </button>
                </div>
                
                {/* Website (optional) */}
                <div>
                    <label htmlFor="website" className="block text-lg font-medium mb-1">
                        Website (optional)
                    </label>
                    <input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://example.com"
                        className="w-full border rounded px-3 py-2"
                        value={formSingle.website}
                        onChange={handleChangeSingle}
                    />
                </div>
            </>
        )
        photosProfile = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 z-1">
                <p className="text-gray-500 text-center col-span-full pb-5">- Add photos -</p>
                {/* Render previews from the state returned by the hook */}
                {filesToProcess.length > 0 && filesToProcess.map(item => (
                    <div key={item.id} className="relative aspect-video overflow-hidden rounded-xl shadow-md">
                        <div className=" rounded-xl overflow-hidden shadow-md">
                            <img
                                src={item.previewUrl}
                                alt={`Preview of ${item.file.name}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            onClick={() => handleRemoveFile(item.id)}
                            className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                {/* Your file input that uses the function from the hook */}
                <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden" // Hides the default browser input
                id="photo-upload-input" // The unique ID to link with the label
                />
                {/* ustom button/label that users will see */}
                <label
                htmlFor="photo-upload-input" // This attribute links the label to the hidden input
                className="text-blue-500 bg-indigo-200 w-full aspect-video rounded-xl overflow-hidden -md 
                flex justify-center items-center text-center transition-transform duration-200 
                ease-in-out hover:-translate-y-1.5" // Your custom styling
                >
                ╋ <br /> Add photos
                </label>
            </div>
        );
        videosProfile = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 z-1">
                <p className="text-gray-500 text-center col-span-full pb-5">- Add videos -</p>
                {/* Map through the videos array to display each input and preview */}
                {editableProfileData.videos.map((url, index) => {
                    const embedUrl = getYouTubeEmbedUrl(url);

                    return (
                        <div key={index} className="flex flex-col gap-2">
                            {/* Video Preview */}
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                {embedUrl ? (
                                    <iframe
                                        src={embedUrl}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        Add a valid Youtube URL
                                    </div>
                                )}
                            </div>
                            {/* Input Field with Delete Button */}
                            <div className="relative">
                                {/* Add url input field */}
                                <input
                                    type="url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={url}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'videos')}
                                    className="w-full bg-orange-400 border rounded px-3 py-2"
                                />
                                {/* Delete Video */}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteArrayField(index, 'videos')}
                                    className="absolute right-0 top-0 mt-2.5 mr-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    );
                })}
                {/* Add input fiel button */}
                <button
                    type="button"
                    onClick={() => addArrayField('videos')}
                    className="text-blue-500 bg-indigo-200 w-full aspect-video rounded-xl overflow-hidden -md 
                flex justify-center items-center transition-transform duration-200 
                ease-in-out hover:-translate-y-1.5"
                >
                    ╋ <br /> Add video
                </button>
            </div>
        )
        audiosProfile = (
            <div className="z-1">
                <p className="text-gray-500 text-center col-span-full pb-5">- Add audios -</p>
                {audios.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'audios')}
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField('audios')}
                    className="text-blue-500 hover:underline"
                >
                    Add another audio
                </button>
            </div>
        )
        bioProfile = (
            <div>
                <label htmlFor="bio" className="block text-lg font-medium mb-1">
                    Bio
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    value={editableProfileData.bio || ''}
                    onChange={handleChangeSingle}
                    required
                />
            </div>
        )
        pressProfile = (
            <div>
                <label>Online Press (Title & URL):</label>
                {/* Map over the correct state property */}
                {(editableProfileData.online_press || []).map((item, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={item.title || ''}
                            // Pass correct index and field name
                            onChange={(e) => handleOnlinePressChange(index, 'title', e.target.value)}
                        />
                        <input
                            type="url"
                            placeholder="https://..."
                            value={item.url || ''}
                            onChange={(e) => handleOnlinePressChange(index, 'url', e.target.value)}
                        />
                        <button type="button" onClick={() => handleRemoveOnlinePress(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddOnlinePress}>+ Add Online Press Item</button>
            </div>
        );
        technicProfile = (
            <div>
                <div>
                    <label htmlFor="stagePlan" className="block text-lg font-medium mb-1">
                        Stage Plan (optional)
                    </label>
                    <input
                        id="stagePlan"
                        name="stagePlan"
                        type="url"
                        placeholder="https://example.com"
                        className="w-full border rounded px-3 py-2"
                        value={formSingle.stagePlan}
                        onChange={handleChangeSingle}
                    />
                </div>
        
                {/* Tech Rider (optional) */}
                <div>
                    <label htmlFor="techRider" className="block text-lg font-medium mb-1">
                        Tech Rider (optional)
                    </label>
                    <input
                        id="techRider"
                        name="techRider"
                        type="url"
                        placeholder="https://example.com"
                        className="w-full border rounded px-3 py-2"
                        value={formSingle.techRider}
                        onChange={handleChangeSingle}
                    />
                </div>
            </div>
        )
    } 

    // EDIT 
    // Condition 2: If a profile exists AND we are editing, show the update form
    else if (editing) {
        profileInfoProfile = (
            <>
                {/* Prifile Name */}
                <div className="flex">
                    <textarea
                        placeholder="⊕ Profile Name..."
                        id="name"
                        name="name"
                        rows="1"
                        //type="text"
                        // Pre-fill the input with the existing profile data
                        value={editableProfileData.name || ''}
                        onChange={handleChangeSingle}
                        required
                        className="
                        w-full text-center text-4xl sm:text-5xl font-extrabold text-gray-500 m-0 p-0
                        border border-3 border-dashed outline-none border-custom-purple-start rounded overflow-hidden
                        bg-transparent transition-colors box-border leading-none
                        focus:border-solid focus:border-x-amber-500 focus:bg-violet-200
                        hover:bg-purple-300"
                        style={{ height: profileNameHeight, overflow: 'hidden'}}
                    />
                </div>
                {/* Performance Type */}
                <div>
                    <input
                        placeholder="⊕ Performance Type ..."
                        id="performanceType"
                        name="performance_type"
                        type="text"
                        // Pre-fill the input with the existing profile data
                        value={editableProfileData.performance_type || ''}
                        onChange={handleChangeSingle}
                        required
                        className="
                        w-full text-center text-xl sm:text-2xl font-medium text-indigo-500 leading-none
                        border border-3 border-dashed outline-none border-custom-purple-start rounded 
                        focus:border-solid focus:border-x-amber-500 focus:bg-violet-200
                        hover:bg-purple-300
                        p-0 m-0 bg-transparent"
                    />
                </div>
                {/* Description */}
                <div className="flex">
                    <textarea
                        placeholder="⊕ Description ..."
                        id="description"
                        name="description"
                        rows="3"
                        // Pre-fill the input with the existing profile data
                        value={editableProfileData.description || ''}
                        onChange={handleChangeSingle}
                        required
                        className="
                        w-full text-gray-500 text-justify px-1 py-0 text-lg sm:text-xl leading-none
                        border border-3 border-dashed outline-none border-custom-purple-start rounded 
                        focus:border-solid focus:border-x-amber-500 focus:bg-violet-200
                        hover:bg-purple-300 bg-transparent overflow-hidden"
                        style={{ height: textareaHeight, width: textareaWidth, overflow: 'hidden'}} // Use the dynamic height
                    />
                </div>
            </>
        );
        onlinePresenceProfile = (
            <section className="border-slate-300 rounded-3xl mb-8">
                <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 border-gray-200 pb-3">
                    Online Presence
                </h2>
                <div className="flex flex-wrap justify-center items-center mb-4">
                    <a href="https://www.janedoeofficial.com" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-instagram mr-2"></i> Website
                    </a>
                    {/* Dummy Social Media Links */}
                    <a href="https://www.instagram.com/janedoeofficial" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-instagram mr-2"></i> Instagram
                    </a>
                    <a href="https://www.facebook.com/janedoeofficial" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-facebook mr-2"></i> Facebook
                    </a>
                    <a href="https://www.youtube.com/janedoeofficial" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-youtube mr-2"></i> YouTube
                    </a>
                    <a href="https://www.spotify.com/janedoe" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-spotify mr-2"></i> Spotify
                    </a>
                    <a href="https://soundcloud.com/" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-spotify mr-2"></i> Soundcloud
                    </a>
                </div>
            </section>
        )
        photosProfile = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 z-1">
                <p className="text-gray-500 text-center col-span-full">- Add and remove photos -</p>
                {/* **Display Existing Photos from the Database** */}
                {(editableProfileData.photos || []).map((url, index) => (
                    <div key={url} className="relative aspect-video bg-gray-300 overflow-hidden rounded-xl shadow-md">
                        <img
                            src={url}
                            alt={`photo ${index + 1} not available`}
                            className="w-full h-full object-cover"
                        />
                        {/* You might want a button to delete these photos as well */}
                        <button
                            type="button"
                            onClick={() => handleDeleteArrayField(index, 'photos')} // Assuming this function exists
                            className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                        >
                            &times;
                        </button>
                    </div>
                ))}

                {/* **Display Newly Selected Photos from the Local State** */}
                {filesToProcess.length > 0 && filesToProcess.map(item => (
                    <div key={item.id} className="relative aspect-video overflow-hidden rounded-xl shadow-md">
                        <div className="rounded-xl overflow-hidden shadow-md">
                            <img
                                src={item.previewUrl}
                                alt={`Preview of ${item.file.name}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveFile(item.id)}
                            className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                        >
                            &times;
                        </button>
                    </div>
                ))}

                {/* The file input and custom label */}
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload-input"
                />
                <label
                    htmlFor="photo-upload-input"
                    className="btn-primary bg-red w-full aspect-video rounded-xl
                    justify-center items-center text-center overflow-hidden -md flex hover:bg-violet-200
                    transition-transform duration-200 ease-in-out hover:-translate-y-1.5"
                >   
                    <div className="flex flex-col">
                        <div className="text-3xl">&#43;</div> 
                        <p className="font-semibold">Add New</p>
                    </div>
                </label>
            </div>
        );
        videosProfile = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 z-1">
                <p className="text-gray-500 text-center col-span-full">- Add, change or remove video -</p>
                {editableProfileData.videos.map((url, index) => {
                    const embedUrl = getYouTubeEmbedUrl(url);
                    return (
                        <div key={index} className="flex flex-col gap-2 relative">
                            {/* Video Preview */}
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                {embedUrl ? (
                                    <iframe
                                        src={embedUrl}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                                        gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center 
                                    text-gray-500">
                                        Add a valid Youtube URL
                                    </div>
                                )}
                            </div>

                            {/* Input Field with Delete Button */}
                            <div className="flex relative items-center justify-center">
                                {/* Add url input field */}
                                <input
                                    type="url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={url}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'videos')}
                                    required
                                    className="w-full bg-orange-200 border rounded pr-10 pl-3 py-2"
                                />
                                {/* Delete Video */}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteArrayField(index, 'videos')}
                                    className="absolute right-1 text-gray-500 hover:text-red-500 text-2xl font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    );
                })}
                
                {/* The standalone add button */}
                {/* Add input fiel button */}
                <button
                    type="button"
                    onClick={() => addArrayField('videos')}
                    className="btn-primary w-full aspect-video rounded-xl overflow-hidden -md 
                flex justify-center items-center transition-transform duration-200 
                ease-in-out hover:-translate-y-1.5"
                >
                    <div className="flex flex-col">
                        <div className="text-3xl">&#43;</div> 
                        <p className="font-semibold">Add New</p>
                    </div>
                </button>
            </div>
        );
        audiosProfile = (
            <div className="z-1">
                <p className="text-gray-500 text-center col-span-full">- Add, change or remove audios -</p>
                {audios.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'audios')}
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField('audios')}
                    className="dark:text-indigo-500 hover:underline"
                >
                    Add another audio
                </button>
            </div>
        )
        bioProfile = (
            <div>
                <textarea
                    id="bio"
                    name="bio"
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    value={editableProfileData.bio || ''}
                    onChange={handleChangeSingle}
                    required
                />
            </div>
        )
        pressProfile = (
            <div>
                {onlinePress.map((item) => ( // <-- Map now just takes 'item'
                <div key={item.id} 
                    style={{ border: '1px dashed #eee', padding: '10px', marginBottom: '10px' }}
                > {/* <-- Use item.id as key */}
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={item.title} 
                        onChange={(e) => handleOnlinePressChange(
                            onlinePress.indexOf(item), 'title', e.target.value
                        )}
                        style={{ display: 'block', marginBottom: '5px', width: '100%' }} 
                    />
                    <input 
                        type="url" 
                        placeholder="https://..." 
                        value={item.url} 
                        onChange={(e) => handleOnlinePressChange(
                            onlinePress.indexOf(item), 'url', e.target.value
                        )} 
                        style={{ display: 'block', marginBottom: '5px', width: '100%' }} 
                    />
                    <button 
                        type="button" 
                        onClick={() => handleRemoveOnlinePress(item.id)}
                        className="dark:text-indigo-500"
                    >
                        Remove
                    </button> {/* <-- Pass item.id */}
                </div>
                ))}
                <button 
                    type="button" 
                    onClick={handleAddOnlinePress}
                    className="dark:text-indigo-500"
                >
                     + Add Online Press Item
                </button>
            </div>
        )
        technicProfile = (
            <div>
                <div>
                    <label htmlFor="stagePlan" className="block text-lg font-medium mb-1">
                        Stage Plan (optional)
                    </label>
                    <input
                        id="stagePlan"
                        name="stagePlan"
                        type="url"
                        placeholder="https://example.com"
                        className="w-full border rounded px-3 py-2"
                        value={editableProfileData.stagePlan}
                        onChange={handleChangeSingle}
                    />
                </div>
        
                {/* Tech Rider (optional) */}
                <div>
                    <label htmlFor="techRider" className="block text-lg font-medium mb-1">
                        Tech Rider (optional)
                    </label>
                    <input
                        id="techRider"
                        name="techRider"
                        type="url"
                        placeholder="https://example.com"
                        className="w-full border rounded px-3 py-2"
                        value={editableProfileData.techRider}
                        onChange={handleChangeSingle}
                    />
                </div>
            </div>
        )
    }

    // SHOW 
    // Condition 3: If a profile exists AND we are NOT editing, show the static data
    else {
        profileInfoProfile = (
            <>
                {/* Prifile Name */}
                <div className="flex">
                    <h1 className="
                        w-full text-center text-4xl sm:text-5xl font-extrabold text-gray-900 
                        p-0 m-0 border border-transparent rounded leading-none"
                        ref={profileNameRef}
                    >
                        {profileData.name}
                    </h1>
                </div>
                {/* Performance Type */}
                <div className="flex">
                    <p className="w-full text-center text-xl sm:text-2xl font-medium text-indigo-700 
                    p-0 border border-transparent leading-none">
                        {profileData.performance_type}
                    </p>
                </div>
                {/* Description */}
                <div className="flex">
                    <p className="w-full text-gray-700 text-justify leading-none
                    px-1 py-0 border border-transparent rounded text-lg sm:text-xl" 
                    ref={dummyRef}
                    >
                        {profileData.description}
                    </p>
                </div>
            </>
        );
        onlinePresenceProfile = (
            <section className="-2 border-slate-300 rounded-3xl mb-8">
                <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                    Online Presence
                </h2>
                <div className="flex flex-wrap justify-center items-center mb-4">
                    <a href="https://www.janedoeofficial.com" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-instagram mr-2"></i> Website
                    </a>
                    {/* Dummy Social Media Links */}
                    <a href="https://www.instagram.com/janedoeofficial" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-instagram mr-2"></i> Instagram
                    </a>
                    <a href="https://www.facebook.com/janedoeofficial" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-facebook mr-2"></i> Facebook
                    </a>
                    <a href="https://www.youtube.com/janedoeofficial" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-youtube mr-2"></i> YouTube
                    </a>
                    <a href="https://www.spotify.com/janedoe" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-spotify mr-2"></i> Spotify
                    </a>
                    <a href="https://soundcloud.com/" target="_blank" className="inline-flex items-center font-medium text-indigo-700 no-underline transition-colors duration-200 ease-in-out mr-4 mb-2 hover:text-indigo-500 hover:underline">
                        <i className="fab fa-spotify mr-2"></i> Soundcloud
                    </a>
                </div>
            </section>
        )
        photosProfile = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 z-1">
                {/* Placeholder Photos */}
                {/* Use a conditional check to ensure profileData.photos exists and is an array */}
                {profileData.photos && profileData.photos.length > 0 ? (
                    <>
                        <p className="text-gray-500 text-center col-span-full">
                            - Some pictures describing the project -
                        </p>
                        {profileData.photos.map((photoUrl, index) => (
                            <div
                                key={index} // Use a unique key for each item in the list
                                className="aspect-video rounded-xl overflow-hidden shadow-md bg-gray-200
                                transition-transform duration-200 ease-in-out hover:-translate-y-1.5"
                            >
                                <img
                                    src={photoUrl} // The URL for the current photo in the iteration
                                    alt={`Photo ${index + 1} not available`} // Dynamic alt text
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    // Display a message and a placeholder if no photos are available
                    <>
                        <p className="text-gray-500 text-center col-span-full">- No photos available yet. -</p>
                        <div
                            className="bg-slate-400 w-full aspect-video rounded-xl overflow-hidden -md 
                            flex justify-center items-center"
                        >
                            No photos available yet
                        </div>
                    </>
                )}
            </div>
        )
        videosProfile = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 z-1">
                {/* Map through the videos array to display each input and preview */}
                {editableProfileData.videos.length > 0 ? (
                    <>
                        <p className="text-gray-500 text-center col-span-full">- Descriptions in motion -</p>
                        {editableProfileData.videos.map((url, index) => {
                            const embedUrl = getYouTubeEmbedUrl(url);

                            return (
                                <div key={index} className="flex flex-col gap-2">
                                    {/* Video Preview */}
                                    <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                        {embedUrl ? (
                                            <iframe
                                                src={embedUrl}
                                                title="YouTube video player"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                                                gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            ></iframe>
                                        ) : (
                                            <div className="w-full h-full bg-slate-400 flex items-center 
                                            justify-center text-gray-500">
                                                Video not available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </> ) : (
                    <>
                        <p className="text-gray-500 text-center col-span-full">- No videos available yet. -</p>
                        <div
                            className="bg-slate-400 w-full aspect-video rounded-xl overflow-hidden -md 
                            flex justify-center items-center"
                        >
                            No videos available yet
                        </div>
                    </>
                )} 
            </div>
        )
        audiosProfile = (            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 z-1">
                <p className="text-gray-500 text-center col-span-full">- Sounds that talk -</p>
                {/* Placeholder Audios */}
                <div className="rounded-xl overflow-hidden -md transition-transform duration-200 ease-in-out hover:-translate-y-1.5 p-4 bg-gray-50 flex flex-col justify-center items-center">
                    <p className="text-gray-800 font-medium mb-2">Track 1: "Echoes of Dawn"</p>
                    <audio controls className="w-full max-w-md rounded-xl"></audio>
                    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg"></source>
                    Your browser does not support the audio element.
                </div>
                <div className="rounded-xl overflow-hidden -md transition-transform duration-200 ease-in-out hover:-translate-y-1.5 p-4 bg-gray-50 flex flex-col justify-center items-center">
                    <p className="text-gray-800 font-medium mb-2">Track 2: "Whispers in the Wind"</p>
                    <audio controls className="w-full max-w-md rounded-xl"></audio>
                    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" type="audio/mpeg"></source>
                    Your browser does not support the audio element.
                </div>
                <div className="rounded-xl overflow-hidden -md transition-transform duration-200 ease-in-out hover:-translate-y-1.5 p-4 bg-gray-50 flex flex-col justify-center items-center">
                    <p className="text-gray-800 font-medium mb-2">Track 3: "Midnight Serenade"</p>
                    <audio controls className="w-full max-w-md rounded-xl"></audio>
                    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" type="audio/mpeg"></source>
                    Your browser does not support the audio element.
                </div>
            </div>
        )
        bioProfile = (
            <ShowMoreContainer text={profileData.bio}/>
        )
        pressProfile = (
            <div>
                {profileData.online_press.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {profileData.online_press.map((item, index) => (
                        <li key={index}> {/* Using index as key is okay if items don't change order or get added/removed frequently */}
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" // Recommended for security with target="_blank"
                                className="text-blue-600 hover:underline"
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No online press available yet.</p>
            )}
            </div>
        )
        technicProfile = (
            <div className="flex flex-wrap justify-center">
                <a href="https://www.example.com/stage_plan.pdf" target="_blank" className="inline-flex items-center bg-indigo-700 text-white py-3 px-6 rounded-xl no-underline transition-colors duration-200 ease-in-out transform font-semibold mr-3 mb-3 hover:bg-indigo-500 hover:-translate-y-0.5">
                    <i className="fas fa-ruler-combined mr-2"></i> Stage Plan
                </a>
                <a href="https://www.example.com/tech_rider.pdf" target="_blank" className="inline-flex items-center bg-indigo-700 text-white py-3 px-6 rounded-xl no-underline transition-colors duration-200 ease-in-out transform font-semibold mr-3 mb-3 hover:bg-indigo-500 hover:-translate-y-0.5">
                    <i className="fas fa-file-invoice mr-2"></i> Tech Rider
                </a>
            </div>
        )
    }

    // ---- RENDER ----
    return (
        <div className="w-full mt-28">
            <form className="space-y-36" onSubmit={handleSubmit}>
                {/* Profile INFO Name, Performance type, Description */}
                <div>
                    {profileInfoProfile}
                </div>

                {/* Online Presence */}
                <div>
                    {onlinePresenceProfile}
                </div>
        
                {/* Media Gallery */}
                <div>
                    <h2 className="text-3xl font-bold text-left text-gray-900 border-gray-200 pb-3">
                        Media Gallery
                    </h2>
                    <div>
                        {/* Photos */}
                        <h3 className="text-xl font-semibold text-center text-gray-800">Photos</h3>
                        {photosProfile}

                        {/* Videos */}
                        <h3 className="text-xl font-semibold text-center text-gray-800">Videos</h3>
                        {videosProfile}

                        {/* Audios */}
                        <h3 className="text-xl font-semibold text-center text-gray-800">Audios</h3>
                        {audiosProfile}
                    </div>
                </div>
                

                {/* Bio */}
                <div>
                    <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                        Biography
                    </h2>
                    {bioProfile}
                </div>
                
                
                {/* Online Press Dynamic Inputs */}
                <div>
                    <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                        Online Press
                    </h2>
                    {pressProfile}
                </div>
                
                

                {/* Technical Section */}
                <div>
                    <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                        Technical Section
                    </h2>
                    {technicProfile}
                </div>
                
                {profileData ? (
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 !text-white py-2 px-4 rounded hover:bg-indigo-500"
                    >
                    {loading ? 'Creating Profile...' : 'Edit Profile'}
                    </button>
                ) : (
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                    {loading ? 'Creating Profile...' : 'Create Profile'}
                    </button>
                )}
                    
            </form>
        </div>
    )
}
