export const generateUsername = (name: string) => {
  const slug = name.replace(/\s+/g, "-").toLowerCase();
  const randomString = Math.random().toString(36).substring(2, 10);
  return slug + randomString;
};
