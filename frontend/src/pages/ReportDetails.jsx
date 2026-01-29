import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    FileText, Calendar, ArrowLeft, Trash2, AlertTriangle,
    CheckCircle, Activity, ChevronRight
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
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await api.delete(`/reports/${id}`);
                navigate('/reports');
            } catch (error) {
                alert("Failed to delete report");
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading report details...</div>;
    if (!report) return <div className="p-8 text-center text-red-500">Report not found</div>;

    const { extracted_data, gemini_analysis } = report;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-500 hover:text-blue-600 mb-2 transition"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        {report.report_type || "Health Report"}
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Uploaded on {new Date(report.upload_date).toLocaleDateString()} at {new Date(report.upload_date).toLocaleTimeString()}
                    </p>
                </div>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                    <Trash2 className="h-4 w-4" /> Delete Report
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Analysis Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* AI Summary */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" />
                            AI Health Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {gemini_analysis?.summary || "Analysis pending..."}
                        </p>
                    </div>

                    {/* Abnormal Parameters */}
                    {gemini_analysis?.abnormal_parameters?.length > 0 && (
                        <div className="bg-red-50 rounded-xl shadow-sm p-6 border border-red-100">
                            <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Attention Needed
                            </h2>
                            <ul className="space-y-2">
                                {gemini_analysis.abnormal_parameters.map((param, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-red-700">
                                        <span className="mt-1.5 h-2 w-2 rounded-full bg-red-500 flex-shrink-0"></span>
                                        {param}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommendations */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Dietary & Lifestyle Recommendations</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" /> Foods to Include
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {gemini_analysis?.foods_to_include?.map((food, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {food}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" /> Foods to Avoid
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {gemini_analysis?.foods_to_avoid?.map((food, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                            {food}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-blue-700 mb-3">Expert Suggestions</h3>
                                <ul className="space-y-2">
                                    {gemini_analysis?.dietary_suggestions?.map((sug, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                                            <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            {sug}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Extracted Data */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Extracted Values</h2>
                        <div className="space-y-3">
                            {Object.entries(extracted_data || {}).map(([key, value]) => {
                                if (key === 'other_parameters' || value === null) return null;
                                return (
                                    <div key={key} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                                        <span className="font-bold text-gray-800">{value}</span>
                                    </div>
                                );
                            })}
                            {(!extracted_data || Object.keys(extracted_data).length === 0) && (
                                <p className="text-gray-400 italic text-sm">No specific parameters extracted.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Doctor Consultation</h3>
                        <p className={`text-lg font-bold ${gemini_analysis?.doctor_consultation ? 'text-red-600' : 'text-green-600'}`}>
                            {gemini_analysis?.doctor_consultation ? "Recommended" : "Not Immediately Required"}
                        </p>
                        <p className="text-sm text-blue-800 mt-2">
                            {gemini_analysis?.doctor_consultation
                                ? "Based on the analysis, some values require medical attention."
                                : "Your report seems generally stable, but always consult a doctor if you feel unwell."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
