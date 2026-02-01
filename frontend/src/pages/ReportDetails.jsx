import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    FileText, Calendar, ArrowLeft, Trash2, AlertTriangle,
    CheckCircle, Activity, ChevronRight, Loader2, ShieldCheck, Clock
} from 'lucide-react';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await api.get(`/reports/${id}`);
                setReport(response.data);
            } catch (error) {
                console.error("Error fetching report", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Permanent deletion cannot be undone. Proceed?")) {
            try {
                await api.delete(`/reports/${id}`);
                navigate('/reports');
            } catch (error) {
                console.error("Failed to delete report:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-bold tracking-tight">Deconstructing medical data...</p>
            </div>
        );
    }

    if (!report) return <div className="p-20 text-center font-black text-rose-500">Electronic record not found</div>;

    const { extracted_data, gemini_analysis } = report;

    return (
        <div className="pb-20 pt-28 max-w-7xl mx-auto px-6 font-sans">
            {/* Header Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors group"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Archive
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-200">
                            <FileText className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                {report.report_type || "Clinical Analysis"}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Processed {new Date(report.upload_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Clock className="h-3.5 w-3.5" />
                                    {new Date(report.upload_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-rose-500 hover:text-white border border-rose-100 hover:bg-rose-500 px-6 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
                >
                    <Trash2 className="h-4 w-4" /> Purge Record
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Intelligence Column */}
                <div className="lg:col-span-2 space-y-10">

                    {/* AI Health Summary Card */}
                    <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-50 overflow-hidden">
                        <div className="bg-slate-900 p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-6">
                                    AI Neural Synthesis
                                </div>
                                <h2 className="text-2xl font-black text-white mb-4">Diagnostic Executive Summary</h2>
                                <p className="text-slate-400 font-medium leading-relaxed italic text-lg">
                                    "{gemini_analysis?.summary || "Analysis engine failure. Please re-upload."}"
                                </p>
                            </div>
                            
                            {gemini_analysis?.health_score && (
                                <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 min-w-[160px]">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Wellbeing Index</span>
                                    <div className={`text-6xl font-black ${
                                        gemini_analysis.health_score >= 80 ? 'text-emerald-400' : 
                                        gemini_analysis.health_score >= 60 ? 'text-amber-400' : 'text-rose-400'
                                    }`}>
                                        {gemini_analysis.health_score}
                                    </div>
                                    <div className="w-16 h-1.5 bg-white/10 rounded-full mt-4 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${
                                                gemini_analysis.health_score >= 80 ? 'bg-emerald-400' : 
                                                gemini_analysis.health_score >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                                            }`}
                                            style={{ width: `${gemini_analysis.health_score}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Critical Alerts */}
                    {gemini_analysis?.abnormal_parameters?.length > 0 && (
                        <div className="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-xl font-black text-rose-900 mb-6 flex items-center gap-3 underline decoration-rose-200 underline-offset-8">
                                    <AlertTriangle className="h-6 w-6" />
                                    Anomalies Detected
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {gemini_analysis.abnormal_parameters.map((param, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white/60 p-4 rounded-2xl border border-rose-100 text-rose-800 font-black text-sm shadow-sm transition-transform hover:scale-[1.02]">
                                            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                            {param}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-50" />
                        </div>
                    )}

                    {/* Recommendations Engine */}
                    <div className="bg-white rounded-[3rem] shadow-sm border border-slate-50 p-10 md:p-14">
                        <h2 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Lifestyle Optimization Strategy</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-black text-emerald-600 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> High Bioavailability Foods
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {gemini_analysis?.foods_to_include?.map((food, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-xs border border-emerald-100 shadow-sm">
                                                {food}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-black text-rose-600 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" /> System Degrading Items
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {gemini_analysis?.foods_to_avoid?.map((food, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-rose-50 text-rose-700 font-bold rounded-xl text-xs border border-rose-100 shadow-sm">
                                                {food}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-inner">
                                <h3 className="font-black text-indigo-600 text-[10px] uppercase tracking-widest mb-6">Expert Protocols</h3>
                                <div className="space-y-5">
                                    {gemini_analysis?.dietary_suggestions?.map((sug, idx) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="bg-white p-2 rounded-xl shadow-sm mt-1">
                                                <ChevronRight className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <p className="text-slate-600 font-medium text-sm leading-relaxed">
                                                {sug}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Data Column */}
                <div className="space-y-8">
                    {/* Consultation Status */}
                    <div className={`rounded-[2.5rem] p-8 border ${
                        gemini_analysis?.doctor_consultation 
                            ? 'bg-amber-50 border-amber-100 shadow-amber-50' 
                            : 'bg-emerald-50 border-emerald-100 shadow-emerald-50'
                    } shadow-xl`}>
                        <div className={`p-4 rounded-2xl w-fit mb-6 ${
                            gemini_analysis?.doctor_consultation ? 'bg-amber-200/50 text-amber-700' : 'bg-emerald-200/50 text-emerald-700'
                        }`}>
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h3 className={`text-xl font-black mb-2 ${
                            gemini_analysis?.doctor_consultation ? 'text-amber-900' : 'text-emerald-900'
                        }`}>
                            Medical Consultation
                        </h3>
                        <p className={`text-2xl font-black mb-4 ${
                            gemini_analysis?.doctor_consultation ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                            {gemini_analysis?.doctor_consultation ? "Action Required" : "System Stable"}
                        </p>
                        <p className={`text-sm font-medium leading-relaxed ${
                            gemini_analysis?.doctor_consultation ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                            {gemini_analysis?.doctor_consultation
                                ? "Critical markers detected. Immediate professional oversight is highly recommended."
                                : "Biological markers currently reside within normative ranges. Operational maintenance is sufficient."}
                        </p>
                    </div>

                    {/* Raw Parameter Extraction */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 p-8">
                        <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center justify-between">
                            Data Extraction
                            <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">Raw Values</span>
                        </h2>
                        <div className="space-y-4">
                            {Object.entries(extracted_data || {}).map(([key, value]) => {
                                if (key === 'other_parameters' || value === null) return null;
                                
                                // Handle both legacy string values and new structured objects
                                let displayValue = value;
                                let displayUnit = '';
                                
                                if (typeof value === 'object' && value !== null) {
                                    displayValue = value.value;
                                    displayUnit = value.unit || '';
                                }

                                return (
                                    <div key={key} className="flex justify-between items-center group">
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest group-hover:text-indigo-600 transition-colors">
                                            {key.replace(/_/g, ' ')}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                                                {displayValue}
                                            </span>
                                            {displayUnit && (
                                                <span className="text-[10px] font-bold text-slate-400 lowercase">{displayUnit}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {(!extracted_data || Object.keys(extracted_data).length === 0) && (
                                <p className="text-slate-400 italic text-sm text-center py-4">No structural data mapped.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
