---
name: personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
argument-hint: "[campaign folder]"
context: fork
allowed-tools: Read, Glob, Grep, Write
---

# Personalize a campaign for each lead group

The campaign folder is: $ARGUMENTS

## 1. Check the input

If no campaign folder was given above, do not write anything. Use Glob on `campaigns/*/emails/*.md` to find the campaign folders that exist, list them (one per line, for example `campaigns/steep-club-launch`), say "Run /personalize <campaign folder>", and stop.

If the folder has no `emails/*.md` files, say so and stop.

## 2. Gather what you need

- Read `leads/leads.csv` and collect the distinct values of the `group` column (for example `tea-curious`, `gift-buyers`, `daily-drinkers`). Do not hard-code the groups; use what the file contains. If `leads/CLAUDE.md` describes the groups, read that too.
- Read `brand/voice.md` and `.claude/rules/emails.md` if they exist.
- Read every file in `<campaign folder>/emails/`.

## 3. Write one version per email per group

For each email file and each group, write `<campaign folder>/groups/<group>/emails/<same file name>`.

Keep **exactly the same**:
- the `Subject:` and `Preview:` lines
- the greeting with `{{first_name}}`
- the one link (same text and URL)
- the sign-off and the footer, character for character
- every other paragraph, list and `[CONFIRM: ...]` placeholder

Change **only two things**:
1. **The opening line** (the first paragraph after the greeting), rewritten so it speaks to that group.
2. **One example** in the body (one sentence or one list item), swapped for an example that fits that group.

Follow the brand voice: no words or claims it forbids, no new facts, prices, dates or promises. Do not add new links.

## 4. Reply with a short summary only

Do not paste the emails back. Reply with:
- how many files you wrote (emails × groups)
- one example opening line per group
