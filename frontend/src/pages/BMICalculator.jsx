import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Activity, Info, Loader2, Scale, Ruler, ArrowRight, ShieldCheck } from 'lucide-react';

const BMICalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const response = await api.get('/bmi/latest');
                if (response.data) {
                    setHeight(response.data.height_cm);
                    setWeight(response.data.weight_kg);
                    setResult(response.data);
                }
            } catch (err) {
                console.error("Error fetching latest BMI", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    const calculateBMI = async (e) => {
        e.preventDefault();
        setError('');
        setCalculating(true);

        const h = Number(height);
        const w = Number(weight);

        if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
            setError('Please enter valid height and weight metrics.');
            setCalculating(false);
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
                'Calculation engine error. Please try again.'
            );
        } finally {
            setCalculating(false);
        }
    };

    const getCategoryStyles = (category) => {
        switch (category) {
            case 'Normal weight': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'Overweight': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Obese': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-indigo-600 bg-indigo-50 border-indigo-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-bold tracking-tight">Syncing biometrics...</p>
            </div>
        );
    }

    return (
        <div className="pb-12 pt-28 max-w-6xl mx-auto px-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">BMI Biometrics</h1>
                    <p className="text-slate-500 font-medium">Metric tracking and body mass index analysis.</p>
                </div>
                {result?.created_at && (
                    <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Last Sync: {new Date(result.created_at).toLocaleDateString()}
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Calculator Card */}
                <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-50 h-fit">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Biometric Input</h2>
                    <form onSubmit={calculateBMI} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Height (cm)</label>
                            <div className="relative group">
                                <Ruler className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="number"
                                    placeholder="175"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Weight (kg)</label>
                            <div className="relative group">
                                <Scale className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="number"
                                    placeholder="70"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={calculating}
                            className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            {calculating ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    Analyze Indices <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>
                    {error && (
                        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <Activity className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Analysis Result */}
                <div className="relative">
                    {result ? (
                        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-8">
                                    Computed Analysis
                                </span>
                                
                                <div className="mb-10">
                                    <div className="text-7xl font-black mb-4 tracking-tighter">{result.bmi}</div>
                                    <div className={`inline-block px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest border ${getCategoryStyles(result.category)}`}>
                                        {result.category}
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex items-start gap-5">
                                        <div className="bg-indigo-500/20 p-3 rounded-2xl">
                                            <Info className="h-6 w-6 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Protocol Tip</p>
                                            <p className="text-lg font-medium leading-relaxed italic text-slate-300">"{result.health_tip}"</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-8">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Recommended Parameters</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400 font-medium">Ideal Operational Weight</span>
                                            <span className="text-2xl font-black text-indigo-400">{result.recommended_range}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Visual Background Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-[3rem] p-14 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center h-full">
                            <div className="bg-white p-8 rounded-full shadow-inner mb-8">
                                <Activity className="h-16 w-16 text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Waiting for Metrics</h3>
                            <p className="text-slate-400 font-medium mt-4 max-w-[240px]">Initialize biometric input to generate diagnostic insights.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BMICalculator;
