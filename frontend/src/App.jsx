import { useState, useEffect } from 'react';
import api from './services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function App() {
    const [logData, setLogData] = useState({ mood: 5, sleepHours: 6, exerciseMinutes: 20, socialMediaHours: 3 });
    const [insights, setInsights] = useState(null);
    const [chartData, setChartData] = useState([]);

    const fetchInsights = async () => {
        try {
            const res = await api.get('/insights');
            if (res.data.insights) {
                setInsights(res.data);
                setChartData([
                    { name: 'Sleep', correlation: parseFloat(res.data.insights.sleep.correlation) },
                    { name: 'Exercise', correlation: parseFloat(res.data.insights.exercise.correlation) },
                    { name: 'Social Media', correlation: parseFloat(res.data.insights.socialMedia.correlation) }
                ]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Generate a random anonymous ID for this demo
            const anonymousId = "anon_" + Math.random().toString(36).substr(2, 9);
            await api.post('/log', { ...logData, anonymousId });
            alert('Mood logged anonymously!');
            fetchInsights(); // Refresh stats
        } catch (error) {
            alert('Failed to log mood');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-purple-700 mb-8"> Anonymous Mood & Habit Tracker</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column: Log Form */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Log Your Day (Anonymous)</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Mood (1-10): {logData.mood}</label>
                            <input type="range" min="1" max="10" value={logData.mood} onChange={(e) => setLogData({...logData, mood: parseInt(e.target.value)})} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Sleep (hours)</label>
                            <input type="number" value={logData.sleepHours} onChange={(e) => setLogData({...logData, sleepHours: parseFloat(e.target.value)})} className="w-full p-2 border rounded-lg" step="0.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Exercise (minutes)</label>
                            <input type="number" value={logData.exerciseMinutes} onChange={(e) => setLogData({...logData, exerciseMinutes: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Social Media (hours)</label>
                            <input type="number" value={logData.socialMediaHours} onChange={(e) => setLogData({...logData, socialMediaHours: parseFloat(e.target.value)})} className="w-full p-2 border rounded-lg" step="0.5" />
                        </div>
                        <button type="submit" className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">Submit Anonymously</button>
                    </form>
                </div>

                {/* Right Column: Insights & Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Global Psychological Insights</h2>
                    
                    {!insights ? (
                        <p className="text-gray-400 text-center pt-10">Not enough data to calculate statistics yet. Log your day to contribute!</p>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 mb-4">Based on {insights.totalEntries} anonymous entries. (1.0 = Strong Positive, -1.0 = Strong Negative)</p>
                            
                            <div className="h-64 mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis domain={[-1, 1]} stroke="#64748b" />
                                        <Tooltip cursor={{fill: 'transparent'}} />
                                        <Bar dataKey="correlation" name="Correlation to Mood" radius={[4, 4, 0, 0]}>
                                            <Cell fill="#10b981" /> {/* Green for positive */}
                                            <Cell fill="#10b981" />
                                            <Cell fill="#ef4444" /> {/* Red for negative */}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-gray-600">
                                <p>💡 <strong>Sleep:</strong> {insights.insights.sleep.correlation} correlation with mood.</p>
                                <p>💡 <strong>Exercise:</strong> {insights.insights.exercise.correlation} correlation with mood.</p>
                                <p>💡 <strong>Social Media:</strong> {insights.insights.socialMedia.correlation} correlation with mood.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;