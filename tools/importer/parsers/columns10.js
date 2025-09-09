/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column splitter row
  const columnSplitter = element.querySelector('.component.column-splitter');
  if (!columnSplitter) return;

  // Get all immediate column divs (columns)
  const columns = Array.from(columnSplitter.querySelectorAll(':scope > .component-multi-feature--column'));
  if (columns.length === 0) return;

  // For each column, extract the main content (preserving semantic structure)
  const columnContents = columns.map(col => {
    // Prefer the .component-content inside .component.rich-text
    const richText = col.querySelector('.component.rich-text .component-content');
    if (richText) return richText;
    // Fallback: use the column itself
    return col;
  });

  // Build the table rows
  const headerRow = ['Columns (columns10)'];
  const contentRow = columnContents;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
