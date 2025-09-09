/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main card content
  const dcard = element.querySelector('.dcard');
  if (!dcard) return;

  // Get the image column (left)
  const imageCol = dcard.querySelector('.dcard__image');
  // Get the content column (right)
  const contentCol = dcard.querySelector('.dcard__content');

  // Defensive: ensure both columns exist
  if (!imageCol || !contentCol) return;

  // Header row as required
  const headerRow = ['Columns (columns14)'];

  // Second row: two columns, left is image, right is content
  const columnsRow = [imageCol, contentCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
