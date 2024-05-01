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
app.post('/users', (req, res) => {
    User.create(req.body, (err, user) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(user);
    });
});

app.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(users);
    });
});

app.put('/users/:id', (req, res) => {
    User.findOneAndUpdate({ email: req.params.email }, req.body, { new: true, overwrite: true }, (err, user) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(user);
    });
});

app.delete('/users/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) return res.status(500).send(err);
        res.status(204).send('User deleted');
    });
});

// Business Routes
app.post('/businesses', (req, res) => {
    Business.create(req.body, (err, business) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(business);
    });
});

app.get('/businesses', (req, res) => {
    Business.find({}, (err, businesses) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(businesses);
    });
});

app.put('/businesses/:id', (req, res) => {
    Business.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, overwrite: true }, (err, business) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(business);
    });
});

app.delete('/businesses/:id', (req, res) => {
    Business.findByIdAndDelete(req.params.id, (err, business) => {
        if (err) return res.status(500).send(err);
        res.status(204).send('Business deleted');
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
