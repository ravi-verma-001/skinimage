export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' &&
  !window.location.hostname.includes('localhost') &&
  !window.location.hostname.includes('127.0.0.1')
    ? 'https://skinimage.onrender.com/api'
    : 'http://localhost:5000/api');

