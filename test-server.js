const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Test on 4321</h1>');
});
server.listen(4321, '0.0.0.0', () => {
  console.log('Server running on 4321 0.0.0.0');
  console.log('PID:', process.pid);
  console.log('Address:', server.address());
});
server.on('error', (e) => console.log('Error:', e.code));
setTimeout(() => {}, 60000);
