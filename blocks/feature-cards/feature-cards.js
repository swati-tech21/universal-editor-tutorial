export default function decorate(block) {
  const cards = [...block.children];

  block.classList.add('feature-cards-container');

  cards.forEach((card) => {
    const rows = [...card.children];

    if (rows.length < 5) {
      return;
    }

    const [
      imageRow,
      titleRow,
      descriptionRow,
      ctaLabelRow,
      ctaLinkRow,
    ] = rows;

    card.classList.add('feature-card-item');

    /*
     * IMAGE
     */
    imageRow.classList.add('feature-card-image');

    /*
     * CONTENT
     */
    const content = document.createElement('div');
    content.className = 'feature-card-content';

    /*
     * TITLE
     */
    titleRow.classList.add('feature-card-title');

    /*
     * DESCRIPTION
     */
    descriptionRow.classList.add('feature-card-description');

    /*
     * Add title and description
     */
    content.append(titleRow, descriptionRow);

    /*
     * CTA
     */
    const ctaLabel = ctaLabelRow.textContent.trim();

    let ctaUrl = '';

    // Try to find an anchor first
    const linkElement = ctaLinkRow.querySelector('a');

    if (linkElement) {
      ctaUrl = linkElement.href;
    } else {
      // Otherwise use the text stored by the aem-content field
      ctaUrl = ctaLinkRow.textContent.trim();
    }

    if (ctaLabel) {
      const cta = document.createElement('a');

      cta.className = 'feature-card-cta';
      cta.textContent = ctaLabel;

      if (ctaUrl) {
        cta.href = ctaUrl;
      }

      cta.setAttribute('aria-label', ctaLabel);

      content.appendChild(cta);
    }

    /*
     * Remove original CTA rows
     */
    ctaLabelRow.remove();
    ctaLinkRow.remove();

    /*
     * Add content to card
     */
    card.appendChild(content);
  });
}