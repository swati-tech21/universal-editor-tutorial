export default function decorate(block) {
  const images = [...block.querySelectorAll('img')];

  const heading = block.querySelector('h2, h3, h4, p');

  const grid = document.createElement('div');
  grid.className = 'brands-grid';

  images.forEach((image) => {
    const card = document.createElement('div');
    card.className = 'brand-card';

    const link = image.closest('a');

    if (link) {
      const newLink = link.cloneNode(false);
      newLink.appendChild(image);
      card.appendChild(newLink);
    } else {
      card.appendChild(image);
    }

    grid.appendChild(card);
  });

  block.innerHTML = '';

  if (heading) {
    block.appendChild(heading);
  }

  block.appendChild(grid);
}