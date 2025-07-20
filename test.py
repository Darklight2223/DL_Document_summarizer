import torch
from transformers import T5ForConditionalGeneration, T5TokenizerFast
from textwrap import wrap

# === Setup device ===
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# === Load tokenizer and model from local directory ===
model_path = "./my_local_t5_model"
tokenizer = T5TokenizerFast.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(
    model_path,
    use_safetensors=True,
    torch_dtype=torch.float32,
    low_cpu_mem_usage=True
).to(DEVICE)
model.eval()

# === Function: Chunk with overlap ===
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

# === Function: Summarize one chunk ===
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

# === Input: Your long text ===
text = """ Enter Input text here... """

# === Chunking and summarization ===
token_chunks = chunk_text(text, tokenizer, max_length=512, overlap=128)
summaries = [summarize_chunk(chunk) for chunk in token_chunks]

# === Final merged summary ===
final_summary = "\n".join(f"🔹 {s.strip()}" for s in summaries)

# === Output ===
print("\n=== 🔍 Final Summary ===")
print(final_summary)
