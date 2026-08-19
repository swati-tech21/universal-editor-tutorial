export default function decorate(block) {
  const headingRow = block.querySelector('[data-aue-prop="heading"]');
  const headingTypeRow = block.querySelector('[data-aue-prop="headingType"]');
  const alignmentRow = block.querySelector('[data-aue-prop="alignment"]');

  const headingText = headingRow?.textContent.trim() || '';
  const headingType = headingTypeRow?.textContent.trim().toLowerCase() || 'h2';
  const alignment = alignmentRow?.textContent.trim().toLowerCase() || 'left';

  // Safety: only allow valid heading elements
  const validHeadingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  const safeHeadingType = validHeadingTypes.includes(headingType)
    ? headingType
    : 'h2';

  const safeAlignment = ['left', 'center'].includes(alignment)
    ? alignment
    : 'left';

  block.innerHTML = '';

  const heading = document.createElement(safeHeadingType);

  heading.textContent = headingText;
  heading.classList.add(`heading-${safeAlignment}`);

  block.append(heading);
}