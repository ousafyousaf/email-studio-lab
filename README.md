# Email Studio Lab (FDE-102)

An email marketing studio built with Claude Code. Claude plans a launch campaign, writes the emails, personalizes them for each customer group, reviews them automatically, and sends them safely to a local practice email server.

**Sample brand:** Kettlebird Tea, a made-up small online tea shop, launching a monthly subscription box called The Steep Club to its waitlist.

## Everything here is made up

- All leads in `leads/leads.csv` are fictional people with `@example.com` addresses. That domain is reserved and can never receive mail.
- The customer reviews in `notes/reviews/` are invented practice data.
- No real email is ever sent. The Resend connection in `.mcp.json` defaults to a local practice server (`http://localhost:4000`) with a placeholder key (`re_practice`).

## Sending is guarded

`.claude/hooks/send-guard.mjs` is a `PreToolUse` hook registered in `.claude/settings.json` for every `mcp__resend__.*` tool. Before any send it checks every `to`, `cc` and `bcc` address and blocks (exit code 2) anything that isn't a Resend test address (`@resend.dev`) or the studio owner's own address. Broadcasts, automations and inbox sends are always blocked. If it can't read the tool call, it blocks.

## Folder tree

```
.
├── CLAUDE.md                        # studio rules; imports brand/voice.md
├── brand/voice.md                   # brand voice, words to avoid, claims never to make
├── leads/
│   ├── leads.csv                    # 24 practice leads, 8 per group
│   └── CLAUDE.md                    # rules for this folder only
├── campaigns/
│   ├── steep-club-launch/
│   │   ├── plan.md                  # 4-week launch plan (from 7 Dec 2026)
│   │   ├── emails/                  # 4 launch emails
│   │   └── groups/<group>/emails/   # one version per lead group (12 files)
│   └── test-bad/emails/01-bad.md    # deliberately bad test fixture (see below)
├── notes/
│   ├── skills-i-chose.md            # which published skills to trust, and why
│   ├── angle-a.md, angle-b.md       # subject-line angles from two forked sessions
│   ├── handoff.md                   # short handoff summary
│   ├── reviews/                     # 120 made-up customer reviews
│   └── scratchpad.md                # findings logged per review file
├── review/
│   ├── findings.schema.json         # JSON Schema for review findings
│   └── findings.json                # latest review output
├── scripts/review.mjs               # headless review script
├── .claude/
│   ├── settings.json                # project plugin (marketing) + send guard hook
│   ├── rules/emails.md              # format rule for campaigns/**/emails/*.md
│   ├── skills/personalize/SKILL.md  # /personalize <campaign folder>
│   └── hooks/send-guard.mjs         # PreToolUse send guard
└── .mcp.json                        # Resend MCP server, practice mode by default
```

## Automatic review

```bash
node scripts/review.mjs <campaign folder>
# e.g. node scripts/review.mjs campaigns/test-bad
```

It runs Claude Code headless (`claude -p` with `--json-schema`) using only Read, Glob and Grep, checks every email against `brand/voice.md` and `.claude/rules/emails.md`, and saves the findings to `review/findings.json`. Exit codes: `0` = no high-severity findings, `1` = at least one high finding, `2` = Claude failed or returned no structured output. If the last review was of the same folder, its findings are sent along so only new or unfixed problems are reported.

**`campaigns/test-bad/` is a deliberate test fixture.** Its one email breaks the rules on purpose (fake urgency, a detox claim, a second link) to prove the review catches problems. Don't send it.

**Note:** `campaigns/steep-club-launch` currently exits `1`. Emails 03 and 04 still contain `[CONFIRM: ...]` placeholders (tea names, ship date, order cut-off) that only the business owner can fill in. They are drafts until then.

## Plugins

The project enables Anthropic's `marketing` plugin (`/marketing:campaign-plan`, `/marketing:email-sequence`, `/marketing:brand-review`) at project scope through `.claude/settings.json`, so anyone who clones the repo gets the same plugin.

## Author

Ousaf Yousaf
