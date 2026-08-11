Project case-study card with the site's one deliberate flourish: on scroll into view, a gold border draws left-to-right (~400ms), then a full "NOTIFICATION / NEW ITEM UNLOCKED" banner (bone + oxblood two-line stack) flashes, before settling into a gold corner-bracket frame holding the "UNLOCKED: 0N" label, title, optional italic pull-quote, description, and tags. Respects `prefers-reduced-motion` (skips straight to settled).

```jsx
<ProjectCard index={1} title="Grimoire CMS" quote="Markdown in, illuminated manuscript out." description="A Firebase-backed content system styled as an ancient tome." tags={['React', 'Firebase', 'Node']} />
```

This is the ONLY place gold and oxblood ever appear together — never reuse the flash decoratively elsewhere.
