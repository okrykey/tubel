export const generateUsername = () => {
  const randomString = Math.random().toString(36).substring(2, 12);
  return randomString;
};
