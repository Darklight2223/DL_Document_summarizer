import express from "express";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import File from "../models/File.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (String(file.userId) !== String(req.user._id))
      return res.status(403).json({ error: "Unauthorized" });

    const formData = new FormData();
    formData.append("pdf_file", fs.createReadStream(file.filepath));

    const response = await axios.post("http://127.0.0.1:8000/summarize", formData, {
      headers: formData.getHeaders(),
    });

    file.summary = response.data.summary;
    file.summaryGeneratedAt = new Date();
    await file.save();

    res.json({ summary: file.summary });
  } catch (err) {
    console.error("Summary error:", err.message);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default router;
