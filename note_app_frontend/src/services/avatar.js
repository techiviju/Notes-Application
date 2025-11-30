 // Utility function to get the correct avatar source URL
export function getAvatarSrc(url) {
  if (!url) return "/default-avatar.png";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (url.startsWith("http")) return url;
  // return url.startsWith("/") ? `https://notesapp-back-ka.onrender.com${url}` : `https://notesapp-back-ka.onrender.com/${url}`;
  return url.startsWith("/") ? `http://localhost:8080${url}` : `http://localhost:8080/${url}`;

}

