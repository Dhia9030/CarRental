# Backend Implementation Guide

This guide provides instructions for implementing the backend services required by the car rental agency platform.

## Table of Contents

1. [REST API Implementation](#rest-api-implementation)
2. [Server-Sent Events (SSE) Implementation](#server-sent-events-sse-implementation)
3. [WebSocket Implementation](#websocket-implementation)

## REST API Implementation

The frontend expects a REST API with the following endpoints:

### Cars Endpoints

\`\`\`javascript
// Example implementation using Express.js
const express = require('express');
const router = express.Router();

// GET /cars - Get all cars
router.get('/cars', async (req, res) => {
  try {
    // Fetch cars from database
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /cars/:id - Get a specific car
router.get('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /cars - Create a new car
router.post('/cars', async (req, res) => {
  try {
    const car = new Car(req.body);
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH /cars/:id - Update a car
router.patch('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /cars/:id - Delete a car
router.delete('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
\`\`\`

### Bookings Endpoints

\`\`\`javascript
// Example implementation using Express.js
const express = require('express');
const router = express.Router();

// GET /bookings - Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /bookings/:id - Get a specific booking
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /bookings - Create a new booking
router.post('/bookings', async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      status: 'Pending',
      createdAt: new Date().toISOString()
    });
    const newBooking = await booking.save();
    
    // Notify the agency about the new booking
    notificationService.createNotification({
      type: 'BOOKING',
      title: 'New Booking',
      message: `New booking request for ${req.body.carId}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      data: { booking: newBooking }
    });
    
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH /bookings/:id - Update a booking
router.patch('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Notify the agency about the booking status change
    if (req.body.status) {
      notificationService.createNotification({
        type: 'BOOKING',
        title: 'Booking Updated',
        message: `Booking #${booking.id} status changed to ${booking.status}`,
        isRead: false,
        createdAt: new Date().toISOString(),
        data: { booking }
      });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
\`\`\`

### Reviews Endpoints

\`\`\`javascript
// Example implementation using Express.js
const express = require('express');
const router = express.Router();

// GET /reviews - Get all reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /reviews/:id - Get a specific review
router.get('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /reviews - Create a new review
router.post('/reviews', async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      createdAt: new Date().toISOString()
    });
    const newReview = await review.save();
    
    // Notify the agency about the new review
    notificationService.createNotification({
      type: 'REVIEW',
      title: 'New Review',
      message: `New ${newReview.rating}-star review for car ${newReview.carId}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      data: { review: newReview }
    });
    
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
\`\`\`

### Notifications Endpoints

\`\`\`javascript
// Example implementation using Express.js
const express = require('express');
const router = express.Router();

// GET /notifications - Get all notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /notifications/:id/read - Mark a notification as read
router.post('/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /notifications/read-all - Mark all notifications as read
router.post('/notifications/read-all', async (req, res) => {
  try {
    await Notification.updateMany({}, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
\`\`\`

## Server-Sent Events (SSE) Implementation

The frontend expects an SSE endpoint for real-time notifications.

\`\`\`javascript
// Example implementation using Express.js
const express = require('express');
const router = express.Router();

// GET /notifications/sse - SSE endpoint for real-time notifications
router.get('/notifications/sse', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send a comment to keep the connection alive
  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);
  
  // Function to send a notification to the client
  const sendNotification = (notification) => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  };
  
  // Add this client to the list of connected clients
  notificationService.addClient(sendNotification);
  
  // Clean up when the client disconnects
  req.on('close', () => {
    clearInterval(keepAlive);
    notificationService.removeClient(sendNotification);
  });
});

module.exports = router;
\`\`\`

### Notification Service

\`\`\`javascript
// Example implementation of a notification service
class NotificationService {
  constructor() {
    this.clients = new Set();
  }
  
  // Add a client to the list of connected clients
  addClient(client) {
    this.clients.add(client);
  }
  
  // Remove a client from the list of connected clients
  removeClient(client) {
    this.clients.delete(client);
  }
  
  // Create a new notification and send it to all connected clients
  async createNotification(notification) {
    // Save the notification to the database
    const newNotification = new Notification(notification);
    await newNotification.save();
    
    // Send the notification to all connected clients
    this.clients.forEach(client => {
      client(newNotification);
    });
    
    return newNotification;
  }
}

const notificationService = new NotificationService();
module.exports = notificationService;
\`\`\`

## WebSocket Implementation

The frontend expects a WebSocket endpoint for real-time chat.

\`\`\`javascript
// Example implementation using ws and Express.js
const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws/chat' });

// Store connected clients
const clients = new Map();

wss.on('connection', (ws) => {
  // Generate a unique ID for this client
  const clientId = Date.now().toString();
  
  // Store the client
  clients.set(clientId, {
    ws,
    isAdmin: false, // Determine if this is an admin or agency
  });
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      // Add a server-generated ID and timestamp if not provided
      const chatMessage = {
        id: data.id || Date.now().toString(),
        sender: data.sender,
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      
      // Broadcast the message to all connected clients
      clients.forEach((client) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify(chatMessage));
        }
      });
      
      // Optionally, store the message in a database
      // ...
      
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    clients.delete(clientId);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
\`\`\`

This completes the backend implementation guide. Make sure to adapt these examples to your specific backend technology stack and requirements.
