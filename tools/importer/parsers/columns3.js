/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the top-level columns
  const columns = [];
  // Find all direct column divs (col-md-*, col-lg-*)
  const colDivs = Array.from(element.querySelectorAll(':scope > .row > .row.component.column-splitter > div'));

  // There should be three columns, but handle variable count
  colDivs.forEach((col, idx) => {
    // First column: logo image
    if (col.classList.contains('main-footer-logo')) {
      // Find the logo-image component
      const logoComp = col.querySelector('.logo-image');
      if (logoComp) {
        columns.push(logoComp);
      } else {
        columns.push(document.createTextNode(''));
      }
    }
    // Second column: nav links
    else if (col.classList.contains('main-footer-nav')) {
      // Find the smart-link-list
      const navComp = col.querySelector('.smart-link-list');
      if (navComp) {
        columns.push(navComp);
      } else {
        columns.push(document.createTextNode(''));
      }
    }
    // Third column: info/social/address/select
    else if (col.classList.contains('main-footer-info')) {
      // Compose all relevant children into one cell
      const infoCell = [];
      // Social links
      const socialComp = col.querySelector('.smart-link-list.position-center.main-footer-info__wrap');
      if (socialComp) infoCell.push(socialComp);
      // Address
      const addressComp = col.querySelector('.map-link.main-footer-address');
      if (addressComp) infoCell.push(addressComp);
      // Telephone
      const telComp = col.querySelector('.telephone-link.main-footer-address');
      if (telComp) infoCell.push(telComp);
      // Location select
      const selectComp = col.querySelector('.smart-link-list.select-location');
      if (selectComp) infoCell.push(selectComp);
      // If nothing found, fallback to empty
      columns.push(infoCell.length ? infoCell : document.createTextNode(''));
    }
    // Defensive: unknown column
    else {
      columns.push(col);
    }
  });

  // Table header row
  const headerRow = ['Columns (columns3)'];
  // Table content row (columns)
  const contentRow = columns;

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
