export const API_BASE_URL = process.env.NEXT_PUBLIC_BACK_URL || 'http://192.168.100.23:5000/api';

// Image URL uchun alohida function
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${API_BASE_URL}/${cleanPath}`;
};

export const getApiUrl = (endpoint: string) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
