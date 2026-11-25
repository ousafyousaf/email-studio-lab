# Skills I chose

Searched skills.sh on 2026-11-25 with `npx skills find` for: email marketing, email sequence, campaign plan, resend. Nothing installed yet.

## Use these

- **anthropics/knowledge-work-plugins** (campaign-plan ~3.5K installs, email-sequence ~3.2K installs; repo ~36.8K GitHub stars). Published by Anthropic itself, the maker of Claude. It gives us the `marketing` plugin with skills for planning a campaign, writing an email sequence and reviewing brand voice. Fewer installs than some others, but the publisher is the most trustworthy there is. We use this for writing campaigns.
- **resend/resend-skills** (resend ~25.1K installs; repo ~219 stars). Published by Resend, the email service we will send through. The official company knows its own tools best, so it is the right source for sending email. The star count is modest, but the publisher is the official one, which matters more.

## Avoid these

- **caffeinelabs/skills@extension-email-marketing** (~33.5K installs, but its repo has only 2 GitHub stars). Huge install number with almost no community trust behind it. Installs can be inflated or come from one tool installing it automatically; that mismatch is a warning sign.
- **dhruvjainin/absolute@email-marketing** (~127 installs, personal account, ~224 stars). An unknown individual's grab-bag repo with very little usage. Nothing tells us who reviews it or keeps it up to date.

Also noted: the popular **coreyhaines31/marketingskills@email-sequence** (~55.1K installs, ~62.5K stars) has been merged into a skill now called `emails` in that repo. Well regarded, but a single person's repo; fine as a second opinion, not our first choice.

## How I decided

1. **Who publishes it.** Prefer the official maker (Anthropic for Claude, Resend for Resend) or a well-known organisation over an unknown account.
2. **Does the trust add up.** Compare install counts with GitHub stars, recent commits and open issues. Many installs with almost no stars is a red flag.
3. **Read what it actually does.** Open the SKILL.md before installing: check what tools and commands it can run and whether it sends data anywhere. A skill is instructions Claude will follow.
