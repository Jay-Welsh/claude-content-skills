# Content Studio pilot

This local pilot adapts the hook, scripting, storyboard, and caption stages of [Claude Content Skills at 691875a](https://github.com/Jay-Welsh/claude-content-skills/commit/691875ac3eafaf84ec0bdb0283728c85d2cb3413). See LICENSE for the upstream notice.

## First run

1. Fill out BRAND-BRIEF.md with one offer, one audience, and one real topic. Use public or sanitized reference material.
2. Open a chat with tools and connectors disabled. Paste the instructions below the frontmatter in skills/draft-reel/SKILL.md, then paste the completed brief.
3. Compare the result with EXAMPLE.md. Check the opening shot, factual claims, timing, and CTA. Read it aloud and mark anything you would rewrite.
4. Try three topics. Promote a change to the prompt only if it fixes a problem you see in those drafts.

## Claude Code option

From this folder, launch Claude Code with the local plugin and built-in tools disabled:

```sh
claude --plugin-dir . --strict-mcp-config --mcp-config '{"mcpServers":{}}' --setting-sources '' --tools ''
```

Use `/content-studio:draft-reel`, then paste the topic and completed brief. Use a clean session without credentials in its environment. Confirm the active tools and plugins in your runtime before supplying sensitive material. The tool-free chat route is sufficient for this pilot.

## When the drafts are ready

Add local rendering first with a single sample clip. Keep live publishing and API-backed rendering in separately authorized services. Require a staging check for denied secret access, exact approval of outgoing content, duplicate protection, and rollback before enabling live writes.
