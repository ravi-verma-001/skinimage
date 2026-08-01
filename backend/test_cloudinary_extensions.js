const https = require('https');

const BROKEN_IDS = [
  'aha_bha_face_serum',
  'aha_bha_serum',
  'benzotree_face_wash',
  'centella_soothing_gel',
  'cleanser',
  'c_peptide_serum',
  'Gluta_foming',
  'pdrn_regenerating_serum',
  'sugarcane_squalane_oil',
  'uv_aurora_sunscreen',
  'vitc_serum'
];

const EXTENSIONS = ['jpg', 'png', 'jpeg', 'webp', 'JPG', 'PNG'];

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
  console.log('Searching for correct extensions on Cloudinary:');
  for (const id of BROKEN_IDS) {
    let found = false;
    for (const ext of EXTENSIONS) {
      const url = `https://res.cloudinary.com/qm72f5jf/image/upload/nextskin/${id}.${ext}`;
      const status = await checkUrl(url);
      if (status === 200) {
        console.log(`✓ FOUND: ${id} -> nextskin/${id}.${ext}`);
        found = true;
        break;
      }
    }
    if (!found) {
      // Let's also check if it's in the root folder instead of nextskin/
      for (const ext of EXTENSIONS) {
        const url = `https://res.cloudinary.com/qm72f5jf/image/upload/${id}.${ext}`;
        const status = await checkUrl(url);
        if (status === 200) {
          console.log(`✓ FOUND IN ROOT: ${id} -> ${id}.${ext}`);
          found = true;
          break;
        }
      }
    }
    if (!found) {
      console.log(`✗ NOT FOUND ANYWHERE: ${id}`);
    }
  }
}

run();
