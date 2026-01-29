import React, { useState } from 'react';
import api from '../services/api';
import { Activity, Info } from 'lucide-react';

const BMICalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const calculateBMI = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);

        const h = Number(height);
        const w = Number(weight);

        if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
            setError('Please enter valid height and weight.');
            return;
        }

        try {
            const response = await api.post('/bmi/calculate', {
                height_cm: h,
                weight_kg: w
            });
            setResult(response.data);
        } catch (err) {
            console.error(err.response?.data || err);
            setError(
                err.response?.data?.detail ||
                'Something went wrong. Please try again.'
            );
        }
    };


    const getCategoryColor = (category) => {
        switch (category) {
            case 'Normal weight': return 'text-green-600 bg-green-100';
            case 'Overweight': return 'text-yellow-600 bg-yellow-100';
            case 'Obese': return 'text-red-600 bg-red-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">BMI Calculator</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Calculator Form */}
                <div className="bg-white p-8 rounded-xl shadow-lg h-fit">
                    <form onSubmit={calculateBMI} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Height (cm)</label>
                            <input
                                type="number"
                                placeholder="e.g. 175"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Weight (kg)</label>
                            <input
                                type="number"
                                placeholder="e.g. 70"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                        >
                            Calculate BMI
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-blue-600 animate-fade-in">
                            <h3 className="text-gray-500 font-medium uppercase tracking-wide mb-2">Your BMI</h3>
                            <div className="text-5xl font-bold text-gray-900 mb-4">{result.bmi}</div>

                            <div className={`inline-block px-4 py-2 rounded-full font-bold mb-6 ${getCategoryColor(result.category)}`}>
                                {result.category}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Info className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-gray-800">Health Tip</p>
                                        <p className="text-gray-600">{result.health_tip}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <p className="text-gray-500 text-sm">Ideal weight range for your height:</p>
                                    <p className="text-lg font-bold text-gray-800">{result.recommended_range}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center text-center h-full text-gray-500">
                            <Activity className="h-16 w-16 mb-4 opacity-20" />
                            <p>Enter your details to see your body mass index and health insights.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BMICalculator;
