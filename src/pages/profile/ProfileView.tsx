import React from 'react';
import ProfilePictureUpload from '../../components/ProfilePictureUpload';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
    const { user, isGuest } = useAuth();

    if (isGuest) {
        return (
            <div className="p-4 md:p-6 text-center">
                <h1 className="text-2xl font-semibold mb-4">Profile</h1>
                <p className="text-gray-600">Profile features are not available in Guest Mode.</p>
                <p className="mt-2">
                    <Link to="/login" className="text-blue-600 hover:underline">Login</Link> or 
                    <Link to="/register" className="text-blue-600 hover:underline ml-1">Register</Link> to access your profile.
                </p>
            </div>
        );
    }
    
    if (!user) {
        return <div className="p-4 md:p-6">Loading user data...</div>;
    }

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Profile Picture</h2>
                    <ProfilePictureUpload currentAvatarUrl={user.avatar_url} />
                </div>
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Account Details</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-lg text-gray-800">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="text-lg text-gray-800">{user.username}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg text-gray-800">{user.email}</p>
                        </div>
                        {/* Tambahkan field lain atau tombol edit profil di sini */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;