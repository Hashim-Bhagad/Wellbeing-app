# Health Well-Being App

A web-based health management application helping users tracks health reports, receive AI-powered dietary suggestions, and maintain regular checkup schedules.

## Features
- **Health Report Analysis**: Upload PDF reports to get AI-driven insights (Gemini API).
- **Dietary Suggestions**: Personalized food recommendations based on your report.
- **Trend Analysis**: Visual overview of your health parameters.
- **BMI Calculator**: Calculate and track your Body Mass Index.
- **Reminders**: Automatic quarterly checkup reminders.

## Tech Stack
- **Backend**: FastAPI, MongoDB (Motor), Python
- **Frontend**: React (Vite), Tailwind CSS
- **AI**: Google Gemini API

## Prerequisites
- Python 3.9+
- Node.js 16+
- MongoDB (running locally on port 27017)
- Google Gemini API Key

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Configuration**:
1. Rename `.env.example` to `.env`.
2. Edit `.env` and add your `GEMINI_API_KEY`.

**Run Server**:
```bash
uvicorn app.main:app --reload
```
API will be available at `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Run Client**:
```bash
npm run dev
```
App will be available at `http://localhost:5173`.

## Usage
1. Register a new account.
2. Go to "Upload Report" and upload a sample health PDF.
3. View the analysis and dietary suggestions.
4. Check the Dashboard for reminders.

## Troubleshooting
- If `npm install` fails, try deleting `node_modules` and running `npm install` again.
- Ensure MongoDB is running before starting the backend.
