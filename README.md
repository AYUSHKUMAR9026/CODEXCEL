# 🧠 Codexcel — AI-Powered Data Analysis Platform
---

## 📌 What Is Codexcel?

Codexcel is a full-stack web application that allows users to **upload large datasets** (CSV or Excel files) and **ask questions about their data** using a conversational AI chatbot — all without writing a single line of code.

The core problem it solves: 
1)When you try to upload a large file to a regular AI (like ChatGPT), it throws a **"context limit exceeded"** error. Codexcel solves this using **RAG (Retrieval-Augmented Generation)** — a production-grade AI architecture that splits your file into chunks, converts them into vectors, and only retrieves the most relevant pieces when answering your question.


2)user can also save there files here which he can view whenever he want 
---

## ✨ Features

- 🔐 **Secure Authentication** — Sign up and login via Clerk
- 📂 **File Upload** — Drag and drop CSV or Excel (.xlsx) files
- 💾 **File Manager** — Save, view, download, and delete your files
- 🤖 **AI Chat** — Ask natural language questions about your data
- 🧩 **RAG System** — Handles files of any size using vector search
- ⚡ **Streaming Responses** — AI answers appear word by word in real time
- 🔒 **Data Privacy** — Each user can only access their own files

---

-


> ✅ **This project runs entirely on free tiers — no credit card required.**

---

## 🧠 How RAG Works in This Project

Traditional AI fails with large files because of context limits. RAG solves this:

**Without RAG:**
```
Upload 10MB file → Send entire file to AI → ❌ Error: Context limit exceeded
```

**With RAG:**
```
Upload 10MB file
→ Split into 50-row chunks
→ Convert each chunk to a 384-number vector (mathematical meaning)
→ Store vectors in Pinecone

User asks "What is Somalia's rank?"
→ Convert question to vector
→ Pinecone finds top 5 chunks most similar to the question
→ Send only those 5 chunks to AI
→ ✅ Accurate answer, no context limit, works for any file size
```

---

---


## 🙋 Author

Built by **Ayush Kumar**

> ⭐ If you found this project helpful, please give it a star on GitHub!
