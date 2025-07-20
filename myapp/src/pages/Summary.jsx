import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";

const Summary = () => {
  const location = useLocation();
  const [latestUpload, setLatestUpload] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestUpload = async () => {
      try {
        if (location.state?.summary) {
          setLatestUpload(location.state.summary);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/upload", {
          withCredentials: true,
        });

        const mostRecent = res.data.uploads?.[0] || null;
        setLatestUpload(mostRecent);
      } catch (err) {
        console.error("❌ Failed to fetch latest upload:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUpload();
  }, [location.state]);

  useEffect(() => {
    const fetchSummaryTextFromPython = async () => {
      if (!latestUpload?._id) return;

      try {
        
        const pdfRes = await axios.get(
          `http://localhost:5000/api/upload/summary/${latestUpload._id}`,
          { responseType: "blob", withCredentials: true }
        );

        const formData = new FormData();
        formData.append("pdf_file", pdfRes.data, "summary.pdf");

        const extractRes = await axios.post(
          "http://localhost:8000/extract-text",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setSummaryText(extractRes.data.text || "No summary available.");
      } catch (err) {
        console.error("❌ Failed to extract summary text from Python:", err);
        setSummaryText("Failed to load summary.");
      }
    };

    fetchSummaryTextFromPython();
  }, [latestUpload]);

  if (loading) {
    return (
      <div className="text-center mt-8 text-lg font-semibold">
        Loading summary...
      </div>
    );
  }

  if (!latestUpload) {
    return (
      <div className="text-center mt-8">
        <p className="text-xl">No summary found.</p>
        <Link to="/dashboard" className="text-blue-500 underline">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">📄 Document Summary</h2>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{latestUpload.filename}</h3>
            <span className="text-sm text-gray-400">
              {new Date(latestUpload.timestamp).toLocaleString()}
            </span>
          </div>

          <p className="mb-4 text-gray-300">
            Your document has been successfully summarized.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a
              href={`http://localhost:5000/api/upload/input/${latestUpload._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-center transition"
            >
              View Original Document
            </a>
            <a
              href={`http://localhost:5000/api/upload/summary/${latestUpload._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-center transition"
            >
              View Summary PDF
            </a>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
            <h4 className="text-lg font-semibold mb-3 text-green-400">
              📝 Summary Preview
            </h4>
            <div className="max-h-[400px] overflow-y-auto text-gray-200 leading-relaxed scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-2 rounded">
              {summaryText.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                // Check if the line is a bullet point
                if (trimmedLine.startsWith('•')) {
                  return (
                    <div key={index} className="flex flex-row items-start my-1.5">
                      <span className="text-green-400 font-bold mr-3 w-4">➤</span>
                      {/* Remove the old bullet and render the rest of the line */}
                      <span className="flex-1">{trimmedLine.substring(1).trim()}</span>
                    </div>
                  );
                }
                // Render a regular line of text
                return (
                  <p key={index} className="my-1.5">{line}</p>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Summary;
