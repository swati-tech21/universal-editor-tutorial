export default function decorate(block) {
  const rows = [...block.children];

  if (!rows.length) return;

  const titleRow = rows[0];

  const titleText =
    titleRow?.querySelector('h1, h2, h3, h4, h5, h6, p')?.textContent?.trim();

  const title = document.createElement('h2');
  title.className = 'brands-title';
  title.textContent = titleText || 'Explore Our Brands';

  const grid = document.createElement('div');
  grid.className = 'brands-grid';

  const brandRows = rows.slice(1);

  brandRows.forEach((row) => {
    const image = row.querySelector('picture, img');
    const link = row.querySelector('a');

    if (!image) return;

    const card = document.createElement('div');
    card.className = 'brand-card';

    const cardLink = document.createElement('a');

    cardLink.className = 'brand-card-link';

    if (link?.href) {
      cardLink.href = link.href;
    } else {
      cardLink.href = '#';
    }

    cardLink.appendChild(image.cloneNode(true));

    card.appendChild(cardLink);
    grid.appendChild(card);
  });

  const cta = document.createElement('a');
  cta.className = 'brands-view-all';
  cta.textContent = 'View All';

  /*
   * Try to find the parent CTA.
   */
  const parentLink = titleRow.querySelector('a');

  if (parentLink?.href) {
    cta.href = parentLink.href;
  } else {
    cta.href = '#';
  }

  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'brands-cta';
  ctaContainer.appendChild(cta);

  block.innerHTML = '';

  block.appendChild(title);
  block.appendChild(grid);
  block.appendChild(ctaContainer);
}