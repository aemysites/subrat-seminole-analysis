/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Columns (columns8)'];
  const cells = [headerRow];

  // Find the three main columns
  const columns = Array.from(element.querySelectorAll('.column-splitter > div'));
  const contentRow = [];

  // Column 1: Logo
  const logoCol = columns[0];
  let logoContent = '';
  if (logoCol) {
    // Find the image block
    const logoImg = logoCol.querySelector('img');
    if (logoImg) {
      logoContent = logoCol.querySelector('.component.logo-image');
    }
  }
  contentRow.push(logoContent || '');

  // Column 2: Navigation links
  const navCol = columns[1];
  let navContent = '';
  if (navCol) {
    // Find the nav list
    const navList = navCol.querySelector('ul');
    if (navList) {
      navContent = navList;
    }
  }
  contentRow.push(navContent || '');

  // Column 3: Social, address, phone, select
  const infoCol = columns[2];
  let infoContent = [];
  if (infoCol) {
    // Social icons
    const social = infoCol.querySelector('.smart-link-list.position-center');
    if (social) infoContent.push(social);
    // Address
    const address = infoCol.querySelector('.map-link');
    if (address) infoContent.push(address);
    // Phone
    const phone = infoCol.querySelector('.telephone-link');
    if (phone) infoContent.push(phone);
    // Location select
    const select = infoCol.querySelector('.select-location');
    if (select) infoContent.push(select);
  }
  contentRow.push(infoContent.length ? infoContent : '');

  cells.push(contentRow);

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
