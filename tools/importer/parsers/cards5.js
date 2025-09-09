/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from background-image style
  function extractImageFromStyle(div) {
    const style = div.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(([^)]+)\)/i);
    if (match && match[1]) {
      const url = match[1].replace(/['"]/g, '');
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      return img;
    }
    return null;
  }

  // Find the card list
  const cardList = element.querySelector('ul.search-result-list');
  if (!cardList) return;

  const rows = [];
  // Header row
  rows.push(['Cards (cards5)']);

  // For each card (li)
  cardList.querySelectorAll(':scope > li').forEach((li) => {
    // Image cell
    const imgDiv = li.querySelector('.gcard__image');
    const img = imgDiv ? extractImageFromStyle(imgDiv) : null;
    // Text cell
    const content = li.querySelector('.gcard__content');
    let textCellContent = [];
    if (content) {
      const inner = content.querySelector('.gcard__content__inner');
      if (inner) {
        // Title
        const title = inner.querySelector('.gcard__title');
        if (title) {
          const h = document.createElement('h3');
          h.textContent = title.textContent;
          textCellContent.push(h);
        }
        // Description
        const desc = inner.querySelector('.gcard__desc');
        if (desc) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textCellContent.push(p);
        }
      }
      // Footer (CTAs)
      const footer = content.querySelector('.gcard__footer');
      if (footer) {
        // Collect all links
        const links = Array.from(footer.querySelectorAll('a'));
        if (links.length > 0) {
          const ctaDiv = document.createElement('div');
          links.forEach((a) => {
            // Clone link to avoid moving from source
            const link = document.createElement('a');
            link.href = a.href;
            link.textContent = a.textContent;
            link.className = a.className;
            link.target = a.target;
            link.title = a.title;
            ctaDiv.appendChild(link);
          });
          textCellContent.push(ctaDiv);
        }
      }
    }
    // Defensive: if nothing, fallback to li
    if (textCellContent.length === 0) textCellContent = [li];
    rows.push([
      img || '',
      textCellContent,
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
