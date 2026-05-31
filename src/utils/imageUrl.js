import { STORAGE_BASE_URL } from '../service/api/axiosClient';

export const getImageUrl = (path) => {
  if (!path) return "/images/fallback.png";
  
  // If it's already a full URL (http or https), return it
  if (path.startsWith("http")) return path;
  
  // For safety, handle relative paths by assuming they are from the local backend if not absolute
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  
  // Only fallback if the path doesn't look like an absolute URL
  return `${STORAGE_BASE_URL}/${cleanPath}`;
};
