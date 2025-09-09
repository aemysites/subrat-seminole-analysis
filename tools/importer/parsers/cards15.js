/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the card list
  const cardList = element.querySelector('ul.search-result-list');
  if (!cardList) return;

  // Table header row
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Helper to extract image from background-image style
  function extractImageFromStyle(styleString) {
    const urlMatch = styleString.match(/url\(([^)]+)\)/);
    if (!urlMatch) return null;
    const img = document.createElement('img');
    img.src = urlMatch[1].replace(/"/g, '');
    img.alt = '';
    img.loading = 'lazy';
    return img;
  }

  // Iterate each card
  cardList.querySelectorAll(':scope > li').forEach((li) => {
    const wrapper = li.querySelector('.gcard__wrapper');
    if (!wrapper) return;

    // Image cell
    const imageDiv = wrapper.querySelector('.gcard__image');
    let imageEl = null;
    if (imageDiv && imageDiv.style && imageDiv.style.backgroundImage) {
      imageEl = extractImageFromStyle(imageDiv.style.backgroundImage);
    }
    // Defensive fallback: if no image, use empty string
    if (!imageEl) imageEl = '';

    // Text cell: Title, Description, CTAs
    const content = wrapper.querySelector('.gcard__content');
    const inner = content ? content.querySelector('.gcard__content__inner') : null;
    const title = inner ? inner.querySelector('.gcard__title') : null;
    const desc = inner ? inner.querySelector('.gcard__desc') : null;
    const footer = content ? content.querySelector('.gcard__footer') : null;

    // Compose text cell
    const textCell = document.createElement('div');
    textCell.style.display = 'flex';
    textCell.style.flexDirection = 'column';
    if (title) textCell.appendChild(title);
    if (desc) textCell.appendChild(desc);
    if (footer) {
      // Place CTAs at the bottom
      const ctaContainer = document.createElement('div');
      ctaContainer.style.marginTop = '1em';
      footer.querySelectorAll('a').forEach((a) => {
        ctaContainer.appendChild(a);
      });
      textCell.appendChild(ctaContainer);
    }

    rows.push([imageEl, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
