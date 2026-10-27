const http = require('http');
const server = http.createServer((req, res) => {
  console.log('Got request:', req.url);
  res.writeHead(200);
  res.end('Hello from 4321');
});
server.listen(4321, '127.0.0.1', () => {
  console.log('Listening on:', server.address());
  console.log('PID:', process.pid);
});
server.on('error', e => console.log('Server Error:', e.code, e.message));
setTimeout(() => {}, 120000);