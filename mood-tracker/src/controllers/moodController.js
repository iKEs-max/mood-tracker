const Log = require('../models/Log');
const calculateCorrelation = require('../utils/statsEngine');

// Log today's mood and habits
exports.logMood = async (req, res) => {
    try {
        const { anonymousId, mood, sleepHours, exerciseMinutes, socialMediaHours } = req.body;
        
        // Prevent duplicate logs for the same day (simplified for demo)
        const newLog = new Log({ anonymousId, mood, sleepHours, exerciseMinutes, socialMediaHours });
        await newLog.save();
        
        res.status(201).json({ message: 'Mood logged anonymously!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log mood' });
    }
};

// Get global psychological insights
exports.getInsights = async (req, res) => {
    try {
        const logs = await Log.find();
        if (logs.length < 2) return res.json({ message: "Not enough data yet" });

        // Extract arrays for our math
        const moods = logs.map(l => l.mood);
        const sleep = logs.map(l => l.sleepHours);
        const exercise = logs.map(l => l.exerciseMinutes);
        const socialMedia = logs.map(l => l.socialMediaHours);

        // Run correlation algorithm
        const sleepCorrelation = calculateCorrelation(moods, sleep);
        const exerciseCorrelation = calculateCorrelation(moods, exercise);
        const socialMediaCorrelation = calculateCorrelation(moods, socialMedia);

        res.json({
            totalEntries: logs.length,
            insights: {
                sleep: { correlation: sleepCorrelation.toFixed(2), description: "Positive correlation means more sleep = better mood." },
                exercise: { correlation: exerciseCorrelation.toFixed(2), description: "Positive correlation means more exercise = better mood." },
                socialMedia: { correlation: socialMediaCorrelation.toFixed(2), description: "Negative correlation means more social media = worse mood." }
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch insights' });
    }
};