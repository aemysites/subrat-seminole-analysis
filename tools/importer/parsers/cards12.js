/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the card list
  const cardList = element.querySelector('ul.search-result-list');
  if (!cardList) return;

  // Table header as required
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  // For each card (li)
  cardList.querySelectorAll(':scope > li').forEach((li) => {
    // Defensive: Find card wrapper
    const wrapper = li.querySelector('.gcard__wrapper');
    if (!wrapper) return;

    // --- IMAGE CELL ---
    // The image is a background-image on .gcard__image
    const imgDiv = wrapper.querySelector('.gcard__image');
    let imgCell = '';
    if (imgDiv) {
      const style = imgDiv.getAttribute('style') || '';
      const match = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
      if (match && match[1]) {
        const img = document.createElement('img');
        img.src = match[1];
        img.alt = '';
        imgCell = img;
      } else {
        imgCell = imgDiv; // fallback: include div if no image
      }
    }

    // --- TEXT CELL ---
    const content = wrapper.querySelector('.gcard__content');
    let textCellContent = [];
    if (content) {
      // Title
      const title = content.querySelector('.gcard__title');
      if (title) {
        const h = document.createElement('h3');
        h.textContent = title.textContent.trim();
        textCellContent.push(h);
      }
      // Description
      const desc = content.querySelector('.gcard__desc');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCellContent.push(p);
      }
      // Footer (CTA links)
      const footer = content.querySelector('.gcard__footer');
      if (footer) {
        // Collect all links
        const links = Array.from(footer.querySelectorAll('a'));
        if (links.length) {
          const ctaDiv = document.createElement('div');
          links.forEach((a) => {
            // Clone link for safety
            const link = document.createElement('a');
            link.href = a.href;
            link.textContent = a.textContent.trim();
            link.className = a.className;
            link.target = a.target;
            link.title = a.title;
            link.style.marginRight = '8px';
            ctaDiv.appendChild(link);
          });
          textCellContent.push(ctaDiv);
        }
      }
    }
    // Defensive: If no content, fallback to li
    if (!textCellContent.length) textCellContent = [li];

    // Add row: [image, text]
    rows.push([imgCell, textCellContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
