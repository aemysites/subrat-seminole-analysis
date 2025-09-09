/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate column elements
  function getColumns(root) {
    // Find the row with columns
    const row = root.querySelector('.row.component.column-splitter');
    if (!row) return [];
    // Get all direct column children
    return Array.from(row.querySelectorAll(':scope > .component-multi-feature--column'));
  }

  // Get the columns
  const columns = getColumns(element);

  // Defensive: If no columns found, do nothing
  if (!columns.length) return;

  // Each column: extract its main content block
  const cellsRow = columns.map(col => {
    // Find the rich-text component inside each column
    const richText = col.querySelector('.component.rich-text .component-content');
    // Defensive: If not found, use the column itself
    return richText || col;
  });

  // Build the table rows
  const headerRow = ['Columns (columns4)'];
  const tableRows = [headerRow, cellsRow];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
