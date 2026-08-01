const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const response = await cloudinary.api.resources({ type: 'upload', max_results: 500 });
  const names = response.resources.map(res => `${res.public_id} (${res.secure_url})`);
  console.log(names.join('\n'));
}

run();
