const net = require('net');
const server = net.createServer();
server.listen(4321, '0.0.0.0', () => {
  console.log('Listening on:', server.address());
});
server.on('error', (e) => console.log('Error:', e.code, e.message));
setTimeout(() => {}, 5000);
