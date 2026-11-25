#!/usr/bin/env node
// Headless email review.
// Usage: node scripts/review.mjs <campaign folder>
// Exit codes: 0 = no high-severity findings, 1 = at least one high finding,
//             2 = usage error, or Claude failed / returned no structured output.
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const folder = process.argv[2];
if (!folder) {
  console.error("Usage: node scripts/review.mjs <campaign folder>");
  process.exit(2);
}
if (!existsSync(folder)) {
  console.error(`Folder not found: ${folder}`);
  process.exit(2);
}

const schemaPath = "review/findings.schema.json";
const outPath = "review/findings.json";
const schema = readFileSync(schemaPath, "utf8");

let prompt = `Review every email in ${folder} against brand/voice.md and .claude/rules/emails.md. Report only real problems.`;

// If the last review was of the same folder, send its findings so Claude reports only new or unfixed problems.
if (existsSync(outPath)) {
  try {
    const previous = JSON.parse(readFileSync(outPath, "utf8"));
    if (previous.folder === folder && Array.isArray(previous.findings)) {
      prompt +=
        "\n\nThese are findings from the last review. Report only problems that are new or still not fixed. Don't repeat ones that have been fixed.\n" +
        JSON.stringify(previous.findings, null, 2);
      console.log(`Re-review: sending ${previous.findings.length} earlier findings for ${folder}`);
    }
  } catch {
    // Unreadable earlier findings: do a full review.
  }
}
const args = ["-p", prompt, "--output-format", "json", "--json-schema", schema, "--allowedTools", "Read,Glob,Grep"];

// On Windows an npm install puts a .cmd wrapper on PATH, which spawnSync cannot run
// without a shell; fall back to the claude.exe it wraps. CLAUDE_BIN overrides both.
function runClaude() {
  const opts = { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] };
  const candidates = [process.env.CLAUDE_BIN, "claude"].filter(Boolean);
  if (process.platform === "win32") {
    const where = spawnSync("where", ["claude"], { encoding: "utf8", shell: true });
    for (const p of (where.stdout || "").split(/\r?\n/).filter(Boolean)) {
      if (p.toLowerCase().endsWith(".cmd")) candidates.push(join(dirname(p), "node_modules", "@anthropic-ai", "claude-code", "bin", "claude.exe"));
    }
  }
  let last;
  for (const bin of candidates) {
    last = spawnSync(bin, args, opts);
    if (!last.error) return last;
  }
  return last;
}

const res = runClaude();
if (res.error || res.status !== 0) {
  console.error(`claude failed: ${res.error?.message ?? `exit code ${res.status}`}`);
  if (res.stderr) console.error(res.stderr.trim().slice(0, 2000));
  process.exit(2);
}

let parsed;
try {
  parsed = JSON.parse(res.stdout);
} catch {
  console.error("claude did not return valid JSON.");
  console.error(res.stdout.slice(0, 2000));
  process.exit(2);
}
// The output may be a single result object, or a list whose last item is the result.
const result = Array.isArray(parsed) ? parsed.findLast((x) => x?.type === "result") ?? parsed.at(-1) : parsed;
const structured = result?.structured_output;
if (!structured || !Array.isArray(structured.findings)) {
  console.error("claude returned no structured_output with a findings array.");
  if (result?.result) console.error(String(result.result).slice(0, 2000));
  process.exit(2);
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify({ folder, findings: structured.findings }, null, 2) + "\n");

const count = (s) => structured.findings.filter((f) => f.severity === s).length;
const high = count("high");
console.log(`${folder}: ${structured.findings.length} findings (high ${high}, medium ${count("medium")}, low ${count("low")}) -> ${outPath}`);
process.exit(high > 0 ? 1 : 0);
