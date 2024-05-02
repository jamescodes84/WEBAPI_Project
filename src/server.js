import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import User from './models/User.js';
import Business from './models/Business.js';
import Event from './models/Event.js';

const app = express();
const port = process.env.PORT || 8001;
const connection_url = 'mongodb+srv://jrmusicman333:0987654321@webapi.gja3bzn.mongodb.net/?retryWrites=true&w=majority&appName=webapi';

app.use(express.json());
app.use(Cors());

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Routes
app.post('/user', (req, res) => {
    User.create(req.body, (err, user) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(user);
    });
});

app.get('/users', (req, res) => {
    User.find({})
        .sort({ firstName: 1 }) // Continue sorting by firstName
        .populate('events') // Populate the 'events' field with the Event documents
        .exec((err, users) => {
            if (err) {
                return res.status(500).send(err);
            }
            // Map through each user and reformat the object with the address and events listed
            const formattedUsers = users.map(user => {
                const { address, _id, firstName, lastName, email, phone, __v, birthdate, events } = user.toObject();
                return { _id, firstName, lastName, email, phone, birthdate, events, __v, address }; // Include events and place address last
            });
            res.status(200).send(formattedUsers);
        });
});



app.get('/user/:id', (req, res) => {
    User.findById(req.params.id)
        .exec((err, user) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            // Reformat the user object to place the address last
            const { address, _id, firstName, lastName, email, phone, __v } = user.toObject();
            const reorderedUser = { _id, firstName, lastName, email, phone, __v, address };
            res.status(200).send(reorderedUser);
        });
});


app.put('/user/:id', (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, user) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).send(err);
        }
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        // Reconstruct the user object to place address last
        const { address, _id, firstName, lastName, email, phone, __v, events } = user.toObject();
        const reorderedUser = { _id, firstName, lastName, email, phone, __v, address, events };
        res.status(200).send(reorderedUser);
    });
});

app.delete('/user/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send('User deleted');
    });
});

// Business Routes
app.post('/business', (req, res) => {
    // Prepare the new business data with an empty events list
    const newBusinessData = {
        ...req.body,   // Spread the existing body to maintain other fields
        events: []     // Initialize the events list as empty
    };

    // Create a new business entry in the database
    Business.create(newBusinessData, (err, business) => {
        if (err) {
            // Handle errors that occur during the creation, like validation errors or MongoDB operational errors
            return res.status(500).send(err);
        }
        // If the business is successfully created, return the new business data with a 201 status code
        res.status(201).send(business);
    });
});


app.get('/businesses', (req, res) => {
    Business.find({})
    .populate('events') // This line is added to include event details referenced by the 'events' field
    .exec((err, businesses) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Map through each business and reorder the properties with _id first
        const reformattedBusinesses = businesses.map(business => {
            const { _id, name, phone, email, website, registrationDate, __v, address, events } = business.toObject();
            return { 
                _id,  // Placing _id first
                name, 
                phone, 
                email, 
                website, 
                registrationDate,
                events, // Including events in the response
                __v, 
                address  // Keeping address last as previously desired
            };
        });

        res.status(200).send(reformattedBusinesses);
    });
});



app.get('/business/:id', (req, res) => {
    Business.findById(req.params.id, (err, business) => {
        if (err) {
            console.error('Error fetching business:', err);
            return res.status(500).send(err);
        }
        if (!business) {
            return res.status(404).send({ message: 'Business not found' });
        }
        
        // Reconstruct the business object to place _id first
        const { _id, name, phone, email, website, registrationDate, __v, address } = business.toObject();
        const reorderedBusiness = { 
            _id,
            name, 
            phone, 
            email, 
            website, 
            registrationDate, 
            __v, 
            address 
        };
        
        res.status(200).send(reorderedBusiness);
    });
});



app.put('/business/:id', (req, res) => {
    // Using findOneAndUpdate to update the business document
    Business.findOneAndUpdate(
        { _id: req.params.id }, // filter by Document ID
        { $set: req.body }, // update the fields provided in req.body
        { new: true, runValidators: true }, // options to return the updated document and run validators
        (err, business) => {
            if (err) {
                // Handle any errors during the update
                return res.status(500).send(err);
            }
            if (!business) {
                // Handle case where no business was found for the given ID
                return res.status(404).send({ message: 'Business not found' });
            }
            // Send the updated business document as a response
            res.status(200).send(business);
        }
    );
});



app.delete('/business/:id', (req, res) => {
    Business.findByIdAndDelete(req.params.id, (err, business) => {
        if (err) {
            console.error('Error deleting business:', err);
            return res.status(500).send(err);
        }
        if (!business) {
            return res.status(404).send({ message: 'Business not found' });
        }
        res.status(200).send({ message: 'Business successfully deleted' });
    });
});


// Event Routes

app.post('/events', (req, res) => {
    const { maxAttendees, attendees } = req.body;

    // Check if the initial number of attendees exceeds the maximum allowed
    if (attendees && maxAttendees && attendees.length > maxAttendees) {
        return res.status(400).send({
            message: "Number of initial attendees cannot exceed the maximum allowed."
        });
    }

    // Create a new event
    Event.create(req.body, (err, event) => {
        if (err) {
            return res.status(500).send(err);
        }
        // Retrieve and send the updated list of events
        Event.find({}, (err, events) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(201).send(events); // Send the full list of events including the newly created one
        });
    });
});



app.get('/events', (req, res) => {
    Event.find({}).populate('business').populate('attendees').exec((err, events) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(events);
    });
});

app.put('/events/:id', (req, res) => {
    Event.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, event) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!event) {
            return res.status(404).send({ message: "Event not found" });
        }
        res.status(200).send(event);
    });
});


app.delete('/events/:id', (req, res) => {
    Event.findByIdAndDelete(req.params.id, (err, event) => {
        if (err) return res.status(500).send(err);
        res.status(204).send('Event deleted');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Listening on localhost: ${port}`);
});
