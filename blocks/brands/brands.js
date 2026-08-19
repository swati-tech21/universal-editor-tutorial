export default function decorate(block) {
  const items = [...block.children];

  if (!items.length) return;

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'brands-header';

  const grid = document.createElement('div');
  grid.className = 'brands-grid';

  items.forEach((item) => {
    const isBrand = item.dataset.aueComponent === 'brand';

    if (isBrand) {
      item.classList.add('brand-card');

      const image = item.querySelector('img');
      const linkField = item.querySelector('[data-aue-prop="imageLink"]');

      if (image) {
        image.classList.add('brand-logo');
      }

      if (image && linkField) {
        // Get the authored URL
        const href = linkField.querySelector('a')?.href
          || linkField.textContent.trim();

        if (href) {
          const link = document.createElement('a');

          link.href = href;
          link.className = 'brand-card-link';

          const picture = image.closest('picture');

          if (picture) {
            picture.parentElement.insertBefore(link, picture);
            link.appendChild(picture);
          }
        }

        // Remove the complete imageLink authoring field
        linkField.remove();
      }

      grid.appendChild(item);
    } else {
      // Treat non-brand content as heading
      if (!titleWrapper.children.length) {
        titleWrapper.appendChild(item);
      }
    }
  });

  block.innerHTML = '';

  if (titleWrapper.children.length) {
    block.appendChild(titleWrapper);
  }

  block.appendChild(grid);
}