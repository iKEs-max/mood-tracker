const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    anonymousId: String, // Random string for privacy
    mood: Number, // 1 to 10 (1 = terrible, 10 = amazing)
    sleepHours: Number,
    exerciseMinutes: Number,
    socialMediaHours: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);