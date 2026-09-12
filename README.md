# Aspirant AI 🎯

An AI-powered internship matching and recommendation dashboard that helps students discover internships suited to their skills, interests, and goals.

## Overview

Finding the right internship can be overwhelming — too many listings, not enough personalization. **Aspirant AI** uses AI to match students with relevant internship opportunities based on their profile, skills, and preferences, presented through a simple dashboard.

## Features

- AI-powered internship recommendations tailored to the user's profile
- Interactive dashboard for browsing and managing matches
- *(Add: any other features — e.g. resume upload/parsing, saved internships, application tracking, filters)*

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (`server.ts`)
- *(Add: any AI/ML API used — e.g. OpenAI/Gemini API — plus database if any, e.g. MongoDB/Firebase)*

## Project Structure

```
Mahima-jha/
├── assets/.aistudio      # AI Studio assets
├── src/                  # Frontend source files
├── index.html            # Entry point
├── server.ts             # Backend server
├── package.json
├── .env.example          # Environment variable template
└── README.md
```

## Getting Started

### Prerequisites
- Node.js installed
- *(Add: any API keys required — copy `.env.example` to `.env` and fill in values)*

### Installation

```bash
git clone https://github.com/Mahimajha07/Mahima-jha.git
cd Mahima-jha
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Fill in required API keys/config in .env
```

### Running the App

```bash
npm run dev
```

*(Adjust the run command above to match your actual `package.json` scripts, e.g. `npm start` or `node server.ts`)*

## How It Works

*(Add: brief explanation of the matching logic — e.g. how user input is processed, what AI model/API powers the recommendations, and how results are ranked/displayed)*

## Future Improvements

- Add resume parsing for automatic skill extraction
- Add application status tracking
- Improve recommendation ranking with user feedback loops

## Author

**Mahima Jha** — First-year undergraduate, AI & Cyber Security, IIT Patna
[LinkedIn](https://linkedin.com/in/mahima-jha07)
