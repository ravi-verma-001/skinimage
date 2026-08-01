const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAPPING_FILE_FRONTEND = path.join(__dirname, '..', 'frontend', 'src', 'utils', 'cloudinary_mapping.json');

async function run() {
  console.log('Fetching all assets from Cloudinary...');
  try {
    let allResources = [];
    let nextCursor = null;

    // Fetch up to 500 resources (both images and videos)
    do {
      const response = await cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        next_cursor: nextCursor
      });
      allResources = allResources.concat(response.resources);
      nextCursor = response.next_cursor;
    } while (nextCursor);

    // Fetch videos separately just in case
    try {
      const videoResponse = await cloudinary.api.resources({
        resource_type: 'video',
        type: 'upload',
        max_results: 100
      });
      allResources = allResources.concat(videoResponse.resources);
    } catch (e) {
      console.log('No video resources found or error listing videos:', e.message);
    }

    console.log(`Successfully fetched ${allResources.length} assets from Cloudinary.`);

    // Load existing mapping
    let mapping = {};
    if (fs.existsSync(MAPPING_FILE_FRONTEND)) {
      mapping = JSON.parse(fs.readFileSync(MAPPING_FILE_FRONTEND, 'utf-8'));
    }

    // We want to match local paths like "/benzotree_face_wash.png" to Cloudinary resources
    // A resource matches if the local file's name (without extension) is a prefix of the Cloudinary public_id
    // For example: local "benzotree_face_wash" matches Cloudinary "benzotree_face_wash_c0ombj" or "nextskin/benzotree_face_wash"
    let updatedCount = 0;
    
    for (const localPath of Object.keys(mapping)) {
      // Get base name without extension, e.g. "benzotree_face_wash"
      const localBaseName = path.basename(localPath, path.extname(localPath));

      // Find the best match in Cloudinary resources
      // Order by match quality: exact match or contains the base name
      const matches = allResources.filter(res => {
        const resName = path.basename(res.public_id); // e.g. "benzotree_face_wash_c0ombj"
        return resName === localBaseName || resName.startsWith(localBaseName + '_') || resName === localBaseName + '_c0ombj' || res.public_id.includes(localBaseName);
      });

      if (matches.length > 0) {
        // Sort matches: prefer exact match first, then shortest name, then most recently created
        matches.sort((a, b) => {
          const aName = path.basename(a.public_id);
          const bName = path.basename(b.public_id);
          if (aName === localBaseName) return -1;
          if (bName === localBaseName) return 1;
          
          // Sort by creation date descending to get the latest upload
          return new Date(b.created_at) - new Date(a.created_at);
        });

        const bestMatch = matches[0];
        const newUrl = bestMatch.secure_url;
        
        if (mapping[localPath] !== newUrl) {
          console.log(`Updating ${localPath}:`);
          console.log(`  Old: ${mapping[localPath]}`);
          console.log(`  New: ${newUrl}`);
          mapping[localPath] = newUrl;
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No match found in Cloudinary for: ${localPath}`);
      }
    }

    if (updatedCount > 0) {
      fs.writeFileSync(MAPPING_FILE_FRONTEND, JSON.stringify(mapping, null, 2));
      // Write to backend as well if exists
      const BACKEND_MAPPING_FILE = path.join(__dirname, 'cloudinary_mapping.json');
      fs.writeFileSync(BACKEND_MAPPING_FILE, JSON.stringify(mapping, null, 2));
      console.log(`\nSuccess! Updated ${updatedCount} mapping entries.`);
    } else {
      console.log('\nNo updates needed. All mappings are up to date.');
    }

  } catch (error) {
    console.error('Error scanning Cloudinary assets:', error);
  }
}

run();
