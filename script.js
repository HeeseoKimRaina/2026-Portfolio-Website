const buttons = document.querySelectorAll('[data-page], [data-next]');
const show = (name) => {
  document.querySelectorAll('[data-page-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.pagePanel === name));
  document.querySelectorAll('.nav-button').forEach((button) => button.classList.toggle('active', button.dataset.page === name));
};
buttons.forEach((button) => button.addEventListener('click', () => show(button.dataset.page || button.dataset.next)));
document.querySelectorAll('[data-project]').forEach((card) => card.addEventListener('click', () => { window.location.href = `project.html?project=${card.dataset.project}`; }));
const requestedPage = new URLSearchParams(window.location.search).get('page');
if (requestedPage && document.querySelector(`[data-page-panel="${requestedPage}"]`)) show(requestedPage);
