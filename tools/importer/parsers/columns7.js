/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get the main row containing the columns
  const row = element.querySelector('.row.component.column-splitter');
  if (!row) return;

  // Get the three columns
  const columns = Array.from(row.children);
  if (columns.length < 3) return;

  // --- Column 1: Logo ---
  const col1 = columns[0];
  // Find the logo image block
  const logoWrap = col1.querySelector('.main-footer-logo__wrap');
  let logoContent = logoWrap ? logoWrap : document.createElement('div');

  // --- Column 2: Navigation Links ---
  const col2 = columns[1];
  // Find the nav list wrapper
  const navWrap = col2.querySelector('.main-footer-nav__wrap');
  let navContent = navWrap ? navWrap : document.createElement('div');

  // --- Column 3: Social, Address, Phone, Select ---
  const col3 = columns[2];
  // Social links
  const socialWrap = col3.querySelector('.main-footer-info__wrap');
  // Address (map link)
  const address = col3.querySelector('.main-footer-address.map-link');
  // Phone
  const phone = col3.querySelector('.main-footer-address.telephone-link');
  // Location select
  const selectWrap = col3.querySelector('.select-location');

  // Compose column 3 cell content
  const col3Content = [];
  if (socialWrap) col3Content.push(socialWrap);
  if (address) col3Content.push(address);
  if (phone) col3Content.push(phone);
  if (selectWrap) col3Content.push(selectWrap);

  // Build the table rows
  const headerRow = ['Columns (columns7)'];
  const contentRow = [logoContent, navContent, col3Content];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
