const fs = require("fs/promises");
const path = require("path");

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "web");
const TARGET_ROOT = path.join(ROOT, "public", "game");

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyFile(sourcePath, targetPath) {
  await ensureDir(path.dirname(targetPath));
  await fs.copyFile(sourcePath, targetPath);
}

async function copyDir(sourceDir, targetDir) {
  await ensureDir(targetDir);
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDir(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      await copyFile(sourcePath, targetPath);
    }
  }
}

async function main() {
  const sourceIndex = path.join(SOURCE_ROOT, "index.html");
  const targetIndex = path.join(TARGET_ROOT, "index.html");
  const sourceAssets = path.join(SOURCE_ROOT, "assets");
  const targetAssets = path.join(TARGET_ROOT, "assets");

  await copyFile(sourceIndex, targetIndex);
  await copyDir(sourceAssets, targetAssets);
}

main().catch((error) => {
  console.error("sync-web failed:", error);
  process.exit(1);
});
