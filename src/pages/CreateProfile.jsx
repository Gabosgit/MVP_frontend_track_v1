import React, { useState, useContext, useEffect } from "react";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import Content from "../components/Content";
import PhotosSection from "../components/componentsCreateProfile/PhotosSection";

// helper for generating unique IDs when adding press title/url
let nextOnlinePressId = 0; // Start ID counter outside the component

export default function CreateProfile() {
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

    // State variables for list fields:
    const [socialMedia, setSocialMedia] = useState([""]);
    const [photos, setPhotos] = useState([""]);
    const [videos, setVideos] = useState([""]);
    const [audios, setAudios] = useState([""]);
    const [onlinePress, setOnlinePress] = useState([{ id: nextOnlinePressId++, title: '', url: '' }]); // Array of objects with default item // 
    
    const [filesToUpload, setFilesToUpload] = useState([]); // [{ file: File, previewUrl: string }, ...]
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // This function will be passed down to PhotoSection
    // PhotoSection will call this function to update filesToUpload in CreateProfile
    const handleFilesReady = (files) => {
        console.log('Files received in CreateProfile:', files);
        setFilesToUpload(files);
    };

    function handleChangeSingle(event) {
        console.log(event.target.name)
        const tempFormSingle = {...formSingle}
        tempFormSingle[event.target.name] = event.target.value
        setFormSingle(tempFormSingle)
    }

    // Helper for updating array-based fields:
    const handleArrayChange = (index, value, array, setArray) => {
        const updated = [...array];
        updated[index] = value;
        setArray(updated);
    };

    const addArrayField = (array, setArray) => {
        setArray([...array, ""]);
    };


    // ONLINE PRESS:
    const handleAddOnlinePress = () => {
        setOnlinePress(prev => [...prev, { id: nextOnlinePressId++, title: '', url: '' }]);
    };

    const handleOnlinePressChange = (index, field, value) => {
        const newOnlinePress = [...onlinePress];
        // Find the item by index and update it
        newOnlinePress[index] = { ...newOnlinePress[index], [field]: value };
        setOnlinePress(newOnlinePress);
    };

    const handleRemoveOnlinePress = (idToRemove) => { // <-- Now remove by ID
        setOnlinePress(prev => prev.filter(item => item.id !== idToRemove));
    };


    // Submit handler that sends a POST request to the API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        let finalImageUrls = []; // This will hold all Cloudinary URLs for the 'photos' field

        // Step 1: Upload Images to Cloudinary via FastAPI /upload endpoint
        if (filesToUpload.length > 0) { // filesToUpload now directly contains File objects
            try {
                const uploadPromises = filesToUpload.map(async (file) => { // Iterate directly over 'file'
                    const formData = new FormData();
                    formData.append('file', file); // 'file' is already the File object

                    const response = await fetch(`${apiBaseUrl}/upload`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Failed to upload ${file.name}: ${errorData.detail || response.statusText}`);
                    }

                    const data = await response.json();
                    return data.url; // Returns the Cloudinary URL
                });

                finalImageUrls = await Promise.all(uploadPromises);
                // This is crucial: Update the parent's state with the actual Cloudinary URLs
                // This state can then be passed back down to PhotoSection if needed to show
                // "successfully uploaded" images, or used elsewhere in CreateProfile.
                setUploadedImageUrls(finalImageUrls); // Assuming you have this state in CreateProfile

            } catch (uploadError) {
                console.error('Error during image uploads:', uploadError);
                setError(`Failed to upload images: ${uploadError.message}`);
                setIsLoading(false);
                return;
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
            setIsLoading(false);
        }
    };

    // ✅ RETURN the JSX to ensure React renders it
    return (
        <Content 
            pageName={"Create Profile"}
            htmlContent={
                <CreateProfileContent 
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
                />
            }
        />
    );
}


function CreateProfileContent({
    handleChangeSingle, name, bio, description, stagePlan, techRider, performanceType, website,
    socialMedia, setSocialMedia, videos, setVideos, audios, setAudios, 
    onlinePress, handleAddOnlinePress, handleOnlinePressChange, handleRemoveOnlinePress,
    handleArrayChange, addArrayField, handleSubmit, 
    isLoading, handleFilesReady, 
    error, success, filesToUpload, uploadedImageUrls, handleRemoveImage
}) {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
                
                

                {/* Profile Name */}
                <div>
                    <label htmlFor="name" className="block text-lg font-medium mb-1">
                        Profile Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={handleChangeSingle}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
        
                {/* Performance Type */}
                <div>
                <label htmlFor="performanceType" className="block text-lg font-medium mb-1">
                    Performance Type
                </label>
                <input
                    id="performanceType"
                    name="performanceType"
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={performanceType}
                    onChange={handleChangeSingle}
                    required
                />
                </div>
        
                {/* Description */}
                <div>
                <label htmlFor="description" className="block text-lg font-medium mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    value={description}
                    onChange={handleChangeSingle}
                    required
                />
                </div>
        
                {/* Bio */}
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
        
                {/* Social Media */}
                <div>
                <label className="block text-lg font-medium mb-1">Social Media URLs</label>
                {socialMedia.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) =>
                        handleArrayChange(index, e.target.value, socialMedia, setSocialMedia)
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField(socialMedia, setSocialMedia)}
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
        
                {/* Stage Plan (optional) */}
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
        

                {/* Photos */}
                {/* Pass the callback function to PhotoSection as a prop */}
                <PhotosSection onFilesReady={handleFilesReady} />
        
                {/* Videos */}
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
        
                {/* Audios */}
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
        

                {/* Online Press Dynamic Inputs */}
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
        
                <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
                </button>
                    
            </form>
        </div>
    )
}
