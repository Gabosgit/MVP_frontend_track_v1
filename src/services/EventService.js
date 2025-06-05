export async function fetchEvent(eventId, apiBaseUrl) {
    try {
        const token = localStorage.getItem("token");

        // Fetch event
        const eventResponse = await fetch(`${apiBaseUrl}/event/${eventId}`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
    
        if (!eventResponse.ok) {
            const errorData = await eventResponse.json(); // Extract JSON error response
            throw new Error(`${eventResponse.status}: ${errorData.message || "Unable to fetch event."}`);
            }
    
        const eventData = await eventResponse.json();

        return eventData;
    }

    catch (err) {
        throw new Error(err.message);
    }
}