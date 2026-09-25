# LexiClean — Intelligent Text Cleaning & Automata Preprocessor

> A Theory of Computation (TOC) based intelligent text cleaning and normalization system that uses Deterministic Finite Automata (DFA) and regular-language concepts for NLP and Machine Learning preprocessing.

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
```

The project demonstrates how regular-language patterns can be represented and processed using finite-state machines.

---

# 🔢 DFA Mathematical Model

A Deterministic Finite Automaton is formally represented as:

```text
M = (Q, Σ, δ, q₀, F)
```

Where:

| Symbol | Meaning |
|---|---|
| `Q` | Finite set of states |
| `Σ` | Input alphabet |
| `δ` | Deterministic transition function |
| `q₀` | Initial state |
| `F` | Set of accepting states |

In LexiClean, different cleaning operations can be represented through their own state-transition models.

---

# 🔄 System Architecture

```text
┌──────────────────────────────────────────────────────┐
│                  RAW INPUT DATA                      │
│                                                      │
│ User Text / TXT / CSV / JSON / HTML                 │
└─────────────────────────┬────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────┐
│                NOISE DETECTOR & SCANNER              │
│                                                      │
│ HTML | URLs | Emojis | Duplicates | Whitespace      │
│ Noise Symbols | Formatting Artifacts                 │
└─────────────────────────┬────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────┐
│          DETERMINISTIC CLEANING PIPELINE             │
│                     O(n) STREAM                      │
└─────────────────────────┬────────────────────────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│   HTML DFA     │ │    URL DFA     │ │ Whitespace DFA │
│                │ │                │ │                │
│ Tag Detection  │ │ URL Detection  │ │ Space/Tab      │
│ & Removal      │ │ & Removal      │ │ Compression    │
└───────┬────────┘ └───────┬────────┘ └───────┬────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │ TOKEN DEDUPLICATION      │
              │                          │
              │ Collapse consecutive     │
              │ repeated tokens          │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │ NORMALIZED CLEAN OUTPUT  │
              │                          │
              │ NLP / ML / LLM Ready     │
              └──────────────────────────┘
```

---

# 🧹 Text Cleaning Pipeline

LexiClean can detect and process different types of unwanted text patterns.

```text
Raw Text
   │
   ▼
HTML Detection
   │
   ▼
URL Detection
   │
   ▼
Whitespace Processing
   │
   ▼
Duplicate Token Detection
   │
   ▼
Emoji / Symbol Filtering
   │
   ▼
Case Normalization
   │
   ▼
Clean Text
```

---

# ⚙️ Core Cleaning Operations

## 1. HTML / XML Tag Removal

Detects markup such as:

```html
<div>Hello World</div>
<p>Welcome</p>
```

and removes the markup while preserving useful text.

### DFA Concept

```text
                 '<'
                  |
                  v
             ┌────────┐
             │   q0   │
             └───┬────┘
                 │
                 ▼
             ┌────────┐
             │   q1   │
             │Inside  │
             │  Tag   │
             └───┬────┘
                 │
                 │ '>'
                 ▼
            ((  q2  ))
             Accept
```

---

# 2. Whitespace Compression

The whitespace DFA identifies unnecessary consecutive spaces and tabs.

Example:

```text
Input:
Hello     World

Output:
Hello World
```

### DFA Model

```text
        space
   ┌──────────────┐
   │              ▼
┌───────┐      ┌───────┐
│  q0   │ ───> │  q1   │
└───▲───┘      └───┬───┘
    │              │
    │ character    │ space
    │              ▼
    │          (( q2 ))
    │
    └────────────────
```

The first valid space can be preserved, while subsequent redundant spaces can be treated as noise.

---

# 3. URL Recognition

The system identifies URLs and common web-link patterns.

Examples:

```text
https://example.com
http://example.com
www.example.com
ftp://example.com
```

These can then be removed or processed according to the selected cleaning rules.

---

# 4. Duplicate Token Detection

LexiClean detects consecutive repeated tokens.

Example:

```text
Input:

verified verified verified

Output:

verified
```

This reduces unnecessary repetition in noisy datasets.

---

# 5. Emoji & Symbol Filtering

The cleaning pipeline can identify unwanted emojis and noise symbols and remove them according to the active rule configuration.

---

# 6. Case Normalization

Text can optionally be normalized to a consistent case according to the selected processing rules.

---

# 🖥️ Application Modules

LexiClean is organized into multiple functional modules.

---

## 1. Interactive Studio

The Interactive Studio provides a live environment for text processing.

### Features

- Raw text editor
- Clean text output
- Real-time processing
- KPI metrics
- Noise reduction percentage
- Duplicate count
- Execution latency
- Processing throughput
- Cleaning-rule controls
- Audit log

### Processing Flow

```text
┌───────────────┐
│   RAW TEXT    │
└───────┬───────┘
        │
        ▼
┌──────────────────┐
│ Cleaning Rules   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ DFA Processing   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ CLEAN TEXT       │
└──────────────────┘
```

---

# 📂 2. Data & File Inspector

The Data & File Inspector allows users to inspect and process complete datasets.

### Raw Data Box

Displays:

- Original file content
- HTML count
- URL count
- Emoji count
- Duplicate words
- Excess whitespace
- Other detected noise

### Clean Data Box

Displays:

- Normalized content
- Sanitized text
- Copy-to-clipboard option
- Download option

### Supported Formats

```text
TXT
CSV
JSON
HTML
```

For CSV datasets, the system can process the relevant text columns while maintaining the dataset structure.

---

# 🤖 3. Automata Architecture & DFA Simulator

This module provides an interactive representation of the automata used by the cleaning engine.

### Features

- DFA state visualization
- State circles
- Accepting states
- Directed transitions
- Self-loops
- State highlighting
- Input tape
- Step-by-step execution
- Play / Pause
- Step Forward
- Step Backward
- Reset
- Speed control
- Accepted / Rejected status

### DFA Simulation Flow

```text
Input String
     │
     ▼
┌─────────┐
│   q0    │
└────┬────┘
     │
     ▼
┌─────────┐
│   q1    │
└────┬────┘
     │
     ▼
┌─────────┐
│   q2    │
└────┬────┘
     │
     ▼
Accepted / Rejected
```

---

# 📦 4. Batch Dataset Processor

The batch processor allows multiple files to be processed.

```text
┌──────────────────────────┐
│       FILE QUEUE         │
├──────────────────────────┤
│ dataset1.csv             │
│ dataset2.txt             │
│ webpage.html             │
│ reviews.json             │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│    BATCH PROCESSOR       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│    CLEANED DATASETS      │
└──────────────────────────┘
```

### File Information

The system can display:

- File size
- File extension
- Processing status
- Noise percentage removed
- Inspection option

---

# 🌐 5. REST API

LexiClean provides a REST API for integrating the cleaning engine with other applications.

## Endpoint

```http
POST /api/clean
```

## Example Request

```bash
curl -X POST http://localhost:3000/api/clean \
-H "Content-Type: application/json" \
-d '{"text":"Hello     world!!!"}'
```

## Example Request Body

```json
{
  "text": "Hello     world!!!"
}
```

## Example Response

```json
{
  "cleanedText": "Hello world!"
}
```

The API allows external applications to use the text-normalization engine programmatically.

---

# 📊 Performance & Complexity

The DFA-based processing model is designed around deterministic state transitions.

For an input of length `n`:

```text
Time Complexity:

O(n)
```

Each input character can be processed through deterministic transitions without exploring multiple backtracking paths in the DFA components.

### Complexity Comparison

| Metric | LexiClean DFA Engine | Traditional Backtracking Regex |
|---|---|---|
| Processing Model | Deterministic | Backtracking |
| Worst-Case Time | O(n) for DFA stream | Can degrade significantly on pathological inputs |
| State Processing | Deterministic | Multiple possible backtracking paths |
| Streaming | Yes | Depends on engine/pattern |
| ReDoS Exposure | Avoids backtracking in DFA components | Some patterns can be vulnerable |
| Processing Predictability | High | Pattern dependent |

---

# 🔐 ReDoS Consideration

Regular-expression engines that rely on backtracking can encounter excessive computation for specially constructed patterns and inputs.

LexiClean's DFA-based processing model avoids backtracking states for its automata components.

```text
Backtracking Regex

Input
  |
  +----> Path 1
  |
  +----> Path 2
  |
  +----> Path 3
  |
  +----> ...
  
Potentially large search space


DFA

Input Character
      |
      v
Current State
      |
      v
One Deterministic Transition
      |
      v
Next State
```

This provides a predictable state-transition model for the DFA-based cleaning operations.

---

# 🧪 Example

## Raw Input

```text
<div>Hello     World!!!</div>

Visit https://example.com

verified verified verified
```

## Processing

```text
HTML Detection
       ↓
URL Detection
       ↓
Whitespace Compression
       ↓
Duplicate Detection
       ↓
Normalization
```

## Clean Output

```text
Hello World!!!

Visit

verified
```

---

# 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 19 | User interface |
| Language | TypeScript | Type-safe frontend development |
| Build Tool | Vite | Development and build pipeline |
| Styling | Tailwind CSS v4 | UI styling |
| Visualization | SVG | DFA state visualization |
| Icons | Lucide React | Interface icons |
| Algorithms | DFA + Regex | Text processing |
| Backend / CLI | Python 3.10+ | Processing engine / CLI |
| API Server | Node.js HTTP Server | REST API |
| Data | TXT / CSV / JSON / HTML | Dataset processing |

---

# 🏗️ Project Architecture

```text
                    ┌───────────────────────┐
                    │        FRONTEND       │
                    │     React + TS        │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    TEXT PROCESSOR     │
                    │                       │
                    │ DFA + Regex Rules     │
                    └───────────┬───────────┘
                                │
               ┌────────────────┼────────────────┐
               │                │                │
               ▼                ▼                ▼
        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
        │  HTML DFA   │  │   URL DFA   │  │  Space DFA  │
        └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
               │                │                │
               └────────────────┼────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ TOKEN DEDUPLICATION   │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ NORMALIZED TEXT       │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
          NLP / ML            LLMs           API Clients
```

---

# 📁 Project Structure

```text
LexiClean/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── backend/
│   ├── cleaner/
│   ├── api/
│   └── ...
│
├── cli/
│   └── ...
│
├── datasets/
│   └── ...
│
├── docs/
│   └── ...
│
├── README.md
├── package.json
└── ...
```

> Update this structure according to the actual folders present in the repository.

---

# 🚀 Installation & Setup

## Prerequisites

Install the following:

```text
Node.js
npm
Python 3.10+
Git
```

---

## Clone Repository

```bash
git clone <YOUR-REPOSITORY-URL>
```

```bash
cd LexiClean
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

The application will start using the Vite development server.

---

# 🔬 Why DFA for Text Cleaning?

The main academic purpose of LexiClean is to demonstrate that concepts from Theory of Computation can be applied to practical software systems.

Traditional text processing often uses regular expressions directly.

LexiClean goes one step further by representing important cleaning operations through deterministic state machines.

```text
THEORY OF COMPUTATION
          │
          ▼
   REGULAR LANGUAGES
          │
          ▼
         DFA
          │
          ▼
DETERMINISTIC PROCESSING
          │
          ▼
    TEXT CLEANING
          │
          ▼
        NLP / ML
```

This makes the project both a practical preprocessing tool and an educational demonstration of automata theory.

---

# 🎓 Educational Value

LexiClean demonstrates the connection between theoretical computer science and practical software engineering.

It covers:

- Formal Languages
- Regular Languages
- Regular Expressions
- NFA
- DFA
- DFA Construction
- Subset Construction
- DFA Minimization
- Finite-State Processing
- Text Normalization
- NLP Preprocessing
- Dataset Processing
- Algorithm Complexity

---

# 💡 Design Rationale

## Why DFA Instead of Only Regex?

DFA provides deterministic state transitions and a streaming processing model.

This makes the processing behavior predictable and avoids backtracking within the DFA-based components.

---

## Why an Interactive DFA Simulator?

Theory of Computation is often taught using mathematical definitions and state diagrams.

LexiClean makes the concept interactive by allowing users to:

```text
Enter Input
     ↓
Read Character
     ↓
Transition State
     ↓
Observe DFA
     ↓
Continue Processing
     ↓
Accept / Reject
```

This helps demonstrate how an abstract automaton operates on real input.

---

## Why Dataset Processing?

Real-world NLP systems require large amounts of raw text preprocessing.

LexiClean therefore extends beyond individual strings and provides support for:

- Text files
- CSV datasets
- JSON data
- HTML content
- Batch processing

---

# 📈 Use Cases

LexiClean can be used for:

- NLP dataset preprocessing
- Machine Learning data cleaning
- Text normalization
- Web-data preprocessing
- LLM input preprocessing
- Dataset inspection
- Batch text processing
- DFA education
- Automata visualization
- Regular-language experiments
- REST-based text processing

---

# 🔮 Future Scope

Possible future improvements include:

- Multilingual text normalization
- Advanced NLP tokenization
- Custom DFA rule creation
- User-defined cleaning pipelines
- Database integration
- Cloud deployment
- Large-scale distributed processing
- Advanced ML preprocessing
- Automatic dataset quality reports
- Model-ready dataset export
- Additional file formats
- Authentication and user workspaces

---

# 📚 Academic Concepts Used

```text
Theory of Computation
        │
        ├── Formal Languages
        ├── Regular Languages
        ├── Regular Expressions
        ├── NFA
        ├── DFA
        ├── Transition Functions
        ├── State Machines
        ├── Subset Construction
        └── DFA Minimization

Natural Language Processing
        │
        ├── Text Cleaning
        ├── Text Normalization
        ├── Token Processing
        └── Dataset Preprocessing
```

---

# 📋 Project Summary

| Category | Details |
|---|---|
| Project Name | LexiClean |
| Project Type | Theory of Computation Project |
| Domain | TOC + NLP |
| Core Concept | Deterministic Finite Automata |
| Processing | DFA + Regex |
| Frontend | React + TypeScript |
| Backend / CLI | Python |
| API | Node.js REST API |
| Visualization | SVG |
| Input Formats | TXT, CSV, JSON, HTML |
| Main Purpose | Text Cleaning & Normalization |

---

# 👨‍💻 Project Highlights

- TOC-based practical application
- DFA-driven text processing
- Interactive automata visualization
- Real-time text cleaning
- Dataset inspection
- Batch processing
- REST API
- NLP/ML-ready output
- Complexity analysis
- Formal mathematical foundation

---

# 📄 License

This project is developed for educational and academic purposes.

---

# ⭐ LexiClean

> **From Theory of Computation to Practical NLP Text Processing.**
