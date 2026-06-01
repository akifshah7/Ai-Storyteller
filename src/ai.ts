import { streamText, Output } from "ai";
import { google } from "@ai-sdk/google";
import {
  StoryResponseSchema,
  type StoryResponse,
  type GameState,
} from "./schemas.ts";

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T | undefined;

const SYSTEM_PROMPT = `You are a storyteller for a text adventure game. Keep it short and easy to read.

Rules:
- Write in second person ("You see...", "You feel...")
- Max 2 short paragraphs per turn — no walls of text
- Use simple, clear words. Avoid flowery or complex language
- One key detail per scene — don't describe everything
- Choices must be clearly different from each other
- Build tension slowly — don't end the game too early
- Remember what the player did before and reference it briefly`;

export async function generateStoryTurn(
  state: GameState,
  playerAction: string,
  onChunk: (partial: DeepPartial<StoryResponse>) => void,
): Promise<StoryResponse> {
  const messages = [
    ...state.history,
    { role: "user" as const, content: playerAction },
  ];

  const result = streamText({
    model: google("gemini-3.1-flash-lite"),
    output: Output.object({ schema: StoryResponseSchema }),
    system: `${SYSTEM_PROMPT}\n\nGenre: ${state.genre}\nPlayer name: ${state.playerName}\nTurn: ${state.turnCount}`,
    messages,
    maxOutputTokens: 400,
  });

  for await (const partial of result.partialOutputStream) {
    onChunk(partial);
  }

  return await result.output as StoryResponse;
}

export async function generateOpening(
  state: GameState,
): Promise<StoryResponse> {
  const genrePrompts: Record<GameState["genre"], string> = {
    fantasy:
      "Begin a fantasy adventure. The player wakes in an unfamiliar tavern with no memory of how they got there.",
    "sci-fi":
      "Begin a sci-fi thriller. The player is the sole survivor on a drifting space station with flickering lights.",
    horror:
      "Begin a horror story. The player finds themselves in an abandoned house during a storm.",
    mystery:
      "Begin a mystery. The player is a detective who just received an anonymous note with a single address.",
    "post-apocalyptic":
      "Begin a survival story. The player emerges from an underground bunker for the first time in years.",
  };

  return generateStoryTurn(
    { ...state, history: [] },
    genrePrompts[state.genre],
    () => {},
  );
}
