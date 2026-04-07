export const getImageUrl = (path) => {
  if (!path) return "/images/fallback.png";
  if (path.startsWith("http")) return path;
  
  // Clean path: remove leading slash if it exists
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  
  // If the path already starts with 'storage/', don't prepend it again
  if (cleanPath.startsWith("storage/")) {
    return `https://weshelafasapi.fikriti.com/${cleanPath}`;
  }
  
  return `https://weshelafasapi.fikriti.com/storage/${cleanPath}`;
};
