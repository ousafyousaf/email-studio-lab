---
paths:
  - "campaigns/**/emails/*.md"
---

# Email file rule

Every email file in a campaign's `emails/` folder must follow this format. Write one email per file, with no extra notes, alternatives or commentary.

1. **First line:** `Subject: ...` — 50 characters or fewer (counting everything after `Subject: `).
2. **Second line:** `Preview: ...` — 90 characters or fewer (counting everything after `Preview: `).
3. **Greeting:** greet the reader with `{{first_name}}`, for example `Hi {{first_name}},`.
4. **Exactly one main link**, written as `[Button text](https://kettlebird.example/steep-club)`. No other links anywhere in the email.
5. **Ending:** finish with our sign-off from `brand/voice.md`:

   Happy steeping,
   Mira at Kettlebird Tea

   then this two-line footer, as plain text (never inside a code block):

   You're getting this because you joined the Kettlebird Tea waitlist.
   Kettlebird Tea, {{company_address}} · Unsubscribe: {{unsubscribe_url}}

Only one subject line per email. Do not offer subject options or A/B variants inside the email file.

## Facts we cannot confirm yet

If an email needs a fact only the business owner can confirm (a date, a price, a tea name, a policy), write it as `[CONFIRM: what is needed]` instead of inventing it. Never present an unconfirmed date as a deadline. An email with any `[CONFIRM: ...]` left in it is a draft and must not be sent.
