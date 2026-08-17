export default function decorate(block) {
  const items = [...block.children];

  if (!items.length) return;

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'brands-header';

  const grid = document.createElement('div');
  grid.className = 'brands-grid';

  items.forEach((item) => {
    if (item.classList.contains('brand')) {
      item.classList.add('brand-card');

      const image = item.querySelector('img');
      const linkField = item.querySelector('[data-aue-prop="imageLink"]');

      if (image) {
        image.classList.add('brand-logo');
      }

      // Make the image clickable
      if (image && linkField) {
        const href = linkField.textContent.trim();

        if (href) {
          const link = document.createElement('a');
          link.href = href;
          link.className = 'brand-card-link';

          const picture = image.closest('picture');

          if (picture) {
            picture.parentElement.insertBefore(link, picture);
            link.appendChild(picture);
          } else {
            image.parentElement.insertBefore(link, image);
            link.appendChild(image);
          }
        }

        linkField.remove();
      }

      grid.appendChild(item);
    } else if (!titleWrapper.children.length) {
      // Only keep the first non-brand item as title
      titleWrapper.appendChild(item);
    }
  });

  block.innerHTML = '';

  block.appendChild(titleWrapper);
  block.appendChild(grid);
}