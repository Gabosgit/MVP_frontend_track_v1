import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useParams } from "react-router-dom";
import { fetchEvent } from "../services/EventService"; // Import the service
import Content from "../components/Content";


export default function EventPage() {
  const apiBaseUrl = useContext(ApiContext);
  const { contract_id } = useParams();
  const { event_id } = useParams();
  const [ eventData, setEventData ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const eventResponse = await fetchEvent(event_id, apiBaseUrl); // Call service
        setEventData(eventResponse);
      }
      catch (err) {
        if (err.message.includes("NetworkError")) {
            setError("Check your internet connection.");
        } else {
            setError(err.message);
          }
      } 
      finally {
        setLoading(false); // ✅ Ensures loading state is correctly updated
      }
    }

    getData();
  
  }, [event_id]);


  // ✅ RETURN the JSX to ensure React renders it
    return (
      <Content 
        pageTitle={"Event"}
        loading={loading} 
        error={error}
        htmlContent={<EventContent event={eventData}  />} 
      />
    );
}

function EventContent({event}) {
  return(
    <>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{event.name}</h1>

        <div className="space-y-4">
            <p><strong>Contract ID:</strong> {event.contract_id}</p>
            <p><strong>Profile Offeror ID:</strong> {event.profile_offeror_id}</p>
            <p><strong>Profile Offeree ID:</strong> {event.profile_offeree_id}</p>
            <p><strong>Contact Person:</strong> {event.contact_person}</p>
            <p><strong>Contact Phone:</strong> {event.contact_phone}</p>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Duration:</strong> {event.duration}</p>
            <p><strong>Start Time:</strong> {event.start}</p>
            <p><strong>End Time:</strong> {event.end}</p>
            <p><strong>Arrival:</strong> {event.arrive}</p>
            <p><strong>Stage Set:</strong> {event.stage_set}</p>
            <p><strong>Stage Check:</strong> {event.stage_check}</p>
            <p><strong>Catering Open:</strong> {event.catering_open}</p>
            <p><strong>Catering Close:</strong> {event.catering_close}</p>
            <p><strong>Meal Time:</strong> {event.meal_time}</p>
            <p><strong>Meal Location Name:</strong> {event.meal_location_name}</p>
            <p><strong>Meal Location Address:</strong> {event.meal_location_address}</p>
            <p>
              <strong>Accommodation ID: </strong>
              <span className={event.accommodation_id ? 'text-green-300' : 'text-orange-500'}>
                {event.accommodation_id ? event.accommodation_id.join(", ") : "No accommodation yet"}
              </span>
            </p>
        </div>
      </div>
    </>
  )
    
}