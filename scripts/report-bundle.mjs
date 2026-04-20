import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const assetsDir = path.join(root, "dist", "assets");
const reportDir = path.join(root, "dist", "reports");
const reportPath = path.join(reportDir, "bundle-top-chunks.md");
const TOP_N = 15;

const formatKB = (bytes) => `${(bytes / 1024).toFixed(2)} kB`;
const now = new Date().toISOString().replace("T", " ").slice(0, 19);

const files = await readdir(assetsDir);
const chunkRows = [];

for (const file of files) {
    if (!file.endsWith(".js") && !file.endsWith(".css")) {
        continue;
    }
    const fullPath = path.join(assetsDir, file);
    const meta = await stat(fullPath);
    chunkRows.push({
        file,
        bytes: meta.size,
        type: file.endsWith(".css") ? "css" : "js",
    });
}

chunkRows.sort((a, b) => b.bytes - a.bytes);
const topChunks = chunkRows.slice(0, TOP_N);

await mkdir(reportDir, { recursive: true });

const lines = [
    "# Bundle Top Chunks",
    "",
    `Generated at: ${now} (local time)`,
    "",
    "| Rank | File | Type | Size |",
    "| --- | --- | --- | --- |",
    ...topChunks.map(
        (chunk, index) =>
            `| ${index + 1} | ${chunk.file} | ${chunk.type} | ${formatKB(
                chunk.bytes,
            )} |`,
    ),
    "",
    "## Notes",
    "",
    "- This report is generated from `dist/assets` after a successful production build.",
    "- Keep this file in CI artifacts or attach it to release notes for trend tracking.",
    "",
];

await writeFile(reportPath, lines.join("\n"), "utf8");
console.log(`Bundle report written to ${path.relative(root, reportPath)}`);
