import React, { useState, useEffect } from 'react';
import axios from './axios';  // Ensure this points to your configured axios instance with baseURL
import './EventCards.css';

const EventCards = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get("/events");
            console.log("Full Axios response:", response);
            setEvents(response.data);  // Set the events with the data received from the server
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
        
    };

    return (
        
        <div className="eventCards">
            <div className="eventCards__container">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event._id} className="card">
                            <div className="card__info">
                                <h3>{event.name}</h3>
                                <p>Description: {event.description}</p>
                                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                                <p>Attendees: {event.attendees.length}/{event.maxAttendees}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No events found or loading events...</p>  // Display this text while loading or if no events are found
                )}
            </div>
        </div>
    );
};

export default EventCards;
