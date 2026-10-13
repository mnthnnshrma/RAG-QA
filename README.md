# RAG-QA 🚀

> **Document Intelligence Assistant** powered by Google Gemini and ChromaDB.

RAG-QA is a full-stack Retrieval-Augmented Generation (RAG) application that allows you to upload any PDF document and ask natural language questions with real-time, streaming AI answers strictly grounded in your document's contents.

---

## ✨ Features

- 📄 **In-Memory PDF Parsing**: Streams and extracts text directly from memory buffers using `multer.memoryStorage()` and `pdf-parse` (zero disk footprint).
- ✂️ **Smart Chunking**: Recursive character text splitting (512-character window with 50-character overlap) preserving context across boundaries.
- 🧠 **Gemini Vector Embeddings**: High-dimensional embeddings generated with `gemini-embedding-2`.
- ⚡ **ChromaDB Storage**: Cosine distance vector indexing supporting both local ChromaDB and Chroma Cloud.
- 🎯 **Semantic Retrieval & Gating**: Cosine similarity search scoped to the uploaded document with confidence score gating to prevent hallucinations.
- 🌊 **Real-Time Streaming Answers**: Server-Sent Events (SSE) streaming token-by-token using Gemini (`gemini-flash-lite-latest` or any model configured via `GEMINI_MODEL`).
- 🛡️ **Anti-Hallucination Guardrails**: Low-temperature generation (`0.1`) with strict context-only prompting and explicit refusal when answers are not present in the document.

---

## 🛠️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                          FRONTEND                           │
│   Landing Page (Upload PDF)  ──►  Chat Page (SSE Stream)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND                         │
│                                                             │
│   POST /upload                                              │
│   ├── In-Memory Buffer Extraction via pdf-parse             │
│   ├── RecursiveCharacterTextSplitter (512 / 50 Chunks)      │
│   ├── LangChain + Gemini Embedding-2                        │
│   └── ChromaDB (Store vectors & document metadata)          │
│                                                             │
│   POST /query                                               │
│   ├── Semantic Retrieval (Top-5 Chunks via ChromaDB)        │
│   ├── Similarity Threshold Gate                             │
│   └── Gemini Model Stream (SSE Events)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18+ (tested on Node v25)
- **Google Gemini API Key**: Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
- **ChromaDB**: Chroma Cloud account credentials (or local Chroma server).

### 2. Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/mnthnnshrma/RAG-QA.git
cd RAG-QA
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your configuration:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-flash-lite-latest
GEMINI_EMBEDDING_MODEL=gemini-embedding-2

# Retrieval Configuration
RETRIEVAL_MIN_SCORE=0.6

# Chroma Cloud (Recommended)
CHROMA_API_KEY=your_chroma_api_key
CHROMA_TENANT=your_chroma_tenant_id
CHROMA_DATABASE=your_chroma_database_name

# Server
PORT=3000
```

> **Note**: If using a local Chroma server instead of Cloud, leave the `CHROMA_API_KEY`, `CHROMA_TENANT`, and `CHROMA_DATABASE` empty and set `CHROMA_URL=http://localhost:8000`.

### 4. Running the Application

Development mode (auto-reload on code changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Open your browser at **`http://localhost:3000`**.

---

## 📁 Project Structure

```
├── app.js               # Express application entrypoint
├── routes/
│   ├── upload.js        # PDF upload, chunking, and embedding pipeline
│   └── query.js         # Semantic retrieval and Gemini SSE streaming
├── services/
│   ├── pdfParser.js     # Text extraction from PDF buffers
│   ├── chunker.js       # Text splitting via LangChain textsplitters
│   ├── embedder.js      # Gemini embeddings + ChromaDB storage
│   └── retriever.js     # ChromaDB cosine search & similarity scoring
├── views/
│   ├── index.ejs        # Upload landing page
│   ├── chat.ejs         # Interactive chat interface with SSE streaming
│   └── error.ejs        # Error state page
├── public/
│   └── style.css        # Responsive styling and animations
├── .env.example         # Environment template
└── package.json         # Scripts and dependencies
```

---

## 🛡️ License

MIT
