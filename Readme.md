# ✦ AI Storyteller CLI

An interactive AI-powered text adventure that runs in your terminal. Every playthrough is unique — the story reacts to your choices in real time using streaming structured AI responses.

![demo](https://github.com/user-attachments/assets/e6c5612a-0c85-4e47-9045-9a28cb992afc)

## Features

- 🎭 **5 genres** — Fantasy, Sci-Fi, Horror, Mystery, Post-Apocalyptic
- ⚡ **Streaming output** — watch the story unfold word by word
- 🧠 **Structured AI responses** with Zod schema validation
- 🎨 **Mood-aware colors** — the terminal theme shifts with the story's tone
- ✍️ **Free-form input** — pick a numbered choice or type your own action
- 🔁 **Full conversation history** — the AI remembers every decision you've made

## Tech Stack

- [Vercel AI SDK](https://sdk.vercel.ai) — streaming + structured output
- [Google Gemini 2.0 Flash](https://ai.google.dev) — free AI model
- [Zod](https://zod.dev) — runtime schema validation
- [Chalk](https://github.com/chalk/chalk) — terminal colors
- TypeScript + Node.js

## Setup

### 1. Clone the repo

```bash
https://github.com/akifshah7/Ai-Storyteller.git
cd Ai-Storyteller
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a free Gemini API key

Go to [Google AI Studio](https://aistudio.google.com/apikey) and create a free API key.

### 4. Set up your environment

```bash
cp .env.example .env
# Edit .env and paste your key
```

### 5. Run

```bash
npm start
```

## How it works

Each turn, the AI returns a **structured JSON response** validated by Zod:

```ts
{
  narrative: string,      // The story text
  choices: string[],      // 2-4 possible actions
  mood: "tense" | "mysterious" | ...,
  isGameOver: boolean,
  gameOverReason?: string
}
```

This ensures the AI always returns valid, usable data — no parsing hacks needed.

## License

MIT
