import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FileText, Calendar, ChevronRight, Activity, Search, Loader2 } from 'lucide-react';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await api.get('/reports/');
                setReports(response.data);
            } catch (error) {
                console.error("Error fetching reports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const filteredReports = reports.filter(report => 
        (report.report_type || 'Health Report').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-bold tracking-tight">Accessing medical archive...</p>
            </div>
        );
    }

    return (
        <div className="pb-12 pt-28 max-w-7xl mx-auto px-6 font-sans">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Clinical Archive</h1>
                    <p className="text-slate-500 font-medium">Your historical health data and AI analysis.</p>
                </div>
                
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by report type..." 
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {reports.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <FileText className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No archive found</h3>
                    <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto">Upload your first health report to start building your clinical history.</p>
                    <Link to="/upload" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 inline-block">
                        Upload Record
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredReports.map((report) => (
                        <Link
                            key={report._id}
                            to={`/reports/${report._id}`}
                            className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-50 group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex items-start gap-6">
                                    <div className="bg-slate-50 p-5 rounded-3xl group-hover:bg-indigo-50 transition-colors">
                                        <FileText className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                                            {report.report_type || "Diagnostic Report"}
                                        </h2>
                                        <div className="flex items-center gap-3 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(report.upload_date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-12 border-t lg:border-t-0 pt-6 lg:pt-0">
                                    <div className="text-left lg:text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center lg:justify-end gap-1.5">
                                            <Activity className="h-3 w-3" /> Health Score
                                        </div>
                                        <div className={`text-3xl font-black ${
                                            (report.gemini_analysis?.health_score || 0) >= 80 ? 'text-emerald-500' :
                                            (report.gemini_analysis?.health_score || 0) >= 60 ? 'text-amber-500' : 'text-rose-500'
                                        }`}>
                                            {report.gemini_analysis?.health_score || '--'}
                                            <span className="text-sm text-slate-300 ml-1">/100</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <ChevronRight className="h-6 w-6 translate-x-0 group-hover:translate-x-0.5" />
                                    </div>
                                </div>
                            </div>
                            
                            {report.gemini_analysis?.summary && (
                                <div className="mt-8 pt-8 border-t border-slate-50">
                                    <p className="text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                                        "{report.gemini_analysis.summary}"
                                    </p>
                                </div>
                            )}
                        </Link>
                    ))}
                    
                    {filteredReports.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching archives found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;
