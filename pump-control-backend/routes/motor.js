const express = require('express');
const Motor = require('../models/Motor');
const router = express.Router();

router.post('/create', async (req, res) => {
  const { name, ref, status } = req.body;
  try {
    const newMotor = new Motor({ name, ref, status: status || 'off' });
    await newMotor.save();
    res.status(201).json({ message: 'Motor created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create motor' });
  }
});
router.post('/schedule', async (req, res) => {
  const { motorId, date, heure } = req.body;
  console.log('Received data:', { motorId, date, heure }); // Add this line
  try {
    const motor = await Motor.findById(motorId);
    if (!motor) {
      return res.status(404).json({ error: 'Motor not found' });
    }
    motor.date = date;
    motor.heure = heure;
    await motor.save();
    res.status(200).json({ message: 'Motor schedule updated successfully' });
  } catch (error) {
    console.error('Error updating motor schedule:', error); // Add this line
    res.status(400).json({ error: 'Failed to update motor schedule' });
  }
});


router.get('/', async (req, res) => {
  try {
    const motors = await Motor.find();
    res.json(motors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/control', async (req, res) => {
  const { motorId, status } = req.body;
  try {
    const motor = await Motor.findById(motorId);
    if (!motor) {
      return res.status(404).json({ error: 'Motor not found' });
    }
    motor.status = status;
    await motor.save();
    res.status(200).json({ message: 'Motor status updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update motor status' });
  }
});

module.exports = router;
