const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Check configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Error: Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env first.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PUBLIC_DIR = path.join(__dirname, '..', 'frontend', 'public');
const OUTPUT_MAPPING_FILE = path.join(__dirname, 'cloudinary_mapping.json');

// Supported extensions
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.mp4'];

async function migrate() {
  console.log(`Scanning public directory: ${PUBLIC_DIR}`);
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`Error: Public directory does not exist at ${PUBLIC_DIR}`);
    return;
  }

  const files = fs.readdirSync(PUBLIC_DIR);
  const mediaFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return EXTENSIONS.includes(ext);
  });

  console.log(`Found ${mediaFiles.length} media files to migrate.`);
  
  const mapping = {};

  for (const file of mediaFiles) {
    const filePath = path.join(PUBLIC_DIR, file);
    const ext = path.extname(file).toLowerCase();
    const isVideo = ext === '.mp4';
    const resourceType = isVideo ? 'video' : 'image';

    console.log(`Uploading ${file} (${resourceType})...`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'nextskin',
        resource_type: resourceType,
        public_id: path.basename(file, ext),
        overwrite: true,
      });

      // Save mapping: /filename.ext -> secure url
      // Example: /aha_bha_face_serum.jpg -> https://res.cloudinary.com/cloud/image/upload/v1234/nextskin/aha_bha_face_serum.jpg
      mapping[`/${file}`] = result.secure_url;
      console.log(`✓ Successfully uploaded: /${file} -> ${result.secure_url}`);
    } catch (error) {
      console.error(`✗ Failed to upload ${file}:`, error.message);
    }
  }

  // Write mapping to JSON
  fs.writeFileSync(OUTPUT_MAPPING_FILE, JSON.stringify(mapping, null, 2));
  console.log(`\nMigration completed! Mapping file saved to ${OUTPUT_MAPPING_FILE}`);

  // Write mapping to frontend source directory if it exists
  const FRONTEND_MAPPING_FILE = path.join(__dirname, '..', 'frontend', 'src', 'utils', 'cloudinary_mapping.json');
  try {
    fs.writeFileSync(FRONTEND_MAPPING_FILE, JSON.stringify(mapping, null, 2));
    console.log(`✓ Also saved frontend mapping to ${FRONTEND_MAPPING_FILE}`);
  } catch (err) {
    console.warn(`! Could not write frontend mapping: ${err.message}`);
  }

  console.log('You can use this mapping file to update product values in the database or import scripts.');
}

migrate();
