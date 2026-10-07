// Draws Mermaid diagrams (```mermaid blocks in Umbraco Rich Text, rendered as <pre class="mermaid">
// by components/blocks/RichText.astro). Mermaid is large, so it's only downloaded on pages that
// have a diagram, and it's kept out of the service worker's precache (see astro.config.mjs).
const diagrams = [...document.querySelectorAll<HTMLElement>('pre.mermaid')];

if (diagrams.length) {
  // Mermaid replaces each element's content with an SVG, so keep the source to redraw from
  const sources = new Map(diagrams.map((diagram) => [diagram, diagram.textContent ?? '']));
  const { default: mermaid } = await import('mermaid');

  const draw = async () => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    mermaid.initialize({
      startOnLoad: false,
      // The site's own theme (set by BaseHead.astro and scripts/site.ts), not just the OS one
      theme: root.dataset.userTheme === 'dark' ? 'dark' : 'neutral',
      fontFamily: styles.getPropertyValue('--font-stack').trim(),
    });

    for (const [diagram, source] of sources) {
      diagram.removeAttribute('data-processed');
      diagram.textContent = source;
    }

    await mermaid.run({ nodes: diagrams });
  };

  await draw();

  // Redraw when the theme toggle changes the theme
  new MutationObserver(draw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-user-theme'],
  });
}

export {};
