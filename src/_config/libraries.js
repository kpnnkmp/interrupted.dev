import anchor from "markdown-it-anchor";
import container from "markdown-it-container";

export function md(mdit) {
  mdit.use(container, "callout").use(anchor, {
    // aria-hidden keeps the "#" out of screen reader output, so it must leave
    // the tab order too — otherwise it is a focusable element AT cannot see.
    permalink: anchor.permalink.ariaHidden({
      symbol: "#",
      renderAttrs: () => ({ tabindex: -1 }),
    }),
  });
}
