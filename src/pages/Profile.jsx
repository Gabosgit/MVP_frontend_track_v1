import React, { useState, useContext, useEffect, useRef } from "react";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import Content from "../components/Content";
import { useFilesUploadService } from "../hooks/useFilesUploadService";
import { useParams } from "react-router-dom";
import ShowMoreContainer from "../components/ShowMoreContainer"; // Used for Bio

// helper for generating unique IDs when adding press title/url
let nextOnlinePressId = 0; // Start ID counter outside the component

export default function Profile() {
    const apiBaseUrl = useContext(ApiContext);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { id } = useParams(); // Gets the "id" from the URL (e.g., /profile/1)
    const [profileData, setProfileData] = useState(null);
    const [editing, setEditing] = useState(null)

    // UPLOAD FILES HOCK
    // Images Hook
    const { 
        filesToUpload: photosToUpload, 
        setFilesToUpload: setPhotoToUpload,
        handleSelectedFileChange: handleSelectedPhotoChange, 
        handleRemoveSelectedFile: handleRemoveSelectedPhoto,
        clearFilesToUpload: clearPhotosToUpload
    } = useFilesUploadService();

    // Audios Hook
    const { 
        filesToUpload: audiosToUpdate,
        setFilesToUpload: setAudiosToUpload ,
        handleSelectedFileChange: handleSelectedAudioChange, 
        handleRemoveSelectedFile: handleRemoveSelectedAudio,
        clearFilesToUpload: clearAudiosToUpload
    } = useFilesUploadService();

    // Refs for the file input elements
    const imageInputRef = useRef(null);
    const audioInputRef = useRef(null);

    const [urlsToDelete, setUrlsToDelete] = useState([]);

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
                setLoading(false);
            }
            }
            // 2. Call the fetch function only if an ID is present
            fetchProfile(profileData);
        } else {
            // 3. If there is no ID, it means the user is on the create page.
            //    You can set the loading state to false immediately.
            setLoading(false);
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
        // If the original profileData changes the editableProfileData is also updated, keeping in sync.
    }, [profileData]);


    // SAVE Update handler
    const handleSaveClick = async () => {
        try {
            // Step 1: Delete files from Cloudinary and the database
            // This logic correctly handles deletions independently of uploads.
            if (urlsToDelete.length > 0) {
                const response = await fetch(`${apiBaseUrl}/delete-multiple-assets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ urls: urlsToDelete }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Failed to delete assets: ${errorData.detail}`);
                }
            }

            // Temporary arrays to hold new uploads with their titles
            let newPhotosWithTitles = [];
            let newAudiosWithTitles = [];

            // Step 2 Images: Upload new photos and get their URLs
            if (photosToUpload.length > 0) { // Changed from photosToUpload to photosToUpload
                const formData = new FormData();
                photosToUpload.forEach(item => { // Changed from photosToUpload to photosToUpload
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
                const newImageUrls = data.urls;
                
                // Map the new URLs back to the original files to get their titles
                newPhotosWithTitles = photosToUpload.map((item, index) => ({ // Changed from photosToUpload to photosToUpload
                    url: newImageUrls[index], // Use the URL from the server response
                    title: item.title,       // Use the title from the local state
                }));
            }

            // Step 2 Audios: Upload new audios and get their URLs
            if (audiosToUpdate.length > 0) { // Changed from audiosToUpdate to audiosToUpdate
                const formData = new FormData();
                audiosToUpdate.forEach(item => { // Changed from audiosToUpdate to audiosToUpdate
                    formData.append('files', item.file);
                });
                const response = await fetch(`${apiBaseUrl}/upload-multiple-audios`, {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to upload new audios: ${errorData.detail}`);
                }
                const data = await response.json();
                const newAudiosUrls = data.urls;
                
                // Map the new URLs back to the original files to get their titles
                newAudiosWithTitles = audiosToUpdate.map((item, index) => ({ // Changed from audiosToUpdate to audiosToUpdate
                    url: newAudiosUrls[index], // Use the URL from the server response
                    title: item.title,       // Use the title from the local state
                }));
            }

            // Step 3: Combine all data into the final payload
            // This is the most critical change. The new arrays are now formatted correctly.
            const combinedPhotos = [
                ...(editableProfileData.photos || []),
                ...newPhotosWithTitles
            ];
            const combinedAudios = [
                ...(editableProfileData.audios || []),
                ...newAudiosWithTitles
            ];
            
            // Step 4: Create the final payload for the PATCH request
            const payload = {
                ...editableProfileData,
                photos: combinedPhotos.filter(photo => photo.url), // Filter out any photos with an empty URL
                audios: combinedAudios.filter(audio => audio.url), // Filter out any audios with an empty URL
                social_media: editableProfileData.social_media.filter(item => item.url),
                videos: editableProfileData.videos.filter(item => item.url)
            };

            // Step 5: Send the PATCH request to the server
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
            setProfileData(updatedData);
            setEditing(false);
            setUrlsToDelete([]);
            
            // Step 6: Clear the files and the inputs after a successful upload
            clearPhotosToUpload();
            clearAudiosToUpload();
            if (imageInputRef.current) {
                imageInputRef.current.value = null;
            }
            if (audioInputRef.current) {
                audioInputRef.current.value = null;
            }
        } catch (err) {
            setError(err.message);
        }
    }

    // CANCEL
    const handleCancelClick = () => {
        clearPhotosToUpload();
        clearAudiosToUpload();
        if (imageInputRef.current) {
            imageInputRef.current.value = null;
        }
        if (audioInputRef.current) {
            audioInputRef.current.value = null;
        }
        setEditableProfileData(profileData);
        setPhotoToUpload([]); // Clear newly selected files
        setAudiosToUpload([]); // Clear newly selected files
        setUrlsToDelete([]); // Clear the deletion queue
        setEditing(false);
    };

    // ✅ RETURN
    return (
        <Content 
            pageName={"Profile"}
            loading={loading}
            setLoading={setLoading}
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
                    setLoading={setLoading}
                    editableProfileData={editableProfileData}
                    setEditableProfileData={setEditableProfileData}
                    photosToUpload={photosToUpload}
                    handleSelectedPhotoChange={handleSelectedPhotoChange}
                    handleRemoveSelectedPhoto={handleRemoveSelectedPhoto}
                    audiosToUpdate={audiosToUpdate}
                    setAudiosToUpload={setAudiosToUpload}
                    handleSelectedAudioChange={handleSelectedAudioChange}
                    handleRemoveSelectedAudio={handleRemoveSelectedAudio}
                    urlsToDelete={urlsToDelete}
                    setUrlsToDelete={setUrlsToDelete}
                    imageInputRef={imageInputRef}
                    audioInputRef={audioInputRef}
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
    setLoading, 
    setError, 
    editableProfileData, 
    setEditableProfileData,
    photosToUpload,
    handleSelectedPhotoChange,
    handleRemoveSelectedPhoto,
    audiosToUpdate,
    setAudiosToUpload,
    handleSelectedAudioChange, 
    handleRemoveSelectedAudio,
    setUrlsToDelete,
    imageInputRef,
    audioInputRef
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
        // Add a defensive check to ensure the URL is a valid string
        if (!url || typeof url !== 'string') {
            return null; // Return null to prevent the crash
        }
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
    
    // This is the updated function to handle the new object-based arrays.
    const handleArrayDictChange = (index, value, fieldName, key) => {
        setEditableProfileData(prev => {
            // Ensure the property exists and is an array, otherwise default to an empty array
            const currentArray = prev[fieldName] || [];
            
            // Create a deep copy of the array and the object to modify it
            const updatedArray = [...currentArray];
            const updatedObject = { ...updatedArray[index], [key]: value };

            // Replace the old object with the new, updated one
            updatedArray[index] = updatedObject;
            
            // Return the new state object with the updated array
            return {
                ...prev,
                [fieldName]: updatedArray,
            };
        });
    };

    // Handles title changes for newly added files
    const handleNewAudioChange = (index, value) => {
        setAudiosToUpload(prev => {
            const updatedArray = [...prev];
            // Ensure the object and its properties exist
            if (updatedArray[index]) {
                updatedArray[index] = { ...updatedArray[index], title: value };
            }
            return updatedArray;
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
    // Handling both string and object formats
    const handleDeleteArrayField = (index, fieldName) => {
        // setEditableProfileData take a function as its argument with prev state as input.
        setEditableProfileData(prev => {
            const currentArray = prev[fieldName] || []; // Falls back to an empty array, null or undefined.
            const itemToDelete = currentArray[index]; // Get item by index

            // Immutability process
            // Removes item from the local state create a new array
            // Includes items in updatedArray only if the condition in the callback function is true.
            // _: convention to indicate that we don't need to use the actual item's value in this operation.
            // i: The second argument, i, is the index of the current item in the array.
            // i !== index: This is the condition.
            const updatedArray = currentArray.filter((_, i) => i !== index);

            // Get the URL to delete, handling both string and object formats
            // If is an Object, it retrieves the URL from the url property
            // If it's not an Object, uses the item itself as the URL
            const url = typeof itemToDelete === 'object' && itemToDelete !== null ? itemToDelete.url : itemToDelete;
            
            // If the URL exists, add it to the array URLsToDelete state which
            // collects all the URLs marked for deletion before they are sent to the backend
            if (url) {
                setUrlsToDelete(prevUrls => [...prevUrls, url]);
            }
            
            // This return, becomes the new state of editableProfileData.
            // Triggers the state update and forces React to re-render the component
            return {
                ...prev,
                // Dynamically sets the property with the key of fieldName to the created updatedArray.
                [fieldName]: updatedArray,// JavaScript trick called a computed property name
            };
        });
    };

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
        setLoading(true);
        setError(null);

        let finalImageUrls = [];
        let finalAudioUrls = [];

        // Step 1: Upload Images to Cloudinary via FastAPI /upload-multiple endpoint
        if (photosToUpload.length > 0) {
            try {
                const formData = new FormData();
                photosToUpload.forEach((item) => {
                    formData.append('files', item.file);
                });

                const response = await fetch(`${apiBaseUrl}/upload-multiple`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to upload images: ${errorData.detail || response.statusText}`);
                }

                const data = await response.json();
                finalImageUrls = data.urls;

            } catch (uploadError) {
                console.error('Error during image uploads:', uploadError);
                setError(`Failed to upload images: ${uploadError.message}`);
                setLoading(false);
                return;
            }
        }

        // --- NEW: Step 2: Upload Audio Files ---
        if (audiosToUpdate.length > 0) {
            try {
                const formData = new FormData();
                audiosToUpdate.forEach((item) => {
                    formData.append('files', item.file);
                });

                const response = await fetch(`${apiBaseUrl}/upload-multiple-audios`, { // Assuming a new backend endpoint for audios
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to upload audios: ${errorData.detail || response.statusText}`);
                }

                const data = await response.json();
                finalAudioUrls = data.urls;

            } catch (uploadError) {
                console.error('Error during audio uploads:', uploadError);
                setError(`Failed to upload audios: ${uploadError.message}`);
                setLoading(false);
                return;
            }
        }

        // Step 3: Create the payload with both photo and audio URLs
        const payload = {
            name: editableProfileData.name || null,
            performance_type: editableProfileData.performance_type || null,
            description: editableProfileData.description || null,
            bio: editableProfileData.bio || null,
            website: editableProfileData.website || null,
            social_media: (editableProfileData.social_media || []).filter((url) => url.trim() !== ""),
            stage_plan: editableProfileData.stage_plan || null,
            tech_rider: editableProfileData.tech_rider || null,
            photos: finalImageUrls,
            audios: finalAudioUrls, // Use the uploaded audio URLs here
            videos: (editableProfileData.videos || []).filter((url) => url.trim() !== ""),
            online_press: (editableProfileData.online_press || []).filter(item => item.title && item.url)
                                    .map(item => ({ title: item.title, url: item.url })),
        };

        // Fetch
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
            setLoading(false);
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
                {photosToUpload.length > 0 && photosToUpload.map(item => (
                    <div key={item.id} className="relative aspect-video overflow-hidden rounded-xl shadow-md">
                        <div className=" rounded-xl overflow-hidden shadow-md">
                            <img
                                src={item.previewUrl}
                                alt={`Preview of ${item.file.name}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            onClick={() => handleRemoveSelectedPhoto(item.id)}
                            className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                {/* Your file input that uses the function from the hook */}
                <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSelectedPhotoChange}
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
                {editableProfileData.videos.map((item, index) => {
                    const embedUrl = getYouTubeEmbedUrl(item.url);

                    return (
                        <div key={index} className="flex flex-col gap-2">
                            {/* Video Preview */}
                            
                            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                                {/* Input Field with Delete Button */}
                                <div className="relative">
                                    {/* Add url input field */}
                                    <input
                                        type="url"
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={item.url}
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
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 z-1">
                    <p className="text-gray-500 text-center col-span-full pb-5">- Add audios -</p>
                    {/* Render previews from the state returned by the hook */}
                    {audiosToUpdate.length > 0 && audiosToUpdate.map(item => (
                        <div key={item.id} className="flex flex-col relative aspect-video overflow-hidden rounded-xl shadow-md">
                            <button
                                onClick={() => handleRemoveSelectedAudio(item.id)}
                                className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                            >
                                &times;
                            </button>
                            <p className="bg-red-600 mt-16 text-center" >{item.file.name}</p>
                            
                            <audio
                                controls
                                src={item.previewUrl}
                                className="w-full h-full object-cover"
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))}
                    {/* Your file input that uses the function from the hook */}
                    <input
                        type="file"
                        multiple
                        accept="audio/*" // Changed to accept audio files
                        onChange={handleSelectedAudioChange}
                        className="hidden" // Hides the default browser input
                        id="audio-upload-input" // The unique ID to link with the label
                    />
                    {/* Custom button/label that users will see */}
                    <label
                        htmlFor="audio-upload-input" // This attribute links the label to the hidden input
                        className="text-blue-500 bg-indigo-200 w-full aspect-video rounded-xl overflow-hidden -md 
                        flex justify-center items-center text-center transition-transform duration-200 
                        ease-in-out hover:-translate-y-1.5" // Your custom styling
                    >
                        ╋ <br /> Add audio
                    </label>
                </div>
            </>
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
                {(editableProfileData.photos || []).map((item, index) => (
                    <div key={item.url} className="flex flex-col gap-2">
                        <div className="relative aspect-video bg-gray-300 overflow-hidden rounded-xl shadow-md">
                            <img
                                src={item.url}
                                alt={`photo ${index + 1} not available`}
                                className="w-full h-full object-cover"
                            />
                            {/* Button to delete photos */}
                            <button
                                type="button"
                                onClick={() => handleDeleteArrayField(index, 'photos')} // Assuming this function exists
                                className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2">
                            <input
                                type="text"
                                placeholder="Title"
                                value={item.title || ''}
                                onChange={(e) => handleArrayDictChange(
                                    index, e.target.value, 'photos', 'title'
                                )}
                                className="w-full text-center border-dashed bg-transparent"
                            />
                        </div>
                    </div>
                ))}

                {/* **Display Newly Selected Photos from the Local State** */}
                {photosToUpload.length > 0 && photosToUpload.map(newItem => (
                    <div key={newItem.id} className="flex flex-col gap-2">
                        <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
                            <img
                                src={newItem.previewUrl}
                                alt={`Preview of ${newItem.file.name}`}
                                className="w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveSelectedPhoto(newItem.id)}
                                className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="font-bold">title: </p>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newItem.title || ''}
                                onChange={(e) => handleArrayDictChange(
                                    index, e.target.value, 'videos', 'title'
                                )}
                            />
                        </div>
                    </div>
                ))}

                {/* The file input and custom label */}
                <input
                    type="file"
                    multiple
                    onChange={handleSelectedPhotoChange}
                    className="hidden"
                    id="photo-upload-input"
                    ref={imageInputRef}
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
                {editableProfileData.videos.map((item, index) => {
                    const embedUrl = getYouTubeEmbedUrl(item.url);
                    return (
                        <div key={index} className="flex flex-col gap-2">
                            {/* Video Preview */}
                            <div className="relative flex flex-col aspect-video rounded-xl overflow-hidden shadow-md">
                                {/* Input Field with Delete Button */}
                                <div className="flex items-center justify-center">
                                    {/* Add url input field */}
                                    <input
                                        type="url"
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={item.url}
                                        onChange={(e) => handleArrayDictChange(index, e.target.value, 'videos', 'url')}
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
                            <div className="flex items-center justify-center">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={item.title || ''}
                                    onChange={(e) => handleArrayDictChange(
                                        index, e.target.value, 'videos', 'title'
                                    )}
                                    className="w-full text-center border-dashed bg-transparent"
                                />
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
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 z-1">
                    <p className="text-gray-500 text-center col-span-full">- Add and remove audios -</p>
                    {/* **Display Existing Audios from the Database** */}
                    {(editableProfileData.audios || []).map((item, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <div className="relative flex flex-col aspect-video 
                                bg-slate-500 overflow-hidden rounded-xl shadow-md">
                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteArrayField(index, 'audios')} // function to delete field
                                    className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                                >
                                    &times;
                                </button>
                                <div className="flex items-center h-full justify-center">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={item.title || ''}
                                        onChange={(e) => handleArrayDictChange(
                                            index, e.target.value, 'audios', 'title'
                                        )}
                                        className="w-full text-center border-dashed bg-transparent"
                                    />
                                </div>
                                <audio
                                    controls
                                    src={item.url}
                                    className="w-full h-full object-cover bg-transparent"
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                            
                        </div>
                    ))}

                    {/* Display Newly Selected Audios from the Local State */}
                    {audiosToUpdate.length > 0 && audiosToUpdate.map((newItem, index) => (
                        <div key={newItem.id} className="flex flex-col relative aspect-video overflow-hidden rounded-xl shadow-md">
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => handleRemoveSelectedAudio(newItem.id)}
                                    className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                                >
                                    &times;
                                </button>
                                <div className="bg-red-600 mt-16 text-center">
                                    <p className="font-bold">title: </p>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={newItem.title || ''} // Bind to the new 'title' property
                                        onChange={(e) => handleNewAudioChange(index, e.target.value)} // Use the new handler
                                    />
                                </div>
                                
                            </div>
                            <audio
                                controls
                                src={newItem.previewUrl}
                                className="w-full h-full object-cover"
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    ))}

                    {/* Your file input that uses the function from the hook */}
                    <input
                        type="file"
                        multiple
                        accept="audio/*" // Changed to accept audio files
                        onChange={handleSelectedAudioChange}
                        className="hidden" // Hides the default browser input
                        id="audio-upload-input" // The unique ID to link with the label
                        ref={audioInputRef}
                    />
                    {/* Custom button/label that users will see */}
                    <label
                        htmlFor="audio-upload-input" // This attribute links the label to the hidden input
                        className="text-blue-500 bg-indigo-200 w-full aspect-video rounded-xl overflow-hidden -md 
                        flex justify-center items-center text-center transition-transform duration-200 
                        ease-in-out hover:-translate-y-1.5" // Your custom styling
                    >
                        ╋ <br /> Add audio
                    </label>
                </div>
            </>
        );
        bioProfile = (
            <div>
                <textarea
                    id="bio"
                    name="bio"
                    rows="5"
                    value={editableProfileData.bio || ''}
                    onChange={handleChangeSingle}
                    required
                    className="
                        w-full text-gray-500 text-justify px-1 py-1 text-lg sm:text-xl leading-none
                        border border-3 border-dashed outline-none border-custom-purple-start rounded 
                        focus:border-solid focus:border-x-amber-500 focus:bg-violet-200
                        hover:bg-purple-300 bg-transparent overflow-hidden"
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
                        {profileData.photos.map((item, index) => (
                                <div
                                    key={index} // Use a unique key for each item in the list
                                    className="flex flex-col gap-2"
                                >
                                    <div className="aspect-video rounded-xl overflow-hidden shadow-md bg-gray-200
                                    transition-transform duration-200 ease-in-out hover:-translate-y-1.5">
                                        <img
                                        src={item.url} // The URL for the current photo in the iteration
                                        alt={`Photo ${index + 1} not available`} // Dynamic alt text
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                    </div>
                                    
                                    <div className="flex items-center justify-center">
                                        <p className="py-2 w-full text-center border border-emerald-800">{item.title}</p>
                                    </div>
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
                        {editableProfileData.videos.map((item, index) => {
                            const embedUrl = getYouTubeEmbedUrl(item.url);

                            return (
                                <div key={index} className="flex flex-col gap-2">
                                    {/* Video Preview */}
                                    <div className="flex items-center justify-center aspect-video rounded-xl overflow-hidden shadow-md">
                                        {embedUrl ? (
                                            <iframe
                                                src={embedUrl}
                                                title="YouTube video player"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                                                gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full "
                                            ></iframe>
                                        ) : (
                                            <div className="w-full h-full bg-slate-400 flex items-center 
                                            justify-center text-gray-500">
                                                Video not available
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <p className="py-2 w-full text-center border border-emerald-800">{item.title}</p>
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
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 z-1">
                    {/* Render previews from the database */}
                    {profileData.audios && profileData.audios.length > 0 ? (
                        <>
                            <p className="text-gray-500 text-center col-span-full">
                                - Some audios describing the project -
                            </p>
                            {profileData.audios.map((item, index) => (
                            <div key={index} className="flex flex-col aspect-video
                             overflow-hidden rounded-xl shadow-md"
                            >
                                <div className="flex h-full bg-slate-500 items-center justify-center">
                                    <p className="text-slate-900 text-center" >{item.title}</p>
                                </div>
                                <audio
                                    controls
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                >
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                            ))}
                        </> 
                    ) : (
                    // Display a message and a placeholder if no audios are available
                    <>
                        <p className="text-gray-500 text-center col-span-full">- No audios available yet. -</p>
                        <div
                            className="bg-slate-400 w-full aspect-video rounded-xl overflow-hidden -md 
                            flex justify-center items-center"
                        >
                            No audios available yet
                        </div>
                    </>
                )}
                </div>
            </>
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
