const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mqtt = require('mqtt'); // Import MQTT module
const userRoutes = require('./routes/user');
const motorRoutes = require('./routes/motor');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes); // Routes for user management
app.use('/api/motors', motorRoutes); // Routes for motors

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/pumpControl', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Connect to the MQTT broker
const brokerUrl = 'mqtt://pompe@broker.emqx.io:1883';
const options = {
  username: 'asma',
  password: '0000'
};
const mqttClient = mqtt.connect(brokerUrl, options);
const topics = ["/andons/c2i/mqtt", "Test/Ma2"];
mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  topics.forEach((topic) => {
    mqttClient.subscribe(topic);
  });
});

mqttClient.on("message", (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  const data = JSON.parse(message.toString());
  // Add your logic for handling the MQTT messages
});

mqttClient.on("error", (error) => {
  console.error("MQTT client error:", error);
});

mqttClient.on("close", () => {
  console.log("Disconnected from MQTT broker");
});

mqttClient.on("offline", () => {
  console.error("MQTT client is offline");
});
// Endpoint to control motors via MQTT
app.post('/api/motors/control', (req, res) => {
  const { motorId, status } = req.body;
  const topic = `pump/control/${motorId}`;
  const message = status === 'on' ? '1' : '0';

  mqttClient.publish(topic, message, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to publish message' });
    }
    res.status(200).json({ message: 'Command sent successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
