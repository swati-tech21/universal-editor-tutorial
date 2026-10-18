export default function decorate(block) {
  const cards = [...block.children];

  block.classList.add('feature-cards');

  cards.forEach((card) => {
    card.classList.add('feature-card');

    const rows = [...card.children];

    if (rows.length < 4) return;

    // 4 rows: the CTA label is collapsed into the link (ctaLink + ctaLinkText)
    // 5 rows: legacy content with separate CTA label and link rows
    const legacy = rows.length >= 5;
    const [imageRow, titleRow, descriptionRow] = rows;
    const ctaLabelRow = legacy ? rows[3] : null;
    const ctaLinkRow = legacy ? rows[4] : rows[3];

    imageRow.classList.add('feature-card-image');
    titleRow.classList.add('feature-card-title');
    descriptionRow.classList.add('feature-card-description');

    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'feature-card-content';

    content.appendChild(titleRow);
    content.appendChild(descriptionRow);

    // CTA
    let ctaUrl = '';

    const link = ctaLinkRow.querySelector('a');

    if (link) {
      ctaUrl = link.href;
    } else {
      ctaUrl = ctaLinkRow.textContent.trim();
    }

    let ctaLabel = ctaLabelRow
      ? ctaLabelRow.textContent.trim()
      : link?.textContent.trim() || '';

    // without ctaLinkText the collapsed link's text is the URL: treat as no label
    if (!ctaLabelRow && link && ctaLabel === link.getAttribute('href')) {
      ctaLabel = '';
    }

    if (ctaLabel) {
      const cta = document.createElement('a');

      cta.className = 'feature-card-cta';
      cta.textContent = ctaLabel;

      if (ctaUrl) {
        cta.href = ctaUrl;
      }

      content.appendChild(cta);
    }

    // Remove original CTA rows
    ctaLabelRow?.remove();
    ctaLinkRow.remove();

    // Add content
    card.appendChild(content);
  });
}
