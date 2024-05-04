import React, { useState, useEffect } from 'react'
import EventCard from 'react-tinder-card'  // Reusing the Tinder card layout for events
import './EventCards.css'
import axios from '../dating-app-frontend/src/components/axios'

const EventCards = () => {
    const [events, setEvents] = useState([])

    useEffect(() => {
        async function fetchData() {
            const req = await axios.get("/events/cards")
            setEvents(req.data)
        }
        fetchData()
    }, [])

    const swiped = (direction, eventId) => {
        console.log("You swiped " + direction + " on " + eventId)
    }

    const outOfFrame = (name) => {
        console.log(name + " event left the screen!")
    }

    return (
        <div className="eventCards">
            <div className="eventCards__container">
                {events.map((event) => (
                    <EventCard 
                        className="swipe"
                        key={event._id}  // Using unique _id for key
                        preventSwipe={['up', 'down']}
                        onSwipe={(dir) => swiped(dir, event._id)}
                        onCardLeftScreen={() => outOfFrame(event.name)} 
                    >
                        <div style={{ backgroundImage: `url(${event.imgUrl || 'default-image.jpg'})` }} className="card">
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p>Attendees: {event.attendees.length}/{event.maxAttendees}</p>
                        </div>
                    </EventCard>
                ))}
            </div>
        </div>
    )
}

export default EventCards
