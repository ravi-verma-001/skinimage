const https = require('https');

const data = JSON.stringify({
  productId: '6a6877ddb3275499ede5ae0b',
  rating: 5,
  comment: 'This is a test review for live site',
  userName: 'Test User',
  email: 'test@example.com'
});

const options = {
  hostname: 'skinimage.onrender.com',
  port: 443,
  path: '/api/reviews',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
