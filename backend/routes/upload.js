import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import Upload from "../models/Upload.js";
import pdfParse from "pdf-parse";
import User from "../models/User.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// delete account 
router.delete("/delete-account", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Deleting account for user ID:", userId);

    const uploadsResult = await Upload.deleteMany({ user: userId });
    const userResult = await User.findByIdAndDelete(userId);

    if (!userResult) {
      console.warn("No user found to delete.");
      return res.status(404).json({ error: "User not found" });
    }

    res.clearCookie("token");
    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error("Account delete error:", err.message);
    res.status(500).json({ error: "Failed to delete account" });
  }
});


// POST /api/upload
router.post("/", isAuthenticated, upload.single("pdf"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const formData = new FormData();
    formData.append("pdf_file", fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: "application/pdf"
    });

    const response = await axios.post("http://127.0.0.1:8000/summarize", formData, {
      headers: {
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    const inputPdfBuffer = fs.readFileSync(filePath);
    const summaryPdfBuffer = Buffer.from(response.data);

    await Upload.create({
      user: req.user.id,
      filename: req.file.originalname,
      inputPdf: inputPdfBuffer,
      summaryPdf: summaryPdfBuffer,
    });

    fs.unlinkSync(filePath); 
    res.json({ message: "Upload and summary complete" });

  } catch (err) {
    console.error("Upload error:", err.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      error: "Failed to process document",
      details: err.response?.data || err.message,
    });
  }
});

// GET /api/upload - list uploads
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id })
      .sort({ timestamp: -1 })
      .select("_id filename timestamp summaryPdf");

    const uploadsWithFlag = uploads.map(u => ({
      _id: u._id,
      filename: u.filename,
      timestamp: u.timestamp,
      hasSummary: !!u.summaryPdf, 
    }));

    res.json({ uploads: uploadsWithFlag });
  } catch (err) {
    console.error("Fetch uploads error:", err.message);
    res.status(500).json({ error: "Failed to fetch uploads" });
  }
});


// GET /api/upload/input/:id - download original PDF
router.get("/input/:id", isAuthenticated, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload || !upload.inputPdf) {
      return res.status(404).json({ error: "Input PDF not found" });
    }
    res.setHeader("Content-Type", "application/pdf");
    res.send(upload.inputPdf);
  } catch (err) {
    console.error("Input PDF error:", err.message);
    res.status(500).json({ error: "Failed to load input PDF" });
  }
});

router.get("/summary/:id", isAuthenticated, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload || !upload.summaryPdf) {
      return res.status(404).json({ error: "Summary PDF not found" });
    }
    res.setHeader("Content-Type", "application/pdf");
    res.send(upload.summaryPdf);
  } catch (err) {
    console.error("Summary PDF error:", err.message);
    res.status(500).json({ error: "Failed to load summary PDF" });
  }
});

router.get("/summary-text/:id", isAuthenticated, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload || !upload.summaryPdf) {
      return res.status(404).json({ error: "Summary PDF not found" });
    }

    const dataBuffer = upload.summaryPdf;
    const parsed = await pdfParse(dataBuffer);

    let cleanedText = parsed.text;

    cleanedText = cleanedText
      .replace(/\n\s*n\s+/g, '\n➤ ')
      .replace(/^\s*n\s+/gm, '➤ ')        
      .replace(/\n{2,}/g, '\n\n')         
      .replace(/[■▪◦·]/g, '•')             
      .trim();

    res.json({ text: cleanedText });
  } catch (err) {
    console.error("Summary text extract error:", err.message);
    res.status(500).json({ error: "Failed to extract summary text" });
  }
});

// DELETE /api/upload/:id
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const uploadId = req.params.id;
    const result = await Upload.findByIdAndDelete(uploadId);

    if (!result) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Failed to delete document" });
  }
});

router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      user: {
        email: user.email,
        joinedAt: user.createdAt, // <-- fix here
      },
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ error: "Server error" });
  }
});





export default router;
