from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse,JSONResponse
import fitz  
import re
from summarizer import generate_summary
import traceback
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import base64
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clean_text(text: str) -> str:
    
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    
    text = re.sub(r'[ \t]+', ' ', text)
    
    lines = text.split('\n')
    cleaned_lines = [line.strip() for line in lines if line.strip()] 
    
    return '\n'.join(cleaned_lines)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    try:
        text = ""
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        for page in doc:
            text_dict = page.get_text("dict")
            page_text = ""
            
            for block in text_dict["blocks"]:
                if "lines" in block:
                    for line in block["lines"]:
                        line_text = ""
                        for span in line["spans"]:
                            content = span["text"]
                            font = span["font"]
                            
                            if content in ["•", "◦", "▪", "▫", "⦿", "⚫", "⚬"]:
                                line_text += "• "
                            elif content == "I" and span.get("size", 0) > 0 and len(content) == 1:
                                line_text += "• "
                            else:
                                line_text += content
                        
                        page_text += line_text.strip() + "\n"
            
            text += page_text
            
        doc.close()
        return text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Failed to extract text from PDF: {str(e)}")

def create_pdf(summary_text: str) -> BytesIO:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    text_object = pdf.beginText(40, 750)

    for line in summary_text.split("\n"):
        for chunk in [line[i:i+100] for i in range(0, len(line), 100)]:
            text_object.textLine(chunk)
            if text_object.getY() < 40:
                pdf.drawText(text_object)
                pdf.showPage()
                text_object = pdf.beginText(40, 750)

    pdf.drawText(text_object)
    pdf.save()
    buffer.seek(0)
    return buffer

@app.post("/extract-text")
async def extract_text_from_uploaded_pdf(pdf_file: UploadFile = File(...)):
    try:
        pdf_bytes = await pdf_file.read()
        text = extract_text_from_pdf(pdf_bytes)
        return JSONResponse(content={"text": clean_text(text)})
    except Exception as e:
        print(f"PDF text extraction failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF")


@app.post("/summarize")
async def summarize_pdf(pdf_file: UploadFile = File(...)):
    try:
        print(f"Processing file: {pdf_file.filename}")
        
        contents = await pdf_file.read()
        print(f"Read {len(contents)} bytes")
        
        raw_text = extract_text_from_pdf(contents)
        print(f"\n📄 Extracted PDF Text:\n{'-'*80}\n{raw_text[:1000]}\n{'-'*80}")

        cleaned_text = clean_text(raw_text)

        if not cleaned_text.strip():
            return HTTPException(status_code=400, detail="No readable text found in PDF")

        print("Generating summary...")
        summary = generate_summary(cleaned_text)
        print(f"\n✅ Generated Summary:\n{'-'*80}\n{summary[:1000]}\n{'-'*80}")

        pdf_buffer = create_pdf(summary)

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=summary.pdf"}
        )

    except Exception as e:
        print(f"Error processing PDF: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
