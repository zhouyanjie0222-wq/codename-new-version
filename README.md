# Classroom Codenames: English Vocabulary Edition

A polished, high-density version of the classic Codenames board game, tailored for classroom use by English teachers. This application integrates the official 400-word Codenames vocabulary with AI-powered features to help students learn English definitions while playing.

## Sharing with Students

To share this game with your students so they can play without needing an AI Studio account, you have several options:

### 1. Deploy to Cloud Run (Easiest & Fastest)
AI Studio has a built-in feature to host your app on Google Cloud Run with just a few clicks:
1. Click the **Share** button in the top-right header of AI Studio.
2. Select **Deploy to Cloud Run** from the options.
3. Follow the instructions to name your service and select a region (usually the one closest to you).
4. AI Studio will build your app and provide you with a **permanent public URL** (e.g., `https://english-vocab-codenames-xyz.a.run.app`).
5. Share this URL with your students! No sign-in or AI Studio account is required for them to play.

### 2. Export to GitHub (Recommended for Long-term Use)
If you want to keep the game permanently or use tools like GitHub Pages:
1. Click the **Settings** (gear icon) or the **Export** button in AI Studio.
2. Choose **Export to GitHub**.
3. Once the code is in your GitHub repository, you can enable **GitHub Pages** in the repository settings to host it for free.

### Troubleshooting: Why is my GitHub page blank?
If you see a blank page after exporting to GitHub, it's usually because the browser is trying to run the "raw source code" (like `.tsx` files) instead of the finished website. To fix this:

1. **Build the project**: Websites can't read `.tsx` files directly. You must run `npm run build` in your terminal. This creates a `dist` folder, which contains the real website files.
2. **Setup your environment**: Ensure your GitHub environment has your `GEMINI_API_KEY`.
3. **If using GitHub Pages**:
   - Go to your repository **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, change "Deploy from a branch" to "GitHub Actions".
   - Search for the "Static HTML" or "Vite" template to automate the build process.
   - Alternatively, ensure your `vite.config.ts` has the correct `base` path (e.g., `base: './'`).

---

## Deployment & Security Note
When hosting this app outside of AI Studio, ensure you handle your **GEMINI_API_KEY** securely. 
- **Static Hosting (e.g., GitHub Pages):** If you host using GitHub Pages, the API key is technically visible to anyone who looks at the website's code. For a classroom setting, this is often acceptable, but for larger apps, a backend proxy is recommended.
- **Environmental Variables:** Most hosting providers (Vercel, Netlify) have a section for "Environment Variables" where you should paste your Gemini API key.

---

## Features

- **Authentic Gameplay**: 5x5 grid with official 8 Red, 8 Blue, 7 Neutral, and 1 Assassin card layout.
- **Official Vocabulary**: Includes the full 400-word list from the original Codenames board game.
- **Teacher Mode**:
  - **Manual Input**: Teachers can input custom English words.
  - **AI Random Model**: Use Gemini to generate 25 random educational nouns instantly.
  - **Classic Mode**: Quickly reset the board using official Codenames vocabulary.
- **Vocabulary Study Enrichment**:
  - Click any revealed card to fetch a simple English definition and example sentence using the Gemini API.
- **Dual View Modes**:
  - **Player View**: Clean card interface for students.
  - **Spymaster View**: Reveals all identities and layout for the teacher/clue-giver.
- **High-Density Design**: Professional, information-dense layout optimized for full-screen classroom projection.
- **Built-in Timer & Scoring**: Track turn time and remaining agents for each team.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd classroom-codenames
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Motion (Framer Motion)
- **Icons**: Lucide React
- **AI**: Google Gemini API (@google/genai)
- **Design Pattern**: High Density Theme

## License

Apache-2.0
