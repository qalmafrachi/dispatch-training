# Dispatch Desk

Bi-weekly dispatch training for Dana and Devin. A lesson opens every Tuesday and games open every Friday, all built on real Service Fusion jobs.

## Files

- `index.html` - the page and its styling
- `app.js` - lessons, flashcards, scenarios, the board puzzle, points, badges, logging, coach view
- `content.js` - starter content (copied into Supabase by schema.sql; after that, edit in Admin)
- `config.js` - Supabase URL and anon key, admin email
- `schema.sql` - creates the tables, admin-only write rules, and starter content

## Setup

1. In Supabase, open SQL Editor, paste `schema.sql`, and run it.
2. In `config.js`, paste the project's anon (public) key. Never use the service_role key.
3. Push to GitHub and turn on Pages (Settings > Pages > Deploy from branch > main).
4. Send Dana and Devin the Pages link. They pick their name the first time.

## Admin

1. In Supabase, go to Authentication > Users > Add user, create a user with your email (qalmafrachi@freeflowbev.com) and a password, and tick Auto confirm.
2. In the app, click Admin sign in.

Admin has three tabs:
- **Content**: edit, add, preview and delete cycles, Tuesday lessons and Friday play sessions. New sessions start as drafts that only you can see; tick "Live for trainees" to publish.
- **Activity log**: when each trainee trained, points, lesson time, how their first answers split, and which calls to talk through.
- **Settings**: program start date, trainee names, and the feedback lines.

Only the emails in `is_training_admin()` (schema.sql) and `adminEmails` (config.js) can change content.
