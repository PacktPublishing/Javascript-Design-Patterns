(() => {
  const node = document.createElement('p');
  node.innerText = 'script.js: blocking script executed';
  document.body.appendChild(node);
})();
