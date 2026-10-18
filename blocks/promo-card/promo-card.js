import safeUrl from '../../scripts/utils/safe-url.js';

/**
 * Get the text content of a row safely.
 */
function getText(row) {
  return row?.textContent?.trim() || '';
}

/**
 * Get the first link from a row.
 * Falls back to the text value if no <a> exists.
 * Returns '' unless the link is a same-site path, an anchor, https, mailto or tel.
 */
function getLink(row) {
  const raw = (row?.querySelector('a')?.getAttribute('href') || getText(row)).trim();

  if (raw.startsWith('#')) {
    return raw;
  }

  // a bare domain like "example.com" is treated as https
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  const value = hasScheme || raw.startsWith('/') ? raw : `https://${raw}`;
  return safeUrl(value, { external: 'any', schemes: ['mailto:', 'tel:'] }) || '';
}

/**
 * Create CTA button.
 */
function createCta(label, href, className = 'promo-card-cta') {
  if (!label || !href) {
    return null;
  }

  const cta = document.createElement('a');
  cta.className = className;
  cta.href = href;

  // the label is plain text: never parse it as HTML
  const span = document.createElement('span');
  span.textContent = label;
  cta.append(span);

  return cta;
}

const FIELDS = [
  'image',
  'title',
  'subtitle',
  'description',
  'variant',
  'ctaLabel',
  'ctaLink',
  'mainCtaLabel',
  'mainCtaLink',
];

// "ctaLink", "CTA Link" and "cta-link" all normalise to "ctalink"
const normalise = (key) => key.toLowerCase().replace(/[^a-z0-9]/g, '');
const KEYS = Object.fromEntries(FIELDS.map((name) => [normalise(name), name]));
KEYS.promovariant = 'variant';

/**
 * Map the authored rows to the model fields.
 * Key-value markup has two cells per row (key | value) and is read by key.
 * Older content has one cell per row and is read by position.
 */
function getFields(rows) {
  const keyValue = rows.every((row) => row.children.length === 2
    && KEYS[normalise(row.children[0].textContent)]);

  if (keyValue) {
    return Object.fromEntries(rows.map((row) => [
      KEYS[normalise(row.children[0].textContent)],
      row.children[1],
    ]));
  }

  return Object.fromEntries(FIELDS.map((name, i) => [name, rows[i]]));
}

/**
 * Get image from the image row.
 */
function getImage(row) {
  return row?.querySelector('picture, img') || null;
}

export default function decorate(block) {
  const rows = [...block.children];

  if (!rows.length) {
    return;
  }

  const {
    image: imageRow,
    title: titleRow,
    subtitle: subtitleRow,
    description: descriptionRow,
    variant: variantRow,
    ctaLabel: ctaLabelRow,
    ctaLink: ctaLinkRow,
    mainCtaLabel: mainCtaLabelRow,
    mainCtaLink: mainCtaLinkRow,
  } = getFields(rows);

  /* -------------------------------------------------------------
     Get authored values safely
     ------------------------------------------------------------- */

  const image = getImage(imageRow);

  const title = getText(titleRow);
  const subtitle = getText(subtitleRow);

  const descriptionHtml = descriptionRow?.innerHTML?.trim() || '';

  /* -------------------------------------------------------------
     Get variant
     ------------------------------------------------------------- */

  const variantValue = getText(variantRow)
    .toLowerCase()
    .trim();

  /*
   * Variant meaning:
   *
   * left-img  = Image LEFT + Content RIGHT
   * right-img = Content LEFT + Image RIGHT
   */

  const variant = variantValue.includes('right')
    ? 'right-img'
    : 'left-img';

  const ctaLabel = getText(ctaLabelRow);
  const ctaLink = getLink(ctaLinkRow);

  const mainCtaLabel = getText(mainCtaLabelRow);
  const mainCtaLink = getLink(mainCtaLinkRow);

  /* -------------------------------------------------------------
     Add variant class to block
     ------------------------------------------------------------- */

  block.classList.remove('left-img', 'right-img');
  block.classList.add(variant);

  /* -------------------------------------------------------------
     Create main card
     ------------------------------------------------------------- */

  const card = document.createElement('div');
  card.className = 'promo-card-inner';

  /* -------------------------------------------------------------
     Image
     ------------------------------------------------------------- */

  let imageContainer = null;

  if (image) {
    imageContainer = document.createElement('div');
    imageContainer.className = 'promo-card-image';

    /*
     * Move the complete picture or img into the image container.
     */
    imageContainer.append(image);
  }

  /* -------------------------------------------------------------
     Content
     ------------------------------------------------------------- */

  const content = document.createElement('div');
  content.className = 'promo-card-content';

  if (title) {
    const titleElement = document.createElement('h2');
    titleElement.className = 'promo-card-title';
    titleElement.textContent = title;
    content.append(titleElement);
  }

  if (subtitle) {
    const subtitleElement = document.createElement('div');
    subtitleElement.className = 'promo-card-subtitle';
    subtitleElement.textContent = subtitle;
    content.append(subtitleElement);
  }

  if (descriptionHtml) {
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'promo-card-description';
    // eslint-disable-next-line no-restricted-syntax -- authored rich text EDS already rendered
    descriptionElement.innerHTML = descriptionHtml;
    content.append(descriptionElement);
  }

  /* -------------------------------------------------------------
     Card CTA
     ------------------------------------------------------------- */

  const cardCta = createCta(ctaLabel, ctaLink);

  if (cardCta) {
    content.append(cardCta);
  }

  /* -------------------------------------------------------------
     Arrange image/content according to variant
     ------------------------------------------------------------- */

  if (variant === 'left-img') {
    /*
     * LEFT IMAGE
     *
     * Image | Content
     */
    if (imageContainer) {
      card.append(imageContainer);
    }

    card.append(content);
  } else {
    /*
     * RIGHT IMAGE
     *
     * Content | Image
     */
    card.append(content);

    if (imageContainer) {
      card.append(imageContainer);
    }
  }

  /* -------------------------------------------------------------
     Main CTA
     ------------------------------------------------------------- */

  const mainCta = createCta(
    mainCtaLabel,
    mainCtaLink,
    'promo-main-cta',
  );

  /* -------------------------------------------------------------
     Replace original authored markup
     ------------------------------------------------------------- */

  block.replaceChildren(card);

  /*
   * Main CTA is optional.
   */
  if (mainCta) {
    const mainCtaWrapper = document.createElement('div');
    mainCtaWrapper.className = 'promo-main-cta-wrapper';

    mainCtaWrapper.append(mainCta);

    block.append(mainCtaWrapper);
  }
}
