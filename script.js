const drawStateJourney = () => {
  const page = document.querySelector('.position');
  const rings = [...document.querySelectorAll('.position .state > img:first-child')];
  if (!page || rings.length !== 3) return;
  let overlay = page.querySelector('.state-journey-overlay');
  if (!overlay) {
    overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    overlay.setAttribute('class', 'state-journey-overlay');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<path />';
    page.append(overlay);
  }
  const base = page.getBoundingClientRect();
  const points = rings.map((ring) => {
    const rect = ring.getBoundingClientRect();
    return { x: rect.left - base.left + rect.width / 2, y: rect.top - base.top + rect.height / 2 };
  });
  const [one, two, three] = points;
  overlay.setAttribute('viewBox', `0 0 ${base.width} ${base.height}`);
  const firstDX = two.x - one.x;
  const firstDY = two.y - one.y;
  const secondDX = three.x - two.x;
  const secondDY = three.y - two.y;
  const tangentX = (three.x - one.x) * .23;
  const tangentY = (three.y - one.y) * .23;
  overlay.querySelector('path').setAttribute('d', `M ${one.x} ${one.y} C ${one.x + firstDX * .45} ${one.y + firstDY * .45}, ${two.x - tangentX} ${two.y - tangentY}, ${two.x} ${two.y} C ${two.x + tangentX} ${two.y + tangentY}, ${three.x - secondDX * .45} ${three.y - secondDY * .45}, ${three.x} ${three.y}`);
};
const buttons = document.querySelectorAll('[data-page], [data-next]');
const pageOrder = ['intro', 'position', 'projects'];
let isChangingPage = false;
const movePage = (direction) => {
  const activePage = document.querySelector('[data-page-panel].is-active')?.dataset.pagePanel;
  const nextPage = pageOrder[pageOrder.indexOf(activePage) + direction];
  if (!nextPage || isChangingPage) return false;
  isChangingPage = true;
  show(nextPage);
  window.setTimeout(() => { isChangingPage = false; }, 650);
  return true;
};
const show = (name) => {
  document.querySelectorAll('[data-page-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.pagePanel === name));
  document.querySelectorAll('.nav-button').forEach((button) => button.classList.toggle('active', button.dataset.page === name));
  requestAnimationFrame(drawStateJourney);
};
buttons.forEach((button) => button.addEventListener('click', () => show(button.dataset.page || button.dataset.next)));
window.addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaY) < 18) return;
  if (movePage(event.deltaY > 0 ? 1 : -1)) event.preventDefault();
}, { passive: false });
let touchStartY = null;
window.addEventListener('touchstart', (event) => { touchStartY = event.touches[0]?.clientY ?? null; }, { passive: true });
window.addEventListener('touchend', (event) => {
  const touchEndY = event.changedTouches[0]?.clientY;
  if (touchStartY === null || touchEndY === undefined) return;
  const distance = touchStartY - touchEndY;
  if (Math.abs(distance) > 45) movePage(distance > 0 ? 1 : -1);
  touchStartY = null;
}, { passive: true });
document.querySelectorAll('[data-project]').forEach((card) => card.addEventListener('click', () => { window.location.href = `project.html?project=${card.dataset.project}`; }));
const requestedPage = new URLSearchParams(window.location.search).get('page');
if (requestedPage && document.querySelector(`[data-page-panel="${requestedPage}"]`)) show(requestedPage);
window.addEventListener('resize', drawStateJourney);
requestAnimationFrame(drawStateJourney);
