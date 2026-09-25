# LexiClean — Intelligent Text Cleaning & Automata Preprocessor

> A production-oriented text normalization engine that combines Natural Language Processing with Theory of Computation using Deterministic Finite Automata (DFA).

LexiClean is an intelligent text cleaning and normalization system designed to transform noisy, unstructured text into clean and consistent data suitable for **Machine Learning, NLP pipelines, tokenization, and LLM-based applications**.

The system combines practical text-processing techniques with formal **Finite Automata theory**, providing both a usable cleaning engine and an interactive visualization of how deterministic state machines process text.

---

## Overview

Real-world text data frequently contains unwanted elements such as:

- HTML/XML tags
- URLs and web links
- Excessive whitespace
- Repeated words
- Emojis and unwanted symbols
- Noise punctuation
- Inconsistent letter casing
- Other formatting artifacts

LexiClean detects and removes these patterns through a deterministic streaming pipeline.

Instead of treating text cleaning as only a collection of regular-expression operations, the project demonstrates how these patterns can be modeled using **Deterministic Finite Automata (DFA)**.

---

## Key Features

### Interactive Text Cleaning

- Live raw-text editor
- Real-time normalized output
- Cleaning statistics
- Processing latency measurement
- Noise reduction percentage
- Duplicate-token detection
- Configurable cleaning rules

### Intelligent Noise Detection

LexiClean can identify and process:

- HTML/XML markup
- URLs
- Excess spaces and tabs
- Consecutive duplicate words
- Emojis
- Noise punctuation
- Case inconsistencies

### DFA-Based Processing

The project provides DFA models for different cleaning operations.

Examples include:

- HTML tag recognition
- Whitespace compression
- URL recognition
- Token processing

The automata can be visualized and simulated character by character.

### Interactive DFA Simulator

The simulator provides:

- Play/Pause
- Step Forward
- Step Backward
- Reset
- Processing speed control
- Input tape visualization
- Current-state highlighting
- Transition visualization
- Accepted/Rejected state indication

This makes the theoretical DFA model easier to understand through practical execution.

### Dataset & File Processing

Supported input formats include:

- `.txt`
- `.csv`
- `.json`
- `.html`

The system can inspect raw files, detect noise, clean the content, and generate normalized output.

For CSV files, text columns can be processed while maintaining the dataset structure.

### Batch Processing

The batch processor supports:

- Multiple files
- Drag-and-drop file queues
- File metadata
- Processing status
- Noise reduction statistics
- Direct inspection of individual files

### REST API

LexiClean also provides an HTTP API for integrating text normalization into external applications.

Example endpoint:

```http
POST /api/clean
