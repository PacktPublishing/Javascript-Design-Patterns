(() => {
  const node = document.createElement('p');
  node.innerText = 'async.js: async script executed';
  document.body.appendChild(node);
})();
