import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, FileText, Calendar, Activity } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [reminderStatus, setReminderStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reportsRes, remindersRes] = await Promise.all([
                    api.get('/reports/'),
                    api.get('/users/reminders/status')
                ]);
                setReports(reportsRes.data);
                setReminderStatus(remindersRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Hello, {user?.full_name}</h1>
                <p className="opacity-90">Here's an overview of your health status.</p>

                {reminderStatus?.next_checkup_date && (
                    <div className="mt-6 flex items-center gap-3 bg-white/20 p-4 rounded-lg backdrop-blur-sm w-fit">
                        <Calendar className="h-6 w-6" />
                        <div>
                            <p className="text-sm font-medium opacity-90">Next Scheduled Checkup</p>
                            <p className="text-lg font-bold">
                                {reminderStatus.days_remaining > 0
                                    ? `${reminderStatus.days_remaining} days remaining`
                                    : "Due Today!"}
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/upload" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group">
                    <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition">
                        <Plus className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-800">Upload New Report</h3>
                    <p className="text-sm text-gray-500 mt-2">Analyze a new health report PDF</p>
                </Link>
                <Link to="/bmi" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center text-center group">
                    <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition">
                        <Calculator className="h-8 w-8 text-green-600" /> {/* Fixed import alias issue by using icon directly */}
                    </div>
                    <h3 className="font-bold text-gray-800">BMI Calculator</h3>
                    <p className="text-sm text-gray-500 mt-2">Check your body mass index</p>
                </Link>
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
                    <div className="bg-purple-100 p-4 rounded-full mb-4">
                        <Activity className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-800">Health Score</h3>
                    <p className="text-sm text-gray-500 mt-2">Based on your recent reports</p>
                </div>
            </div>

            {/* Recent Reports */}
            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Recent Reports</h2>
                    <Link to="/reports" className="text-blue-600 hover:underline">View All</Link>
                </div>

                {reports.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-md text-center">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600">No reports uploaded yet</h3>
                        <p className="text-gray-500 mb-6">Upload your first health report to get AI insights.</p>
                        <Link to="/upload" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            Upload Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {reports.slice(0, 3).map((report) => (
                            <Link
                                key={report._id}
                                to={`/reports/${report._id}`}
                                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center border border-gray-100"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{report.report_type || "Health Report"}</h4>
                                        <p className="text-sm text-gray-500">{new Date(report.upload_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    Analyzed
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
import { Calculator } from 'lucide-react'; // Re-import to fix if missed
export default Dashboard;
