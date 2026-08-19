export default function decorate(block) {
  const rows = [...block.children];

  const headingText = rows[0]?.textContent.trim() || '';

  const possibleHeadingType = rows[1]?.textContent.trim().toLowerCase();
  const headingType = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(possibleHeadingType)
    ? possibleHeadingType
    : 'h2';

  const possibleAlignment = rows[2]?.textContent.trim().toLowerCase();
  const alignment = ['left', 'center'].includes(possibleAlignment)
    ? possibleAlignment
    : 'left';

  block.innerHTML = '';

  const heading = document.createElement(headingType);
  heading.textContent = headingText;
  heading.classList.add(`heading-${alignment}`);

  block.append(heading);
}