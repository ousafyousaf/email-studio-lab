# Email Studio Lab (FDE-102)

A hands-on Claude Code assignment: an email marketing studio where Claude plans a launch campaign, writes the emails, personalizes them for each customer group, and sends them safely to a practice email server. No real emails are sent.

## Status: work in progress

The full project will be pushed by **16 November 2026**. This repo currently holds only the plan below.

## Planned structure

```
fde-102-email-studio-lab/
├── CLAUDE.md                     # the studio's rules
├── brand/voice.md                # how the brand sounds
├── leads/
│   ├── leads.csv                 # 24 practice customers
│   └── CLAUDE.md                 # rules for this folder only
├── campaigns/steep-club-launch/
│   ├── plan.md                   # the campaign plan
│   ├── emails/                   # 4 launch emails
│   └── groups/                   # a version per customer group
├── notes/                        # e.g. skills-i-chose.md
├── .claude/
│   ├── rules/emails.md           # rules for every email file
│   ├── skills/personalize/
│   └── hooks/send-guard.mjs
├── .mcp.json                     # connection to Resend (practice server)
└── scripts/review.mjs            # automatic review
```

## Plan

- **Part 1, Plan and write:** set up the studio, brand voice, campaign plan, and emails (nothing is sent).
- **Part 2, Send safely:** send guard hook and practice-server sending.
- **Part 3, Work like a team:** shared rules, review script, and stretch tasks.

Sample brand: Kettlebird Tea (made-up), launching a monthly tea box called The Steep Club.

## Author

Ousaf Yousaf
