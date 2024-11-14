const mongoose = require('mongoose');
const Day = require('../models/DayModel');

//CRUD
const createDay = async (req, res) => {
    const { name } = req.body;
    const newDay = new Day({
        name
    });
       
    try {
        await newDay.save();
        res.status(201).json(newDay);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el dia', error: err });
    }
};

const getAllDays = async (req, res) => {
    try {
        const days = await Day.find(); // Devuelve todas las rutinas
        res.status(200).json(days); // Devuelve las rutinas en formato JSON
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las rutinas', error: err });
    }
};

const getDay = async (req, res) => {
    const day = await Day.findById(req.params.id);
    res.json(day);
};

const updateDay = async (req, res) => {
    const day = await Day.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(day);
};

const deleteDay = async (req, res) => {
    await Day.findByIdAndDelete(req.params.id);
    res.json({ message: 'Day deleted' });
};


module.exports = { createDay, getAllDays, getDay, updateDay, deleteDay };


  

  