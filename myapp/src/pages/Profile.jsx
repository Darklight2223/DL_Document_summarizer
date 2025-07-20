import React, { useEffect, useState } from "react";
import { User, LogOut, Trash2, Info, Calendar, Mail } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/upload/me", {
        credentials: "include",
      });
      if (res.status === 401) {
        navigate("/signin");
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        credentials: "include",
      });
      const data = await res.json();
      setUploads(data.uploads || []);
    } catch (err) {
      console.error("Error fetching uploads:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("dlscanner_token");
    setAuth(null);
    navigate("/signin");
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch("http://localhost:5000/api/upload/delete-account", {
        method: "DELETE",
        credentials: "include",
      });
      navigate("/signup");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUploads();
  }, []);

  const totalUploads = uploads.length;
  const totalSummaries = uploads.filter((u) => u.hasSummary).length;

  if (loading) {
    return <div className="text-center text-white p-8">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white">Profile</h1>
          <p className="text-gray-400 mt-2">
            Manage your account, activity and support options.
          </p>
        </div>

        {/* Profile Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow"
          >
            <User className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">User Info</h3>
            <p className="flex items-center gap-2 text-gray-300 text-sm">
              <Mail className="w-4 h-4" />
              {user?.email || "Not available"}
            </p>
            <p className="flex items-center gap-2 text-gray-300 text-sm mt-1">
              <Calendar className="w-4 h-4" />
              Member Since:{" "}
              {user?.joinedAt
                ? dayjs(user.joinedAt).format("DD MMM YYYY")
                : "Not available"}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow"
          >
            <Info className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Usage Summary</h3>
            <p className="text-gray-300 text-sm">
              Total Uploads:{" "}
              <span className="text-white font-semibold">{totalUploads}</span>
            </p>
            <p className="text-gray-300 text-sm mt-1">
              Summaries Generated:{" "}
              <span className="text-white font-semibold">{totalSummaries}</span>
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-16">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>

        {/* FAQs */}
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">FAQs</h2>
          <div className="space-y-4 text-gray-300 text-sm">
            <div>
              <h4 className="text-white font-semibold">
                📄 What file types are supported?
              </h4>
              <p>Only PDF documents are supported for now.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold">
                🔐 Is my data stored securely?
              </h4>
              <p>
                Yes. Files are stored securely and can be deleted anytime from
                your dashboard.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold">
                💬 How do I get support?
              </h4>
              <p>
                Email us at{" "}
                <a
                  href="mailto:support@yourapp.com"
                  className="text-blue-400 underline"
                >
                  support@yourapp.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Confirm Account Deletion
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to permanently delete your account and all
              data?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
