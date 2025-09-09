/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns for the Columns block
  const columnNodes = Array.from(
    element.querySelectorAll('.component-multi-feature--column')
  );

  // Defensive: Only proceed if we have at least two columns
  if (columnNodes.length < 2) return;

  // Extract the content for each column
  const columns = columnNodes.map(col => {
    // Find the .component-content inside this column
    const content = col.querySelector('.component-content');
    // If not found, fallback to the column itself
    return content || col;
  });

  // The header row must match the block name exactly
  const headerRow = ['Columns (columns11)'];
  // The second row contains the two columns
  const columnsRow = columns;

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
