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
        .sort({ firstName: 1 }) // Assuming you're still sorting by firstName
        .exec((err, users) => {
            if (err) {
                return res.status(500).send(err);
            }
            // Map through each user and reconstruct the object with address last
            const formattedUsers = users.map(user => {
                const { address, _id, firstName, lastName, email, phone, __v } = user.toObject();
                return { _id, firstName, lastName, email, phone, __v, address };
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
        const { address, _id, firstName, lastName, email, phone, __v } = user.toObject();
        const reorderedUser = { _id, firstName, lastName, email, phone, __v, address };
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
    Business.create(req.body, (err, business) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(business);
    });
});

app.get('/businesses', (req, res) => {
    Business.find({}, (err, businesses) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Map through each business and reorder the properties with _id first
        const reformattedBusinesses = businesses.map(business => {
            const { _id, name, phone, email, website, registrationDate, __v, address } = business.toObject();
            return { 
                _id,  // Placing _id first
                name, 
                phone, 
                email, 
                website, 
                registrationDate, 
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
    Business.findOneAndUpdate(
        { _id: req.params.id }, 
        { $set: req.body },  // Use $set to update only the provided fields
        { new: true, runValidators: true },  // Ensure new document is returned and validators run
        (err, business) => {
            if (err) return res.status(500).send(err);
            if (!business) {
                return res.status(404).send({ message: 'Business not found' });
            }
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
    Event.create(req.body, (err, event) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(event);
    });
});

app.get('/events', (req, res) => {
    Event.find({}).populate('business').populate('attendees').exec((err, events) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(events);
    });
});

app.put('/events/:id', (req, res) => {
    Event.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, overwrite: true }, (err, event) => {
        if (err) return res.status(500).send(err);
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
