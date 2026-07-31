import mappingData from './cloudinary_mapping.json';

// Type assertion for mapping
const mapping: Record<string, string> = mappingData as Record<string, string>;

/**
 * Utility to optimize Cloudinary images and videos using URL-based transformations.
 * Automatically translates local paths (e.g., /aha_bha_face_serum.jpg) to Cloudinary URLs
 * if a mapping exists in cloudinary_mapping.json.
 * Falls back to local paths if no mapping exists.
 */
export const getOptimizedMediaUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    resourceType?: 'image' | 'video';
  } = {}
): string => {
  if (!url) return '';

  let finalUrl = url;

  // 1. Resolve local path to Cloudinary URL via mapping if available
  if (url.startsWith('/') && mapping[url]) {
    finalUrl = mapping[url];
  }

  // 2. If it's not a Cloudinary URL (no mapping and not a direct Cloudinary URL), return original fallback path
  if (!finalUrl.includes('cloudinary.com')) {
    return finalUrl;
  }

  const { width, height, crop = 'fill', resourceType = 'image' } = options;

  // 3. Split the URL to insert transformations right after '/upload/'
  const separator = '/upload/';
  const parts = finalUrl.split(separator);
  if (parts.length !== 2) {
    return finalUrl;
  }

  const transformations: string[] = ['f_auto', 'q_auto'];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  
  // Only apply crop mode if we are resizing
  if (width || height) {
    transformations.push(`c_${crop}`);
  }

  return `${parts[0]}${separator}${transformations.join(',')}/${parts[1]}`;
};
