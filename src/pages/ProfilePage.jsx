import React, { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useParams } from "react-router-dom";
import Content from "../components/Content";

  
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

    fetchProfile();
  }, [id]);

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
    <>
      <div className="max-w-3xl mx-auto p-6">
          <h2 className="text-4xl font-bold mb-6">{profile.name}</h2>
          <p>
              <strong>Performance Type:</strong> {profile.performance_type}
          </p>
          <p>
              <strong>Description:</strong> {profile.description}
          </p>
          <p>
              <strong>Bio:</strong> {profile.bio}
          </p>

          <div className="max-w-3xl mx-auto p-6 space-y-6">

              {/* Social Media Section */}
              <div className="border-t-1 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="font-bold text-lg md:col-span-1">
                    Social Media:
                  </div>
                  <div className="md:col-span-2 text-right">
                  <ul className="ml-4">
                      {profile.social_media.map((link, index) => (
                      <li key={index} className="mb-1">
                          <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                          >
                          {link}
                          </a>
                      </li>
                      ))}
                  </ul>
                  </div>
              </div>

              {/* Website Section */}
              <div className="border-t-1 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="font-bold text-lg md:col-span-1">
                    Website:
                  </div>
                  <div className="md:col-span-2 text-right">
                      <ul className="ml-4">
                          <li className="mb-1">
                              <a
                              href= {profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                              >
                                  {profile.website}
                              </a>
                          </li>
                      </ul>
                  </div>
              </div>


              {/* Photos Section */}
              <div className="border-t-1 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="font-bold text-lg md:col-span-1">
                    Photos:
                  </div>
                  <div className="md:col-span-2 text-right">
                  <ul className="ml-4">
                      {profile.photos.map((url, index) => (
                      <li key={index} className="mb-1">
                          <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                          >
                          {url}
                          </a>
                      </li>
                      ))}
                  </ul>
                  </div>
              </div>

              {/* Audios Section */}
              <div className="border-t-1 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  {/* Left column: Label */}
                  <div className="font-bold text-lg md:col-span-1">
                    Audios:
                  </div>
                  {/* Right column: List of audio URLs */}
                  <div className="md:col-span-2 text-right">
                  <ul className="ml-4">
                      {profile.audios.map((url, index) => (
                      <li key={index} className="mb-1">
                          <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                          >
                          {url}
                          </a>
                      </li>
                      ))}
                  </ul>
                  </div>
              </div>

              {/* Videos Section */}
              <div className="border-t-1 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="font-bold text-lg md:col-span-1">
                    Videos:
                  </div>
                  <div className="md:col-span-2 text-right">
                  <ul className="ml-4">
                      {profile.videos.map((url, index) => (
                      <li key={index} className="mb-1">
                          <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                          >
                          {url}
                          </a>
                      </li>
                      ))}
                  </ul>
                  </div>
              </div>

              {/* Stage Plan Section */}
              <div className="border-t-1 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="font-bold text-lg md:col-span-1">
                    Stage Plan:
                  </div>
                  <div className="md:col-span-2 text-right">
                      <ul className="ml-4">
                          <li className="mb-1">
                              <a
                              href= {profile.stage_plan}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                              >
                                  {profile.stage_plan}
                              </a>
                          </li>
                      </ul>
                  </div>
              </div>


              {/* Tech Rider Section */}
              <div className="border-t-1 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="font-bold text-lg md:col-span-1">
                    Tech Rider:
                  </div>
                  <div className="md:col-span-2 text-right">
                      <ul className="ml-4">
                          <li className="mb-1">
                              <a
                              href= {profile.tech_rider}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                              >
                                  {profile.tech_rider}
                              </a>
                          </li>
                      </ul>
                  </div>
              </div>

              {/* Online Press Section */}
              <div className="border-t-1 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="font-bold text-lg md:col-span-1">
                    Online Press:
                  </div>
                  <div className="md:col-span-2 text-right">
                    <ul className="ml-4">
                        {profile.online_press.map((url, index) => (
                        <li key={index} className="mb-1">
                            <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                            >
                            {url}
                            </a>
                        </li>
                        ))}
                    </ul>
                  </div>
              </div>


          </div>          
      </div>
  </>

  );
}


