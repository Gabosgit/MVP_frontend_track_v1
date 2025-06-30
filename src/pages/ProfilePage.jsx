import React, { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useParams } from "react-router-dom";
import Content from "../components/Content";
import ShowMoreContainer from "../components/ShowMoreContainer";

  
export default function ProfilePage() {
  const apiBaseUrl = useContext(ApiContext);
  const { id } = useParams(); // Gets the "id" from the URL (e.g., /profile/1)
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setLoading(false);
      }
    }

    fetchProfile(profile);
  }, [id]);
  
  console.log(profile)

  // ✅ RETURN the JSX to ensure React renders it
  return (
    <Content 
      pageName={"Profile"}
      loading={loading} 
      error={error}
      htmlContent={<ProfileContent profile={profile} />} 
    />
  );

}


function ProfileContent({ profile }) {
  if (!profile) 
    return <div className="text-gray-500">No profile data available.</div>;

  return (
    <div className="max-w-5xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section*/}
        <header className="rounded-3xl  p-10 mb-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">{profile.name}</h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-700 mb-6">{profile.performance_type}</p>
            <p className="text-gray-700 text-justify text-lg sm:text-xl leading-relaxed">
                {profile.description}
            </p>
        </header>


        {/* Online Presence Section */}
        <section className="-2 border-slate-300 rounded-3xl p-10 mb-8">
            <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">Online Presence</h2>
            <div className="flex flex-wrap justify-center items-center mb-4">
                <a href="https://www.janedoeofficial.com" target="_blank" className="inline-flex items-center bg-indigo-700 text-white py-3 px-6 rounded-xl no-underline transition-colors duration-200 ease-in-out transform font-semibold mr-3 mb-3 hover:bg-indigo-500 hover:-translate-y-0.5">
                    <i className="fas fa-globe mr-2"></i> Website
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

        {/* Media Gallery Section */}
        <section className=" rounded-3xl  p-10 mb-8">
            <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
                Media Gallery
            </h2>

            <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 mt-6">Photos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                {/* Placeholder Photos */}
                {/* Use a conditional check to ensure profile.photos exists and is an array */}
                {profile.photos && profile.photos.length > 0 ? (
                    profile.photos.map((photoUrl, index) => (
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

            <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 mt-6">Videos</h3>
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

            <h3 className="text-xl font-semibold text-center text-gray-800 mb-3 mt-6">Audios</h3>
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
        </section>

        {/* Bio Section */}
        <section className=" rounded-3xl  p-10 mb-8">
            <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
              Biography
            </h2>
            <ShowMoreContainer text={profile.bio}/>
        </section>

        {/* Press Online */}
        <section className=" rounded-3xl  p-10 mb-8">
            <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">
              Press (online)
            </h2>
            {profile.online_press.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {profile.online_press.map((item, index) => (
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
        </section>

        {/* Technic Section */}
        <section className=" rounded-3xl  p-10 mb-8">
            <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 -2 border-gray-200 pb-3">Technical Section</h2>
            <div className="flex flex-wrap justify-center">
                <a href="https://www.example.com/stage_plan.pdf" target="_blank" className="inline-flex items-center bg-indigo-700 text-white py-3 px-6 rounded-xl no-underline transition-colors duration-200 ease-in-out transform font-semibold mr-3 mb-3 hover:bg-indigo-500 hover:-translate-y-0.5">
                    <i className="fas fa-ruler-combined mr-2"></i> Stage Plan
                </a>
                <a href="https://www.example.com/tech_rider.pdf" target="_blank" className="inline-flex items-center bg-indigo-700 text-white py-3 px-6 rounded-xl no-underline transition-colors duration-200 ease-in-out transform font-semibold mr-3 mb-3 hover:bg-indigo-500 hover:-translate-y-0.5">
                    <i className="fas fa-file-invoice mr-2"></i> Tech Rider
                </a>
            </div>
        </section>

    </div>

  );
}


