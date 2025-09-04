import React, { useState, useContext, useEffect, useRef } from "react";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import Content from "../components/Content";
import PhotosSection from "../components/componentsCreateProfile/PhotosSection";
import { useParams } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import ShowMoreContainer from "../components/ShowMoreContainer"; // Used for Bio

// helper for generating unique IDs when adding press title/url
let nextOnlinePressId = 0; // Start ID counter outside the component

export default function Profile() {
    const apiBaseUrl = useContext(ApiContext);
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
    
    const [filesToUpload, setFilesToUpload] = useState([]); // [{ file: File, previewUrl: string }, ...]
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [imageError, setImageError ] = useState(null)

    const { id } = useParams(); // Gets the "id" from the URL (e.g., /profile/1)
    const [profileData, setProfile] = useState(null);
    const [editing, setEditing] = useState(null)

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
                setProfile(data);
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

    // This function will be passed down to PhotoSection
    // PhotoSection will call this function to update filesToUpload in CreateProfile
    const handleFilesReady = (files) => {
        console.log('Files received in CreateProfile:', files);
        setFilesToUpload(files);
    };

    // Updates single data
    function handleChangeSingle(event) {
        const tempFormSingle = {...formSingle}
        tempFormSingle[event.target.name] = event.target.value
        setFormSingle(tempFormSingle)
    }

    // Updates array-based data
    const handleArrayChange = (index, value, array, setArray) => {
        const updated = [...array];
        updated[index] = value;
        setArray(updated);
    };

    // Adds array field
    const addArrayField = (array, setArray) => {
        setArray([...array, ""]);
    };

    // Adds Online Press
    const handleAddOnlinePress = () => {
        setOnlinePress(prev => [...prev, { id: nextOnlinePressId++, title: '', url: '' }]);
    };

    // Updates Online Press
    const handleOnlinePressChange = (index, field, value) => {
        const newOnlinePress = [...onlinePress];
        // Find the item by index and update it
        newOnlinePress[index] = { ...newOnlinePress[index], [field]: value };
        setOnlinePress(newOnlinePress);
    };

    // Removes Online Press
    const handleRemoveOnlinePress = (idToRemove) => { // <-- Now remove by ID
        setOnlinePress(prev => prev.filter(item => item.id !== idToRemove));
    };

    // Submit handler that sends a POST request to the API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);
        setError(null);
        setSuccess(null);

        let finalImageUrls = []; // This will hold all Cloudinary URLs for the 'photos' field

        // Step 1: Upload Images to Cloudinary via FastAPI /upload-multiple endpoint
        if (filesToUpload.length > 0) { // filesToUpload now directly contains File objects
            try {
                const formData = new FormData();
                // Append each file under the same key 'files'.
                // The backend (FastAPI) expects multiple files under a single form field name.
                filesToUpload.forEach((file) => {
                    formData.append('files', file);
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

                // Update the parent's state with the actual Cloudinary URLs.
                // This state can then be used to display uploaded images or for other purposes.
                setUploadedImageUrls(finalImageUrls);

            } catch (uploadError) {
                console.error('Error during image uploads:', uploadError);
                setError(`Failed to upload images: ${uploadError.message}`);
                setloading(false);
                return; // Stop execution if image upload fails
            }
        }

        // Create the payload to match the API's expected dictionary:
        const payload = {
            name: formSingle.name,
            performance_type: formSingle.performanceType,
            description: formSingle.description,
            bio: formSingle.bio,
            website: formSingle.website || null,
            social_media: socialMedia.filter((url) => url.trim() !== ""),
            stage_plan: formSingle.stagePlan || null,
            tech_rider: formSingle.techRider || null,
            photos: finalImageUrls, // Send the Cloudinary URLs from the upload process
            videos: videos.filter((url) => url.trim() !== ""),
            audios: audios.filter((url) => url.trim() !== ""),
            online_press: onlinePress.filter(item => item.title && item.url)
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

    // ✅ RETURN
    return (
        <Content 
            pageName={"Create Profile"}
            loading={loading}
            error={error}
            editing={editing} // Pass the 'editing' state down to the Content component as a prop
            setEditing={setEditing} // Pass the setter function down as a prop
            htmlContent={
                <CreateProfileContent 
                    editing={editing} // Pass the 'editing' prop to CreateProfileContent
                    handleChangeSingle={handleChangeSingle}
                    name={formSingle.name}
                    bio={formSingle.bio}
                    description={formSingle.description}
                    performanceType={formSingle.performanceType}
                    techRider={formSingle.techRider}
                    stagePlan={formSingle.stagePlan}
                    website={formSingle.website}
                    socialMedia={socialMedia} setSocialMedia={setSocialMedia}
                    photos={photos} setPhotos={setPhotos}
                    videos={videos} setVideos={setVideos}
                    audios={audios} setAudios={setAudios}
                    onlinePress={onlinePress} handleOnlinePressChange={handleOnlinePressChange} 
                    handleAddOnlinePress={handleAddOnlinePress} handleRemoveOnlinePress={handleRemoveOnlinePress}
                    handleArrayChange={handleArrayChange} addArrayField={addArrayField}
                    handleSubmit={handleSubmit} 
                    handleFilesReady={handleFilesReady}
                    imageError={imageError} setImageError={setImageError}
                    profileData={profileData}
                />
            }
        />
    );
}

// CONTENT TO RENDER CRUD PAGE ----------------------------
function CreateProfileContent({
    handleChangeSingle, name, bio, description, stagePlan, techRider, performanceType, website,
    socialMedia, setSocialMedia, videos, setVideos, audios, setAudios, 
    onlinePress, handleAddOnlinePress, handleOnlinePressChange, handleRemoveOnlinePress,
    handleArrayChange, addArrayField, handleSubmit, 
    loading, handleFilesReady, imageError, setImageError, profileData, editing
}) {
    const [textareaHeight, setTextareaHeight] = useState('auto');
    const [textareaWidth, setTextareaWidth] = useState('auto');
    const dummyRef = useRef(null);

    const [profileNameHeight, setProfileNameHeight] = useState('auto');
    const profileNameRef = useRef(null);

    // PHOTO POPOVER SETTING
    const [open, setOpen] = useState(false)

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
                        value={name}
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
                        name="performanceType"
                        type="text"
                        value={performanceType}
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
                        value={description}
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
                        value={website}
                        onChange={handleChangeSingle}
                    />
                </div>
            </>
        )
        photosProfile = (
            <>
                {/* Photos */}
                {/* Pass the callback function to PhotoSection as a prop */}
                <PhotosSection onFilesReady={handleFilesReady} imageError={imageError} setImageError={setImageError} /> 
            </>
            
        )
        videosProfile = (
            <div>
                <label className="block text-lg font-medium mb-1">Videos URLs</label>
                {videos.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) =>
                        handleArrayChange(index, e.target.value, videos, setVideos)
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField(videos, setVideos)}
                    className="text-blue-500 hover:underline"
                >
                    Add another video
                </button>
            </div>

        )
        audiosProfile = (
            <div>
                <label className="block text-lg font-medium mb-1">Audios URLs</label>
                {audios.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) =>
                        handleArrayChange(index, e.target.value, audios, setAudios)
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField(audios, setAudios)}
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
                    value={bio}
                    onChange={handleChangeSingle}
                    required
                />
            </div>
        )
        pressProfile = (
            <div>
                <label style={{ display: 'block', marginBottom: '10px' }}>Online Press (Title & URL):</label> {/* <-- Make label a block element and add margin */}
                {onlinePress.map((item) => ( // <-- Map now just takes 'item'
                <div key={item.id} style={{ border: '1px dashed #eee', padding: '10px', marginBottom: '10px' }}> {/* <-- Use item.id as key */}
                    <input type="text" placeholder="Title" value={item.title} onChange={(e) => handleOnlinePressChange(onlinePress.indexOf(item), 'title', e.target.value)} style={{ display: 'block', marginBottom: '5px', width: '100%' }} />
                    <input type="url" placeholder="https://..." value={item.url} onChange={(e) => handleOnlinePressChange(onlinePress.indexOf(item), 'url', e.target.value)} style={{ display: 'block', marginBottom: '5px', width: '100%' }} />
                    <button type="button" onClick={() => handleRemoveOnlinePress(item.id)}>Remove</button> {/* <-- Pass item.id */}
                </div>
                ))}
                <button type="button" onClick={handleAddOnlinePress}> + Add Online Press Item</button>
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
                        value={stagePlan}
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
                        value={techRider}
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
                        value={name || profileData.name} 
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
                        name="performanceType"
                        type="text"
                        // Pre-fill the input with the existing profile data
                        value={performanceType || profileData.performance_type}
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
                        value={description || profileData.description}
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
            <>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 mt-6">Photos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    {/* Placeholder Photos */}
                    {/* Use a conditional check to ensure profileData.photos exists and is an array */}
                    {profileData.photos && profileData.photos.length > 0 ? (
                        profileData.photos.map((photoUrl, index) => (
                            <div
                                key={index}
                                onClick={() => setOpen(true)}
                                className="cursor-pointer rounded-xl overflow-hidden shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1.5"
                                >
                                <img
                                    src={photoUrl} // The URL for the current photo in the iteration
                                    alt={`Photo ${index + 1}`} // Dynamic alt text
                                    className="w-full h-52 object-cover rounded-xl"
                                />
                            </div>
                        ))
                    ) : (
                        // Optional: Display a message or a placeholder if no photos are available
                        <p className="text-gray-500 text-center mb-20 col-span-full">- No photos available yet. -</p>
                    )}
                </div>
                <div>
                    <Dialog open={open} onClose={setOpen} className="relative z-10">
                        <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/50 transition-opacity 
                        data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 
                        data-[enter]:ease-out data-[leave]:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-screen items-cener justify-center text-center sm:items-center sm:p-0">
                                <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline outline-1 -outline-offset-1 outline-white/10 transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                                >
                                <div className="bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                    
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <DialogTitle as="h3" className="text-base font-semibold text-white">
                                        PHOTO OPTIONS
                                        </DialogTitle>
                                        <div className="mt-2">
                                        <p className="text-sm text-gray-400">
                                            This action cannot be undone.
                                        </p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="bg-gray-700/25 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold !text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                                    >
                                    delete
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold !text-white hover:bg-blue-400 sm:ml-3 sm:w-auto"
                                    >
                                    change
                                    </button>
                                    <button
                                    type="button"
                                    data-autofocus
                                    onClick={() => setOpen(false)}
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold !text-white ring-1 ring-inset ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                                    >
                                    Cancel
                                    </button>
                                </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </>
        )
        videosProfile = (
            <div>
                <label className="block text-lg font-medium mb-1">Videos URLs</label>
                {videos.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) =>
                        handleArrayChange(index, e.target.value, videos, setVideos)
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField(videos, setVideos)}
                    className="text-blue-500 hover:underline"
                >
                    Add another video
                </button>
            </div>

        )
        audiosProfile = (
            <div>
                <label className="block text-lg font-medium mb-1">Audios URLs</label>
                {audios.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) =>
                        handleArrayChange(index, e.target.value, audios, setAudios)
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField(audios, setAudios)}
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
                    value={bio}
                    onChange={handleChangeSingle}
                    required
                />
            </div>
        )
        pressProfile = (
            <div>
                <label style={{ display: 'block', marginBottom: '10px' }}>Online Press (Title & URL):</label> {/* <-- Make label a block element and add margin */}
                {onlinePress.map((item) => ( // <-- Map now just takes 'item'
                <div key={item.id} style={{ border: '1px dashed #eee', padding: '10px', marginBottom: '10px' }}> {/* <-- Use item.id as key */}
                    <input type="text" placeholder="Title" value={item.title} onChange={(e) => handleOnlinePressChange(onlinePress.indexOf(item), 'title', e.target.value)} style={{ display: 'block', marginBottom: '5px', width: '100%' }} />
                    <input type="url" placeholder="https://..." value={item.url} onChange={(e) => handleOnlinePressChange(onlinePress.indexOf(item), 'url', e.target.value)} style={{ display: 'block', marginBottom: '5px', width: '100%' }} />
                    <button type="button" onClick={() => handleRemoveOnlinePress(item.id)}>Remove</button> {/* <-- Pass item.id */}
                </div>
                ))}
                <button type="button" onClick={handleAddOnlinePress}> + Add Online Press Item</button>
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
                        value={stagePlan}
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
                        value={techRider}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {/* Placeholder Photos */}
                {/* Use a conditional check to ensure profileData.photos exists and is an array */}
                {profileData.photos && profileData.photos.length > 0 ? (
                    profileData.photos.map((photoUrl, index) => (
                        <div
                            key={index} // Use a unique key for each item in the list
                            className="rounded-xl overflow-hidden shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1.5"
                        >
                            <img
                                src={photoUrl} // The URL for the current photo in the iteration
                                alt={`Photo ${index + 1}`} // Dynamic alt text
                                className="w-full h-52 object-cover rounded-xl"
                            />
                        </div>
                    ))
                ) : (
                    // Optional: Display a message or a placeholder if no photos are available
                    <p className="text-gray-500 text-center mb-20 col-span-full">- No photos available yet. -</p>
                )}
            </div>
        )
        videosProfile = (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {/* Placeholder Videos (YouTube embeds) */}
                <div className="rounded-xl overflow-hidden -md transition-transform duration-200 ease-in-out hover:-translate-y-1.5">
                    <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden">
                        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-xl"></iframe>
                    </div>
                </div>
                <div className="rounded-xl overflow-hidden -md transition-transform duration-200 ease-in-out hover:-translate-y-1.5">
                    <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden">
                        <iframe src="https://www.youtube.com/embed/m7w5sI7F-XQ?controls=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-xl"></iframe>
                    </div>
                </div>
                <div className="rounded-xl overflow-hidden -md transition-transform duration-200 ease-in-out hover:-translate-y-1.5">
                    <div className="relative w-full pb-[56.25%] h-0 rounded-xl overflow-hidden">
                        <iframe src="https://www.youtube.com/embed/3JWTaaS7LCE?controls=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-xl"></iframe>
                    </div>
                </div>
            </div>
        )
        audiosProfile = (            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

    return (
        <div className="w-full mt-16">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                        Media Gallery
                    </h2>

                    {/* Photos */}
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 mt-6">Photos</h3>
                    {photosProfile}

                    {/* Videos */}
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 mt-6">Videos</h3>
                    {videosProfile}

                    {/* Audios */}
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 mt-6">Audios</h3>
                    {audiosProfile}
                </div>

                {/* Bio */}
                <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                    Biography
                </h2>
                {bioProfile}
                
                {/* Online Press Dynamic Inputs */}
                <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                    Press (online)
                </h2>
                {pressProfile}
                

                {/* Technical Section */}
                <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                    Technical Section
                </h2>
                {technicProfile}
                {/* Stage Plan (optional) */}
                
                

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
