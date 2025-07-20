import React, { useEffect, useState } from "react";
import { FileUp, FileText, LayoutDashboard, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Dashboard = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [uploadMessages, setUploadMessages] = useState([
    "Please , do not refresh the page.",
    "Uploading...",
    "Generating Summary...",
    "Almost done...",
    "Hang tight!",
    "Processing your document...",
    "Summarizing your content...",
    "Finalizing your summary...",
    "Just a moment...",
    "This app can make some mistakes, please review the summary carefully.",
  ]);
  const [currentUploadMsgIndex, setCurrentUploadMsgIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (uploading) {
      interval = setInterval(() => {
        setCurrentUploadMsgIndex((prev) => (prev + 1) % uploadMessages.length);
      }, 3000);
    } else {
      setCurrentUploadMsgIndex(0);
    }

    return () => clearInterval(interval);
  }, [uploading]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/upload/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setUploads((prev) => prev.filter((upload) => upload._id !== id));
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setShowModal(false);
      setDeleteTarget(null);
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
      console.error("Failed to load uploads:", err);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const triggerUpload = () => {
    document.getElementById("uploadInput").click();
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    setUploading(true);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      await fetchUploads();
      navigate("/summary", { state: { summary: data.summary } });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const totalUploads = uploads.length;
  const lastUploadTime = uploads[0]?.timestamp;
  const totalSummaries = uploads.filter((u) => u.hasSummary).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-16 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Welcome back! Manage your documents and summaries here.
            </p>
          </div>

          <>
            <input
              type="file"
              id="uploadInput"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
            <button
              onClick={triggerUpload}
              disabled={uploading}
              className={`${uploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                } px-6 py-2 rounded-lg font-semibold transition shadow`}
            >
              {uploading ? "Uploading..." : "+ Upload Document"}
            </button>
          </>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow hover:shadow-xl"
          >
            <LayoutDashboard className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-xl font-bold">Total Uploads</h3>
            <p className="text-gray-300 mt-1 text-lg">
              {totalUploads} documents
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow hover:shadow-xl"
          >
            <FileUp className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-xl font-bold">Last Upload</h3>
            <p className="text-gray-300 mt-1 text-lg">
              {lastUploadTime ? dayjs(lastUploadTime).fromNow() : "N/A"}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow hover:shadow-xl"
          >
            <FileText className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-xl font-bold">Summaries Created</h3>
            <p className="text-gray-300 mt-1 text-lg">
              {totalSummaries} summaries
            </p>
          </motion.div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Recent Uploads</h2>
          {uploads.length === 0 ? (
            <p className="text-gray-400">
              You haven’t uploaded any documents yet.
            </p>
          ) : (
            <div className="space-y-6">
              {uploads.map((upload, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-5 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {upload.filename}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {dayjs(upload.timestamp).format("DD MMM YYYY, h:mm A")}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setDeleteTarget(upload._id);
                        setShowModal(true);
                      }}
                      className="text-red-500 hover:text-red-400 transition"
                      title="Delete this document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={`http://localhost:5000/api/upload/input/${upload._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      📄 View Input PDF
                    </a>
                    <a
                      href={`http://localhost:5000/api/upload/summary/${upload._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      📄 View Summary PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Uploading Overlay */}
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center"
          >
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 100 20v-4l-5 5 5 5v-4a8 8 0 01-8-8z"
              />
            </svg>
            <p className="text-lg font-semibold text-center">
              {uploadMessages[currentUploadMsgIndex]}
            </p>
          </motion.div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to permanently delete this document and its
              summary?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
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

export default Dashboard;
