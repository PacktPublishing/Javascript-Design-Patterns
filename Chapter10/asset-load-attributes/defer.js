(() => {
  const node = document.createElement('p');
  node.innerText = 'defer.js: defer script executed';
  document.body.appendChild(node);
})();
