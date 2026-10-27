const http = require('http');
const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200);
  res.end('Hello');
});
server.listen(4321, '127.0.0.1', () => {
  console.log('Server running, address:', server.address());
  console.log('PID:', process.pid);
});
setTimeout(() => {}, 60000);