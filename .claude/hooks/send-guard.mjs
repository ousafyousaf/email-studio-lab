#!/usr/bin/env node
// PreToolUse send guard for the Resend MCP server.
// Allows email only to @resend.dev test addresses and to MY_EMAIL.
// Exit 0 = allow, exit 2 = block (reason on stderr). Fails closed.

const ALWAYS_BLOCK = new Set([
  "send-broadcast",
  "create-automation",
  "send-inbox-draft",
  "send-new-inbox-email",
]);
const CHECK_RECIPIENTS = new Set(["send-email", "send-batch-emails"]);

function block(reason) {
  process.stderr.write(`Send guard blocked this: ${reason}\n`);
  process.exit(2);
}

function addresses(value) {
  if (value == null) return [];
  const list = Array.isArray(value) ? value : String(value).split(",");
  return list.flatMap((v) => {
    if (v && typeof v === "object") return addresses(v.email ?? v.address ?? "");
    const s = String(v).trim();
    if (!s) return [];
    const m = s.match(/<([^>]+)>/);
    return [(m ? m[1] : s).trim().toLowerCase()];
  });
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    block("could not read the tool call (invalid JSON), so it is blocked to be safe.");
  }
  const toolName = String(input?.tool_name ?? "");
  const tool = toolName.startsWith("mcp__resend__") ? toolName.slice("mcp__resend__".length) : toolName;

  if (ALWAYS_BLOCK.has(tool)) {
    block(`${tool} can reach whole lists of people, so it is never allowed from this studio.`);
  }
  if (!CHECK_RECIPIENTS.has(tool)) process.exit(0);

  const myEmail = (process.env.MY_EMAIL ?? "").trim().toLowerCase();
  const ti = input?.tool_input ?? {};
  const emails = tool === "send-batch-emails" ? (Array.isArray(ti.emails) ? ti.emails : Array.isArray(ti) ? ti : [ti]) : [ti];

  const all = [];
  for (const e of emails) for (const f of ["to", "cc", "bcc"]) all.push(...addresses(e?.[f]));
  if (all.length === 0) block("no recipient address found in the call.");

  for (const a of all) {
    const ok = a.endsWith("@resend.dev") || (myEmail !== "" && a === myEmail);
    if (!ok) block(`${a} is not a Resend test address (@resend.dev) or your own email (MY_EMAIL).`);
  }
  process.exit(0);
});
