import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    // Add other profile fields as needed
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    setIsEditing(false);
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-sm text-gray-900">{user.role}</p>
            </div>
            {user.shopId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shop ID
                </label>
                <p className="mt-1 text-sm text-gray-900">{user.shopId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional profile sections can be added here */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="text-sm font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">
                  Update your account password
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="text-sm font-medium">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security
                </p>
              </div>
              <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm">
                Enable
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Activity</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                Last login: {new Date().toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Account created: Recently</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
