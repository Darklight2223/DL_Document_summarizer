# 🧠 DL-Powered Document Summarizer App

A full-stack deep learning-powered web application that allows users to upload scientific PDF documents (e.g., research papers) and receive clean, high-quality **AI-generated summaries**. Built using **Flask**, **MongoDB**, **React**, and a **custom-trained T5 summarization model**.

---

## 📌 Features

- 📝 Upload PDF documents (native + scanned)
- 📄 Extracts text using OCR (Tesseract) or native PDF parsing
- 🤖 Generates intelligent summaries using a custom-trained T5 model
- 💾 Saves both original and summary PDFs to MongoDB GridFS
- 🖥️ Beautiful frontend dashboard (React + Tailwind + Framer Motion)

---

## 🚀 Tech Stack

| Area            | Tech Used                          |
|-----------------|------------------------------------|
| Frontend        | React, TailwindCSS, Framer Motion, Axios |
| Backend         | Flask, Python, PyTorch, MongoDB, Express |
| DL Framework    | PyTorch, Transformers (HuggingFace) |
| PDF Processing  | PyMuPDF , pdf2image, pytesseract |
| Database        | MongoDB |

---

## 🧠 Model Training

This app uses a custom-trained **T5-base model** fine-tuned on the [ArXiv dataset](https://www.kaggle.com/datasets/Cornell-University/arxiv) for document summarization.

### 🏋️ Training Details

| Component              | Description                             |
|------------------------|-----------------------------------------|
| Model                  | T5-base (custom fine-tuned)             |
| Dataset                | [ArXiv dataset on Kaggle](https://www.kaggle.com/datasets/thedevastator/ccdv-arxiv-summarization-dataset) |
| Platform               | Kaggle Notebooks                        |
| GPU Used               | 2 × (Tesla) T4 GPUs                     |
| Notes                  | Model output was exported as a Kaggle dataset to enable download, since `/kaggle/working/` restricts large file exports |

> 🔒 `my_local_t5_model/` directory is gitignored to avoid uploading large weights. You can download the fine-tuned model from [Kaggle Model Dataset](https://www.kaggle.com/datasets/kanishk2223/my-t5-model-zip)


## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/dl-powered-document-summarizer.git
cd DL_project
```

### 2. configure environment variables
Create a `.env` file in the backend directory and add the following variables:

```plaintext
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret_key
```

### 3. Start the the app
```bash
# Start the backend server and Make sure MongoDB is running 
cd backend
npm install 
node server.js
```

```bash
# Start the frontend server
cd frontend
npm install
npm start
```

```bash
# start python server and make sure you have the model downloaded in `my_local_t5_model/` and adjust path in `summarizer.py`
python -u main.py
``` 

### 4. Access the app
Open your browser and go to link provided by the frontend server.

## Disclaimer
This project is for educational purposes only. The model and code are provided "as is" without any warranty. The generated summaries may not always be 100% accurate.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📫 Contact
For any questions or contributions, feel free to open an issue or contact me at platforms provided in my profile.

## Author
- [Kanishk](https://github.com/Darklight2223) 


----