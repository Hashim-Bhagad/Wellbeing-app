import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity, FileText, Calculator } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                        <Activity className="h-6 w-6" />
                        HealthWell
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
                        <Link to="/upload" className="text-gray-600 hover:text-blue-600 font-medium">Upload Report</Link>
                        <Link to="/reports" className="text-gray-600 hover:text-blue-600 font-medium">My Reports</Link>
                        <Link to="/bmi" className="text-gray-600 hover:text-blue-600 font-medium">BMI Calculator</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                            <User className="h-5 w-5" />
                            <span className="hidden sm:block">{user.full_name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
