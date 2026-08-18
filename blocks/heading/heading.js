export default function decorate(block) {
  const rows = [...block.children];

  const headingText = rows[0]?.textContent.trim();
  const headingType = rows[1]?.textContent.trim() || 'h2';
  const alignment = rows[2]?.textContent.trim() || 'left';

  block.innerHTML = '';

  const heading = document.createElement(headingType);
  heading.textContent = headingText;
  heading.classList.add(`heading-${alignment}`);

  block.append(heading);
}