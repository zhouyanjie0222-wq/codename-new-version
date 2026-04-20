# Classroom Codenames: English Vocabulary Edition

A polished, high-density version of the classic Codenames board game, tailored for classroom use by English teachers. This application integrates the official 400-word Codenames vocabulary with AI-powered features to help students learn English definitions while playing.

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
