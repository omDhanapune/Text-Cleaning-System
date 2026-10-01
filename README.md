# LexiClean — Intelligent Text Cleaning & Automata Preprocessor

> A Theory of Computation (TOC) based intelligent text cleaning and normalization system that uses Deterministic Finite Automata (DFA) and regular-language concepts for NLP and Machine Learning preprocessing.

---

# 👥 Team

**Team Members:**
1. Om Dhanapune
2. Gayatri Rajput
3. Yash Dane

---

## 📌 Project Overview

**LexiClean** is an intelligent text cleaning and normalization system developed as a **Theory of Computation (TOC) project** with practical applications in **Natural Language Processing (NLP)** and **Machine Learning (ML)**.

The system processes raw and noisy text and converts it into clean, normalized data suitable for downstream NLP pipelines, ML datasets, tokenizers, and LLM-based applications.

LexiClean combines:

- Theory of Computation
- Regular Languages
- Regular Expressions
- Deterministic Finite Automata
- Text Normalization
- NLP Preprocessing
- Dataset Processing
- REST API Integration

The core architecture uses a **Deterministic Finite Automata and regular-grammar streaming approach** for text processing.

---

# 🎯 Objectives

The main objectives of LexiClean are:

1. Apply Theory of Computation concepts to a practical software system.
2. Implement text-cleaning operations using deterministic state-based processing.
3. Remove common noise from raw text and datasets.
4. Prepare text for NLP and Machine Learning pipelines.
5. Visualize DFA states and transitions interactively.
6. Provide step-by-step DFA simulation.
7. Support multiple dataset formats.
8. Provide batch dataset processing.
9. Provide REST API access to the cleaning engine.
10. Demonstrate the practical relationship between formal languages and NLP.

---

# 🧠 Theory of Computation Foundation

LexiClean is primarily based on concepts from **Theory of Computation (TOC)**.

The project uses the relationship between:

```text
Regular Expressions
       |
       v
      NFA
       |
       | Thompson's Construction
       v
      DFA
       |
       | Subset / Powerset Construction
       v
  Minimized DFA
       |
       v
Deterministic Text Processing
