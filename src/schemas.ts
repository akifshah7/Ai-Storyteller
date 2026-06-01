import { z } from "zod";

export const StoryResponseSchema = z.object({
  narrative: z
    .string()
    .describe(
      "The story text shown to the player (2-4 paragraphs, vivid and immersive)",
    ),
  choices: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("2-4 possible actions the player can take next"),
  mood: z
    .enum([
      "tense",
      "mysterious",
      "hopeful",
      "dark",
      "triumphant",
      "eerie",
      "calm",
    ])
    .describe("The current emotional tone of the scene"),
  isGameOver: z
    .boolean()
    .describe(
      "True only if the player has died or the story has reached a definitive end",
    ),
  gameOverReason: z
    .string()
    .optional()
    .describe(
      "If isGameOver is true, a short poetic description of how it ended",
    ),
  maxTokens: z
    .number()
    .optional()  
});

export type StoryResponse = z.infer<typeof StoryResponseSchema>;

export const GameStateSchema = z.object({
  genre: z.enum(["fantasy", "sci-fi", "horror", "mystery", "post-apocalyptic"]),
  playerName: z.string(),
  turnCount: z.number(),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export type GameState = z.infer<typeof GameStateSchema>;
