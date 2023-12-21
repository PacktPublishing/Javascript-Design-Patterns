document.querySelector('#app').textContent = 'Hello from main.js';

const { hello } = await import('./dynamic.js');
document.querySelector('#app').textContent = hello();

document.querySelectorAll('[data-track]').forEach((el) => {
  el.addEventListener('click', async (event) => {
    const page = window.location.pathname;
    const type = event.target.dataset?.track;
    const { trackInteraction } = await import('./trackInteraction.js');
    const interactionResponse = await trackInteraction(page, type);
    console.assert(
      interactionResponse.type === type && interactionResponse.page === page,
      'interaction response does not match sent data',
    );
  });
});
