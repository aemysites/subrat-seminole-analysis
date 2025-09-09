/* global WebImporter */
export default function parse(element, { document }) {
  // Find the multi-column wrapper
  const columnsWrapper = element.querySelector('.component-multi-feature--wrapper');
  if (!columnsWrapper) return;

  // Find all direct column divs
  const columnDivs = columnsWrapper.querySelectorAll('.component-multi-feature--column');
  if (!columnDivs || columnDivs.length === 0) return;

  // Build the header row as required
  const headerRow = ['Columns (columns9)'];

  // Build the columns row: each cell is the full rich-text content of the column
  const columnsRow = Array.from(columnDivs).map((col) => {
    // Find the .component-content inside each column
    const richText = col.querySelector('.component-content');
    if (richText) return richText;
    // fallback: use the column itself
    return col;
  });

  // Compose the table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
