import React, { useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import Content from "../components/Content";


export default function CreateProfile() {
    const apiBaseUrl = useContext(ApiContext);
    // Define navigate
    const navigate = useNavigate(); 

    // State variables for single fields:
    const [name, setName] = useState("");
    const [performanceType, setPerformanceType] = useState("");
    const [description, setDescription] = useState("");
    const [bio, setBio] = useState("");
    const [stagePlan, setStagePlan] = useState("");
    const [techRider, setTechRider] = useState("");
    const [website, setWebsite] = useState("");

    // State variables for list fields:
    const [socialMedia, setSocialMedia] = useState([""]);
    const [photos, setPhotos] = useState([""]);
    const [videos, setVideos] = useState([""]);
    const [audios, setAudios] = useState([""]);
    const [onlinePress, setOnlinePress] = useState([""]);

    // Helper for updating array-based fields:
    const handleArrayChange = (index, value, array, setArray) => {
        const updated = [...array];
        updated[index] = value;
        setArray(updated);
    };

    const addArrayField = (array, setArray) => {
        setArray([...array, ""]);
    };

    // Submit handler that sends a POST request to the API
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the payload to match the API's expected dictionary:
        const payload = {
        name,
        performance_type: performanceType,
        description,
        bio,
        website: website || null, // Optional fields set to null if empty
        social_media: socialMedia.filter((url) => url.trim() !== ""),
        stage_plan: stagePlan || null,
        tech_rider: techRider || null,
        photos: photos.filter((url) => url.trim() !== ""),
        videos: videos.filter((url) => url.trim() !== ""),
        audios: audios.filter((url) => url.trim() !== ""),
        online_press: onlinePress.filter((url) => url.trim() !== ""),
        };

        try {
            // Get the token from localStorage; adjust retrieval as necessary.
            const token = localStorage.getItem("token");

            const response = await fetch(`${apiBaseUrl}/profile`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Include token for authorization
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Ensure error data exists
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data && data.profile_id) {
                console.log("Profile created successfully:", data);
                // Optionally show a success message or redirect the user
                alert("Profile created successfully!");
                // Redirect to profile/{ profile_id: 1 }, redirect:
                navigate(`/profile/${data.profile_id}`);
            } else {
                throw new Error("Missing profile ID in API response.");
            }


        } 
        
        catch (error) {
        console.error("Error creating profile:", error);
        // Optionally display an error message to the user
        alert(`Error creating profile: ${error.message}`);
        }
    };

    // ✅ RETURN the JSX to ensure React renders it
    return (
        <Content 
            pageName={"Create Profile"}
            htmlContent={
                <CreateProfileContent 
                    name={name} setName={setName} 
                    performanceType={performanceType} setPerformanceType={setPerformanceType}
                    description={description} setDescription={setDescription}
                    bio={bio} setBio={setBio}
                    website={website} setWebsite={setWebsite}
                    stagePlan={stagePlan} setStagePlan={setStagePlan}
                    techRider={techRider} setTechRider={setTechRider}
                    socialMedia={socialMedia} setSocialMedia={setSocialMedia}
                    photos={photos} setPhotos={setPhotos}
                    videos={videos} setVideos={setVideos}
                    audios={audios} setAudios={setAudios}
                    onlinePress={onlinePress} setOnlinePress={setOnlinePress}
                    handleArrayChange={handleArrayChange} addArrayField={addArrayField}
                    handleSubmit={handleSubmit}
                />
            }
        />
    );
}


function CreateProfileContent({
    name, setName, performanceType, setPerformanceType, 
    description, setDescription, bio, setBio, 
    website, setWebsite, stagePlan, setStagePlan, 
    techRider, setTechRider, socialMedia, setSocialMedia, 
    photos, setPhotos, videos, setVideos, audios, setAudios, 
    onlinePress, setOnlinePress, handleArrayChange, addArrayField, handleSubmit 
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
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={performanceType}
                    onChange={(e) => setPerformanceType(e.target.value)}
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
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
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
                    type="url"
                    placeholder="https://example.com"
                    className="w-full border rounded px-3 py-2"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
                </div>
        
                {/* Stage Plan (optional) */}
                <div>
                <label htmlFor="stagePlan" className="block text-lg font-medium mb-1">
                    Stage Plan (optional)
                </label>
                <input
                    id="stagePlan"
                    type="url"
                    placeholder="https://example.com"
                    className="w-full border rounded px-3 py-2"
                    value={stagePlan}
                    onChange={(e) => setStagePlan(e.target.value)}
                />
                </div>
        
                {/* Tech Rider (optional) */}
                <div>
                <label htmlFor="techRider" className="block text-lg font-medium mb-1">
                    Tech Rider (optional)
                </label>
                <input
                    id="techRider"
                    type="url"
                    placeholder="https://example.com"
                    className="w-full border rounded px-3 py-2"
                    value={techRider}
                    onChange={(e) => setTechRider(e.target.value)}
                />
                </div>
        
                {/* Photos */}
                <div>
                <label className="block text-lg font-medium mb-1">Photos URLs</label>
                {photos.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) =>
                        handleArrayChange(index, e.target.value, photos, setPhotos)
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField(photos, setPhotos)}
                    className="text-blue-500 hover:underline"
                >
                    Add another photo
                </button>
                </div>
        
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
        
                {/* Online Press */}
                <div>
                <label className="block text-lg font-medium mb-1">Online Press URLs</label>
                {onlinePress.map((url, index) => (
                    <input
                    key={index}
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) =>
                        handleArrayChange(index, e.target.value, onlinePress, setOnlinePress)
                    }
                    className="w-full border rounded px-3 py-2 mb-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayField(onlinePress, setOnlinePress)}
                    className="text-blue-500 hover:underline"
                >
                    Add another online press link
                </button>
                </div>
        
                <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                Create Profile
                </button>
            </form>
        </div>
    )
}
