export default function decorate(block) {
  const items = [...block.children];

  if (!items.length) return;

  // Create wrappers
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'brands-header';

  const grid = document.createElement('div');
  grid.className = 'brands-grid';

  const footer = document.createElement('div');
  footer.className = 'brands-footer';

  items.forEach((item) => {
    // Brand item
    if (item.classList.contains('brand')) {
      item.classList.add('brand-card');

      const image = item.querySelector('img');
      const link = item.querySelector('a');

      if (image) {
        image.classList.add('brand-logo');
      }

      if (link) {
        link.classList.add('brand-card-link');
      }

      grid.appendChild(item);
    } else {
      // Check for CTA
      const link = item.querySelector('a');

      if (link) {
        link.classList.add('brands-main-cta');
        footer.appendChild(item);
      } else {
        // Treat first non-brand item as title
        titleWrapper.appendChild(item);
      }
    }
  });

  // Clear original block
  block.innerHTML = '';

  // Build structure
  block.appendChild(titleWrapper);
  block.appendChild(grid);
  block.appendChild(footer);
}