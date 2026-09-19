# web-components

Complete, validated web components promoted from real projects: more than a pattern or a snippet, each leaf carries
the **working source**, the site-side integration that was validated, and an `INDEX-AND-HOW-TO-USE-THEM.md` that an
agent can follow to rebuild the same result inside another project.

Rules:

- One folder per component, named by a stable slug. It may hold several files and sub-folders; the component's own
  source goes in `component/` and is copied **unchanged**.
- Nothing of the origin project inside `component/`: no imports of project code, no site colours, no assets, no
  copy. What the site decided (palette, sizes, breakpoints) lives in `integration/` as an example to map, not to paste.
- Colours always reach the component from the target project's palette; map tokens by role.
- Provenance and licence are stated in the how-to. Third-party media is never vendored.
- These are references, lazy-loaded on request through `../index-of-resources-and-working-patters.md`. Once copied
  into a project, the copy belongs to that project.
