import net from 'node:net';

const server = net.createServer();
server.listen(4321, '0.0.0.0', () => {
  console.log('Listening on:', server.address());
});
server.on('error', (e) => console.log('Error:', e.code, e.message));
// eslint-disable-next-line @typescript-eslint/no-empty-function
setTimeout(() => {}, 5000);
