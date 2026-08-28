/**
 * Cross-platform "tee" utility for Node.js.
 * Spawns a child process and pipes its stdout+stderr to both:
 *   - a log file (first argument)
 *   - the parent stdout (so `bun run dev` still shows output in the terminal)
 *
 * Usage:
 *   node scripts/tee-run.mjs <logfile> <command> [args...]
 *
 * Example:
 *   node scripts/tee-run.mjs dev.log next dev -p 3000
 *
 * On Windows and Linux/macOS, this works by constructing a full shell
 * command string and spawning with shell:true, which resolves binaries
 * like `next` from node_modules/.bin or the system PATH.
 */

import { spawn } from "node:child_process";
import { createWriteStream, mkdirSync } from "node:fs";
import { delimiter, dirname, join } from "node:path";

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: node tee-run.mjs <logfile> <command> [args...]");
  process.exit(1);
}

const logFile = args[0];
const command = args[1];
const commandArgs = args.slice(2);

// Ensure log directory exists
const logDir = dirname(logFile);
if (logDir && logDir !== ".") {
  mkdirSync(logDir, { recursive: true });
}

const logStream = createWriteStream(logFile, { flags: "w" });

// Build the full command string for shell execution.
// This ensures `next`, `prisma`, etc. are resolved via npx
// when they are local node_modules binaries not in the global PATH.
const fullCommand = [command, ...commandArgs].join(" ");

// Resolve npx path for reliability
const npxPath = join("node_modules", ".bin", command);

// Try to use the local binary first, fallback to npx
const child = spawn(fullCommand, [], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
  env: {
    ...process.env,
    // Ensure local node_modules/.bin is in PATH
    PATH: [
      join(process.cwd(), "node_modules", ".bin"),
      process.env.PATH,
    ].join(delimiter),
  },
});

// Pipe stdout → log file + terminal
child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  logStream.write(chunk);
});

// Pipe stderr → log file + terminal
child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  logStream.write(chunk);
});

child.on("close", (code) => {
  logStream.end(() => {
    process.exit(code ?? 0);
  });
});

child.on("error", (err) => {
  console.error(`Failed to spawn "${command}":`, err.message);
  process.exit(1);
});

// Forward signals to child
for (const sig of ["SIGINT", "SIGTERM", "SIGQUIT"]) {
  process.on(sig, () => {
    child.kill(sig);
  });
}
