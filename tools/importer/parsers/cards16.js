/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only process if the element contains a UL with .search-result-list
  const ul = element.querySelector('ul.search-result-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Get all card LI elements
  const cards = ul.querySelectorAll(':scope > li');
  cards.forEach((li) => {
    // Defensive: Find the card container
    const card = li.querySelector('.listCCard');
    if (!card) return;

    // --- IMAGE CELL ---
    // Find the image (inside .listCCard__image)
    let imageCell = '';
    const imageWrapper = card.querySelector('.listCCard__image');
    if (imageWrapper) {
      // Use the <img> directly if present
      const img = imageWrapper.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        // Fallback: use the whole picture element
        const pic = imageWrapper.querySelector('picture');
        if (pic) imageCell = pic;
      }
    }

    // --- CONTENT CELL ---
    // Find the content wrapper
    const contentWrapper = card.querySelector('.listCCard__content-inner');
    const contentCellItems = [];
    if (contentWrapper) {
      // Title (h2)
      const title = contentWrapper.querySelector('.listCCard__title');
      if (title) contentCellItems.push(title);
      // Description (teaser)
      const teaser = contentWrapper.querySelector('.listCCard__teaser');
      if (teaser) contentCellItems.push(teaser);
      // Actions (buttons/links)
      const actions = contentWrapper.querySelector('.listCCard__actions');
      if (actions) {
        // Only include direct <a> children (avoid duplication from footer)
        const links = Array.from(actions.querySelectorAll('a'));
        if (links.length) contentCellItems.push(...links);
      }
    }
    // Defensive: If no content found, fallback to card text
    if (contentCellItems.length === 0) {
      contentCellItems.push(document.createTextNode(card.textContent.trim()));
    }

    // Add row: [image, content]
    rows.push([
      imageCell,
      contentCellItems
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
