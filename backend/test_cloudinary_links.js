const fs = require('fs');
const path = require('path');
const https = require('https');

const MAPPING_FILE = path.join(__dirname, '..', 'frontend', 'src', 'utils', 'cloudinary_mapping.json');
const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => {
      resolve(500);
    });
  });
}

async function run() {
  console.log('Checking both versioned and unversioned URLs:');
  for (const [localPath, cloudinaryUrl] of Object.entries(mapping).slice(0, 10)) {
    const unversioned = cloudinaryUrl.replace(/\/v\d+\//, '/');
    const statusV = await checkUrl(cloudinaryUrl);
    const statusU = await checkUrl(unversioned);
    console.log(`${localPath}: Versioned Status = ${statusV} | Unversioned Status = ${statusU}`);
  }
}

run();
