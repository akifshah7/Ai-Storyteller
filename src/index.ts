import * as readline from "readline";
import chalk from "chalk";
import { generateStoryTurn, generateOpening } from "./ai.ts";
import {
  printBanner,
  printNarrative,
  printChoices,
  printGameOver,
  printStatus,
  printThinking,
  printStreamChunk,
  clearLine,
} from "./display.ts";
import type { GameState, StoryResponse } from "./schemas.ts";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function pickGenre(): Promise<GameState["genre"]> {
  const genres: GameState["genre"][] = [
    "fantasy",
    "sci-fi",
    "horror",
    "mystery",
    "post-apocalyptic",
  ];
  console.log(chalk.bold.white("  Choose your genre:\n"));
  genres.forEach((g, i) => {
    console.log(chalk.cyan(`  [${i + 1}]`) + chalk.white(` ${g}`));
  });
  console.log();

  while (true) {
    const input = await ask(chalk.bold("  > "));
    const num = parseInt(input);
    if (num >= 1 && num <= genres.length) return genres[num - 1];
    const match = genres.find((g) => g === input.toLowerCase());
    if (match) return match;
    console.log(chalk.red("  Please enter a number 1-5 or genre name."));
  }
}

async function getPlayerAction(choices: string[]): Promise<string> {
  const input = await ask(chalk.bold.cyan("  > "));
  const num = parseInt(input);
  if (num >= 1 && num <= choices.length) {
    return choices[num - 1];
  }
  return input; // free-form action
}

async function main() {
  printBanner();

  const playerName = await ask(chalk.bold("  Enter your name, adventurer: "));
  console.log();
  const genre = await pickGenre();

  const state: GameState = {
    genre,
    playerName: playerName || "Stranger",
    turnCount: 0,
    history: [],
  };

  console.log(chalk.dim("\n  Generating your story...\n"));

  // Generate opening
  printThinking();
  let lastNarrative = "";

  const opening = await generateOpening(state);
  clearLine();

  state.turnCount = 1;
  printStatus(state);
  printNarrative(opening.narrative, opening.mood);
  printChoices(opening.choices);

  // Store opening in history
  state.history.push({
    role: "assistant",
    content: JSON.stringify(opening),
  });

  // Main game loop
  while (true) {
    const action = await getPlayerAction(opening.choices);

    if (action.toLowerCase() === "quit" || action.toLowerCase() === "exit") {
      console.log(
        chalk.yellow("\n  Thanks for playing! Your story ends here.\n"),
      );
      break;
    }

    state.history.push({ role: "user", content: action });
    state.turnCount++;

    printThinking();
    lastNarrative = "";

    let finalResponse!: StoryResponse;

    try {
      finalResponse = await generateStoryTurn(state, action, (partial) => {
        if (partial.narrative && partial.narrative !== lastNarrative) {
          lastNarrative = partial.narrative;
          printStreamChunk(partial.narrative);
        }
      });
    } catch (err) {
      clearLine();
      const message =
        err instanceof Error ? err.message.split("\n")[0] : "Unknown error";
      console.log(chalk.red(`\n  Something went wrong: ${message}\n`));
      console.log(chalk.dim("  Try a different action, or type 'quit' to exit.\n"));
      continue;
    }

    clearLine();
    console.log(); // newline after streaming

    printStatus(state);
    printNarrative(finalResponse.narrative, finalResponse.mood);

    state.history.push({
      role: "assistant",
      content: JSON.stringify(finalResponse),
    });

    if (finalResponse.isGameOver) {
      printGameOver(finalResponse.gameOverReason);
      const again = await ask(chalk.bold("  Play again? (y/n): "));
      if (again.toLowerCase() === "y") {
        rl.close();
        main();
        return;
      }
      break;
    }

    printChoices(finalResponse.choices);
  }

  rl.close();
}

main().catch((err) => {
  console.error(chalk.red("Fatal error:"), err);
  process.exit(1);
});
