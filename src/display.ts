import chalk, { type ChalkInstance } from "chalk";
import type { StoryResponse, GameState } from "./schemas.ts";

const MOOD_COLORS: Record<StoryResponse["mood"], ChalkInstance> = {
  tense: chalk.red,
  mysterious: chalk.magenta,
  hopeful: chalk.green,
  dark: chalk.gray,
  triumphant: chalk.yellow,
  eerie: chalk.cyan,
  calm: chalk.blue,
};

export function clearLine() {
  process.stdout.write("\r\x1b[K");
}

export function printBanner() {
  console.log(chalk.bold.yellow("\n╔══════════════════════════════════════╗"));
  console.log(chalk.bold.yellow("║      ✦  AI STORYTELLER CLI  ✦        ║"));
  console.log(chalk.bold.yellow("╚══════════════════════════════════════╝\n"));
}

export function printNarrative(text: string, mood: StoryResponse["mood"]) {
  const color = MOOD_COLORS[mood] ?? chalk.white;
  const lines = text.split("\n").filter(Boolean);
  console.log();
  for (const line of lines) {
    console.log(color("  " + line));
  }
  console.log();
}

export function printChoices(choices: string[]) {
  console.log(chalk.bold.white("  What do you do?\n"));
  choices.forEach((choice, i) => {
    console.log(chalk.bold.cyan(`  [${i + 1}]`) + chalk.white(` ${choice}`));
  });
  console.log(chalk.dim("\n  Or type your own action freely.\n"));
}

export function printGameOver(reason?: string) {
  console.log(chalk.bold.red("\n  ✦ GAME OVER ✦\n"));
  if (reason) {
    console.log(chalk.italic.gray(`  ${reason}\n`));
  }
}

export function printStatus(state: GameState) {
  console.log(
    chalk.dim(
      `  ─── Turn ${state.turnCount} · ${state.genre.toUpperCase()} · ${state.playerName} ───\n`,
    ),
  );
}

export function printThinking() {
  process.stdout.write(chalk.dim("  ✦ The story unfolds..."));
}

export function printStreamChunk(narrative: string | undefined) {
  if (!narrative) return;
  // Clear "thinking" line on first chunk
  clearLine();
  process.stdout.write(chalk.magenta("\r  " + narrative.slice(-80)));
}
