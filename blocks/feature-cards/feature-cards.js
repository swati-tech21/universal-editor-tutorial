export default function decorate(block) {
  const cards = [...block.children];

  block.classList.add('feature-cards');

  cards.forEach((card) => {
    card.classList.add('feature-card');

    const rows = [...card.children];

    if (rows.length < 5) return;

    const [
      imageRow,
      titleRow,
      descriptionRow,
      ctaLabelRow,
      ctaLinkRow,
    ] = rows;

    imageRow.classList.add('feature-card-image');
    titleRow.classList.add('feature-card-title');
    descriptionRow.classList.add('feature-card-description');

    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'feature-card-content';

    content.appendChild(titleRow);
    content.appendChild(descriptionRow);

    // CTA
    const ctaLabel = ctaLabelRow.textContent.trim();

    let ctaUrl = '';

    const link = ctaLinkRow.querySelector('a');

    if (link) {
      ctaUrl = link.href;
    } else {
      ctaUrl = ctaLinkRow.textContent.trim();
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
    ctaLabelRow.remove();
    ctaLinkRow.remove();

    // Add content
    card.appendChild(content);
  });
}