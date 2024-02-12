console.log('analytics.js: loaded');

async function trackPageLoad() {
  const responseJson = await fetch(
    'https://jsonplaceholder.typicode.com/posts',
    {
      method: 'POST',
      body: JSON.stringify({
        page: window.location.pathname,
        origin: window.location.origin,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    },
  ).then((response) => response.json());
  console.log('analytics.js: page load fetch response', responseJson);
}

trackPageLoad();
