import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UploadCloud, File, AlertCircle, Loader2, ArrowLeft, Shield } from 'lucide-react';

const UploadReport = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Diagnostic documents must be in PDF format.');
                setFile(null);
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('Document size exceeds our 10MB limit.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/reports/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/reports/${response.data._id}`);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.detail || 'System error during analysis. Please retry.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-12 pt-28 max-w-3xl mx-auto px-6 font-sans">
            <button 
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors group"
            >
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                Return to Intelligence
            </button>

            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Report Integration</h1>
                <p className="text-slate-500 font-medium">Upload your clinical PDF for advanced AI synthesis and scoring.</p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-50 p-10 md:p-14">
                <div 
                    className={`relative border-2 border-dashed rounded-[2rem] p-12 md:p-20 text-center transition-all duration-300 cursor-pointer group
                        ${file ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />

                    {file ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-200 mb-6">
                                <File className="h-10 w-10 text-white" />
                            </div>
                            <p className="text-xl font-black text-slate-900 mb-1">{file.name}</p>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                            </p>
                            <button
                                className="mt-8 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:text-rose-600 transition-colors"
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            >
                                Replace Document
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="bg-slate-50 p-6 rounded-3xl group-hover:bg-white transition-colors mb-6 shadow-inner">
                                <UploadCloud className="h-10 w-10 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <p className="text-xl font-black text-slate-900 mb-2">Drop clinical file here</p>
                            <p className="text-slate-400 font-medium">or click to browse your digital records</p>
                            <div className="mt-8 px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                PDF format required • Max 10MB
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-8 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="text-sm font-bold">{error}</span>
                    </div>
                )}

                <div className="mt-12 flex flex-col gap-6">
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl
                            ${!file || loading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-indigo-600 text-white hover:bg-slate-900 hover:shadow-indigo-200'}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin text-white/50" />
                                Processing Neural Analysis...
                            </>
                        ) : (
                            'Initialize AI Synthesis'
                        )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <Shield className="h-3.5 w-3.5" />
                        Encrypted Medical-Grade Integration
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadReport;
