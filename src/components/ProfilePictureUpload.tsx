import React, { useState, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  onUploadSuccess?: (newAvatarUrl: string) => void; // Callback opsional
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ currentAvatarUrl, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateUserContext } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Batas 5MB
        setError("File is too large. Max 5MB allowed.");
        setSelectedFile(null);
        setPreview(currentAvatarUrl || null); // Reset preview ke avatar saat ini
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setError("Invalid file type. Only JPG, PNG, GIF, WEBP are allowed.");
        setSelectedFile(null);
        setPreview(currentAvatarUrl || null);
        return;
      }
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setSelectedFile(null);
        setPreview(currentAvatarUrl || null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('profilePicture', selectedFile); // Nama field harus cocok dengan backend

    try {
      const response = await axiosInstance.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const newAvatarUrl = response.data.avatarUrl;
      const updatedUser = response.data.user; // User data yang sudah diupdate dari backend

      updateUserContext({ avatar_url: newAvatarUrl, ...updatedUser }); // Update context dengan user baru
      setPreview(newAvatarUrl); // Update preview dengan URL dari storage
      setSelectedFile(null); // Clear selected file
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input file
      if (onUploadSuccess) onUploadSuccess(newAvatarUrl);
      alert("Profile picture updated successfully!");

    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload profile picture.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg shadow">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {preview ? (
          <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>
      
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100 disabled:opacity-50"
        disabled={loading}
      />

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:bg-blue-300"
        >
          {loading ? 'Uploading...' : 'Upload Picture'}
        </button>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ProfilePictureUpload;