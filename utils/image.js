export const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";
  return path.startsWith("http") ? path : `https://nutrijoy-backend.onrender.com${path}`;
};
