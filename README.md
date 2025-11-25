# JourneyMate 🚗

A proactive travel companion app that uses **Google Gemini 2.5 Flash** with **Maps Grounding** to provide real-time, location-aware trivia and smart stop suggestions.

## Features

- **📍 Interactive Map**: Visualizes journey from Dallas to Austin (or anywhere via teleport).
- **🤖 Gemini AI Trivia**: "Grounded" trivia that cites real Google Maps sources.
- **🎙️ DJ Mode**: Hands-free experience using Text-to-Speech to read trivia aloud.
- **🎭 AI Personas**: Switch between "Local Guide," "Historian," "Comedian," or "Foodie."
- **🔐 Auth**: Simulated authentication system (email/Google).

## Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   - Rename `.env.example` to `.env`
   - Add your Google Gemini API Key:
     ```
     API_KEY=AIzaSy...
     ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Usage**
   - **Login**: Use any email (e.g., `demo@test.com`) and password (`pass`).
   - **Drive**: Click "Drive" to simulate the route.
   - **Teleport**: Click anywhere on the map to instantly move there and get local AI trivia.
   - **DJ Mode**: Click the speaker icon to hear the AI speak.
