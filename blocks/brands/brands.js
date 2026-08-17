export default function decorate(block) {
  const rows = [...block.children];

  // Parent fields
  const title = rows[0]?.textContent.trim();
  const ctaLabel = rows[1]?.textContent.trim();
  const ctaLink = rows[2]?.querySelector('a')?.href || '';

  // Get brand items
  const brandItems = [...block.children].filter((row) =>
    row.classList.contains('brand')
  );

  // If EDS doesn't add the class, use rows after parent fields
  const items = brandItems.length
    ? brandItems
    : rows.slice(3);

  // Create title
  block.innerHTML = '';

  if (title) {
    const heading = document.createElement('h2');
    heading.textContent = title;
    block.append(heading);
  }

  // Cards wrapper
  const grid = document.createElement('div');
  grid.className = 'brands-grid';

  items.forEach((item) => {
    const image = item.querySelector('img');
    const link = item.querySelector('a');

    if (!image) return;

    const card = document.createElement('div');
    card.className = 'brand-card';

    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.target = link.target || '_self';
      anchor.rel = link.rel || '';

      anchor.append(image);
      card.append(anchor);
    } else {
      card.append(image);
    }

    grid.append(card);
  });

  block.append(grid);

  // View All CTA
  if (ctaLabel && ctaLink) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'brands-cta';

    const cta = document.createElement('a');
    cta.href = ctaLink;
    cta.textContent = ctaLabel;
    cta.className = 'button';

    ctaWrapper.append(cta);
    block.append(ctaWrapper);
  }
}