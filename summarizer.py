import re
import torch
from transformers import T5ForConditionalGeneration, T5TokenizerFast

# Setup model
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_path = "./my_local_t5_model"
tokenizer = T5TokenizerFast.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(
    model_path,
    use_safetensors=True,
    torch_dtype=torch.float32,
    low_cpu_mem_usage=True
).to(DEVICE)
model.eval()


SECTION_HEADERS = [
    "education", "internship", "experience", "projects",
    "skills", "achievements", "extra[- ]curricular", "technical skills"
]

def is_structured(text):
    count = sum(1 for header in SECTION_HEADERS if re.search(header, text.lower()))
    return count >= 3

def split_by_sections(text):
    pattern = r"(education|internship|experience|Academic projects|skills|achievements|extra[- ]curricular|technical skills)"
    parts = re.split(pattern, text, flags=re.IGNORECASE)
    sections = []
    for i in range(1, len(parts), 2):  # step by 2 (header, content)
        title = parts[i].strip().title()
        content = parts[i + 1].strip()
        if content:
            sections.append((title, content))
    return sections

def chunk_text(text, tokenizer, max_length=512, overlap=128):
    tokens = tokenizer.encode(text, return_tensors="pt")[0]
    chunks = []
    i = 0
    while i < len(tokens):
        end = min(i + max_length, len(tokens))
        chunk = tokens[i:end]
        chunks.append(chunk)
        if end == len(tokens):
            break
        i += max_length - overlap
    return chunks

# Summarize a chunk of tokens
def summarize_chunk(chunk_ids):
    input_ids = torch.cat([
        tokenizer.encode("summarize: ", return_tensors="pt", add_special_tokens=False)[0],
        chunk_ids
    ])[:512].unsqueeze(0).to(DEVICE)

    attention_mask = (input_ids != tokenizer.pad_token_id).long()

    summary_ids = model.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        max_length=256,
        num_beams=4,
        repetition_penalty=2.0,
        no_repeat_ngram_size=3,
        early_stopping=True
    )
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)


def generate_summary(text):
    if is_structured(text):
        sections = split_by_sections(text)
        all_summaries = []
        for title, content in sections:
            token_chunks = chunk_text(content, tokenizer)
            sec_summary = "\n".join(summarize_chunk(chunk) for chunk in token_chunks)
            all_summaries.append(f"🔹 {title}:\n{sec_summary.strip()}")
        return "\n\n".join(all_summaries)
    else:
        token_chunks = chunk_text(text, tokenizer)
        summaries = [summarize_chunk(chunk) for chunk in token_chunks]
        final_summary = "\n".join(f"🔹 {s.strip()}" for s in summaries)
        return final_summary
