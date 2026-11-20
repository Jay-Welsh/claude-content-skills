# Content Studio web preview

An interactive browser prototype for the drafting pilot. The form builds a local sample template and lets you compare hooks, read the storyboard and caption, play a timed storyboard, and export a Markdown draft.

The sample is fictional. The app has no model API, account connectors, server functions, or persistent storage. Form values remain in browser memory until reload. Google Fonts supplies the typefaces. AI generation, video rendering, authentication, and publishing are future integrations.

## Local preview

From this directory, run `python3 -m http.server 4317 --bind 127.0.0.1` and open `http://127.0.0.1:4317`.

## Vercel

Deploy this directory as the project root. Use the Other framework preset with no build command. The static HTML, CSS, and JavaScript are served directly. `vercel.json` adds a content security policy and browser security headers. With a logged-in Vercel CLI, run `vercel deploy` from this directory to create a preview deployment.

## Verification

Check a brief update, hook selection, caption, reset, download, and playback. Test the stacked mobile layout and keyboard tab navigation. Validate JavaScript with `node --check app.js` before deploying.
