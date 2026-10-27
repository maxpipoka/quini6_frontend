import('astro').then(m => {
  const config = require('./astro.config.mjs').default;
  return m.dev({
    config,
    port: 4321,
    host: '127.0.0.1'
  });
}).catch(e => console.error(e.stack));