import React, { useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useParams } from "react-router-dom";
import { PageWrapper } from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
    const apiBaseUrl = useContext(ApiContext);
    // Define navigate
    const navigate = useNavigate(); 

    // State variables for single fields:
    const [contractData, setContractData] = useState({

    })
    const { contract_id } = useParams(); // Gets the "contract_id" from the URL (e.g., /contract/1/event...
    const [name, setName] = useState("");
    const [profileOfferorId, setProfileOfferorId] = useState("");
    const [profileOffereeId, setProfileOffereeId] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [arrive, setArrive] = useState("");
    const [stageSet, setStageSet] = useState("");
    const [stageCheck, setStageCheck] = useState("");
    const [cateringOpen, setCateringOpen] = useState("");
    const [cateringClose, setCateringClose] = useState("");
    const [mealTime, setMealTime] = useState("");
    const [mealLocationName, setMealLocationName] = useState("");
    const [mealLocationAddress, setMealLocationAddress] = useState("");
    const [accommodationId, setAccommodationId] = useState("");


    // Submit handler that sends a POST request to the API
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the payload to match the API's expected dictionary:
        const payload = {
            contract_id,
            name,
            profile_offeror_id: profileOfferorId,
            profile_offeree_id: profileOffereeId,
            contact_person: contactPerson || null,
            contact_phone: contactPhone || null,
            date,
            duration,
            start: start,
            end: end,
            arrive,
            stage_set: stageSet,
            stage_check: stageCheck,
            catering_open: cateringOpen || null,
            catering_close: cateringClose || null,
            meal_time: mealTime || null,
            meal_location_name: mealLocationName || null,
            meal_location_address: mealLocationAddress || null,
            accommodation_id: accommodationId  || null
        };
        
        try {
            // Get the token from localStorage; adjust retrieval as necessary.
            const token = localStorage.getItem("token");
            

            const response = await fetch(`${apiBaseUrl}/event`, {
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

            if (data && data.event_id) {
                console.log("Profile created successfully:", data);
                // Optionally show a success message or redirect the user
                alert("Profile created successfully!");
                // Redirect to profile/{ profile_id: 1 }, redirect:
                navigate(`/contract/${data.contract_id}/event/${data.event_id}`);
            } else {
                throw new Error("Missing event ID in API response.");
            }
        } 
        
        catch (error) {
        console.error("Error creating event:", error);
        // Optionally display an error message to the user
        alert(`Error creating event: ${error.message}`);
        } 
    }

    // ✅ RETURN the JSX to ensure React renders it
    return (
        <PageWrapper 
            pageName={"Create Event"}
            htmlContent={
                <CreateEventContent
                name={name} setName={setName}
                profileOfferorId={profileOfferorId} setProfileOfferorId={setProfileOfferorId}
                profileOffereeId={profileOffereeId} setProfileOffereeId={setProfileOffereeId}
                contactPerson={contactPerson} setContactPerson={setContactPerson}
                contactPhone={contactPhone} setContactPhone={setContactPhone}
                date={date} setDate={setDate}
                duration={duration} setDuration={setDuration}
                start={start} setStart={setStart}
                end={end} setEnd={setEnd}
                arrive={arrive} setArrive={setArrive}
                stageSet={stageSet} setStageSet={setStageSet}
                stageCheck={stageCheck} setStageCheck={setStageCheck}
                cateringOpen={cateringOpen} setCateringOpen={setCateringOpen}
                cateringClose={cateringClose} setCateringClose={setCateringClose}
                mealTime={mealTime} setMealTime={setMealTime}
                mealLocationName={mealLocationName} setMealLocationName={setMealLocationName}
                mealLocationAddress={mealLocationAddress} setMealLocationAddress={setMealLocationAddress}
                accommodationId={accommodationId} setAccommodationId={setAccommodationId}

                handleSubmit={handleSubmit}

                />
            }
        />
    );
}

function CreateEventContent({
    name, setName,
    profileOfferorId, setProfileOfferorId,
    profileOffereeId, setProfileOffereeId,
    contactPerson, setContactPerson,
    contactPhone, setContactPhone,
    date, setDate,
    duration, setDuration,
    start, setStart,
    end, setEnd,
    arrive, setArrive,
    stageSet, setStageSet,
    stageCheck, setStageCheck,
    cateringOpen, setCateringOpen,
    cateringClose, setCateringClose,
    mealTime, setMealTime,
    mealLocationName, setMealLocationName,
    mealLocationAddress, setMealLocationAddress,
    accommodationId, setAccommodationId,
    handleSubmit
}) {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Event Name */}
                <div>
                    <label htmlFor="name" className="block text-lg font-medium mb-1">Event Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Profile Offeror ID */}
                <div>
                    <label htmlFor="profileOfferorId" className="block text-lg font-medium mb-1">Profile Offeror ID</label>
                    <input
                        id="profileOfferorId"
                        type="number"
                        value={profileOfferorId}
                        onChange={(e) => setProfileOfferorId(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Profile Offeree ID */}
                <div>
                    <label htmlFor="profileOffereeId" className="block text-lg font-medium mb-1">Profile Offeree ID</label>
                    <input
                        id="profileOffereeId"
                        type="number"
                        value={profileOffereeId}
                        onChange={(e) => setProfileOffereeId(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Contact Person */}
                <div>
                    <label htmlFor="contactPerson" className="block text-lg font-medium mb-1">Contact Person</label>
                    <input
                        id="contactPerson"
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Contact Phone */}
                <div>
                    <label htmlFor="contactPhone" className="block text-lg font-medium mb-1">Contact Phone</label>
                    <input
                        id="contactPhone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Event Date */}
                <div>
                    <label htmlFor="date" className="block text-lg font-medium mb-1">Event Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Duration */}
                <div>
                    <label htmlFor="duration" className="block text-lg font-medium mb-1">Duration (ISO Format PT1H30M)</label>
                    <input
                        id="duration"
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Start Time */}
                <div>
                    <label htmlFor="start" className="block text-lg font-medium mb-1">Start Time</label>
                    <input
                        id="start"
                        type="time"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* End Time */}
                <div>
                    <label htmlFor="end" className="block text-lg font-medium mb-1">End Time</label>
                    <input
                        id="end"
                        type="time"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Arrival Time */}
                <div>
                    <label htmlFor="arrive" className="block text-lg font-medium mb-1">Arrival Time</label>
                    <input
                        id="arrive"
                        type="datetime-local"
                        value={arrive}
                        onChange={(e) => setArrive(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Stage Set Time */}
                <div>
                    <label htmlFor="stageSet" className="block text-lg font-medium mb-1">Stage Set Time</label>
                    <input
                        id="stageSet"
                        type="time"
                        value={stageSet}
                        onChange={(e) => setStageSet(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Stage Check Time */}
                <div>
                    <label htmlFor="stageCheck" className="block text-lg font-medium mb-1">Stage Check Time</label>
                    <input
                        id="stageCheck"
                        type="time"
                        value={stageCheck}
                        onChange={(e) => setStageCheck(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Catering Open Time */}
                <div>
                    <label htmlFor="cateringOpen" className="block text-lg font-medium mb-1">Catering Open Time</label>
                    <input
                        id="cateringOpen"
                        type="time"
                        value={cateringOpen}
                        onChange={(e) => setCateringOpen(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Catering Close Time */}
                <div>
                    <label htmlFor="cateringClose" className="block text-lg font-medium mb-1">Catering Close Time</label>
                    <input
                        id="cateringClose"
                        type="time"
                        value={cateringClose}
                        onChange={(e) => setCateringClose(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Meal Time */}
                <div>
                    <label htmlFor="mealTime" className="block text-lg font-medium mb-1">Meal Time</label>
                    <input
                        id="mealTime"
                        type="time"
                        value={mealTime}
                        onChange={(e) => setMealTime(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Meal Location Name */}
                <div>
                    <label htmlFor="mealLocationName" className="block text-lg font-medium mb-1">Meal Location Name</label>
                    <input
                        id="mealLocationName"
                        type="text"
                        value={mealLocationName}
                        onChange={(e) => setMealLocationName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Meal Location Address */}
                <div>
                    <label htmlFor="mealLocationAddress" className="block text-lg font-medium mb-1">Meal Location Address</label>
                    <input
                        id="mealLocationAddress"
                        type="text"
                        value={mealLocationAddress}
                        onChange={(e) => setMealLocationAddress(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Accommodation ID */}
                <div>
                    <label htmlFor="accommodationId" className="block text-lg font-medium mb-1">Accommodation ID</label>
                    <input
                        id="accommodationId"
                        type="number"
                        value={accommodationId}
                        onChange={(e) => setAccommodationId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Create Event
                </button>
            </form>
        </div>
    )
}